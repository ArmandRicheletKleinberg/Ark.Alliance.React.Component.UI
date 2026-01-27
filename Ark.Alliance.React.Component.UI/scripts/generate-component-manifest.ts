
import { Project, SyntaxKind, Node, ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJ_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.resolve(PROJ_ROOT, 'src');
const COMPONENTS_DIR = path.resolve(SRC_DIR, 'components');
const OUTPUT_FILE = path.resolve(PROJ_ROOT, 'component-manifest.json');

// Initialize ts-morph project
const project = new Project({
    tsConfigFilePath: path.resolve(PROJ_ROOT, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
});

// Add source files
project.addSourceFilesAtPaths([
    path.join(COMPONENTS_DIR, '**/*.tsx'),
    path.join(COMPONENTS_DIR, '**/*.ts'),
]);

interface ComponentProp {
    name: string;
    type: string;
    description: string;
    required: boolean;
    defaultValue?: string;
}

interface ComponentModelField {
    name: string;
    type: string;
    description: string; // from JSDoc if available
    required: boolean;
    defaultValue?: string;
}

interface ComponentMetadata {
    name: string;
    description: string;
    filePath: string;
    props: ComponentProp[];
    modelFields: ComponentModelField[];
}

const componentsRequest: ComponentMetadata[] = [];

function extractJSDocDescription(node: Node): string {
    const jsDocs = (node as any).getJsDocs?.();
    if (jsDocs && jsDocs.length > 0) {
        return jsDocs[0].getDescription().trim();
    }
    return '';
}

function extractModelFields(modelFilePath: string): ComponentModelField[] {
    const fields: ComponentModelField[] = [];
    const sourceFile = project.getSourceFile(modelFilePath);
    if (!sourceFile) return fields;

    // Find the schema definition. Usually [ComponentName]ModelSchema
    // Look for variable declarations that end with 'ModelSchema'
    const schemaVar = sourceFile.getVariableDeclarations().find(v => v.getName().endsWith('ModelSchema'));

    if (schemaVar) {
        const initializer = schemaVar.getInitializer();
        let objectLiteral: ObjectLiteralExpression | undefined;

        if (initializer) {
            // Check if it's a call expression (e.g. extendSchema({...}))
            if (Node.isCallExpression(initializer)) {
                const args = initializer.getArguments();
                if (args.length > 0 && Node.isObjectLiteralExpression(args[0])) {
                    objectLiteral = args[0];
                }
            }
            // Or if it's a direct z.object({...})
            else if (Node.isObjectLiteralExpression(initializer)) {
                objectLiteral = initializer;
            }
            // Handle z.object({...}) call
            else if (Node.isCallExpression(initializer) && initializer.getExpression().getText().includes('z.object')) {
                const args = initializer.getArguments();
                if (args.length > 0 && Node.isObjectLiteralExpression(args[0])) {
                    objectLiteral = args[0];
                }
            }
        }

        if (objectLiteral) {
            for (const prop of objectLiteral.getProperties()) {
                if (Node.isPropertyAssignment(prop)) {
                    const name = prop.getName();
                    const value = prop.getInitializer();
                    let type = 'unknown';
                    let required = true; // Zod default is required unless .optional()
                    let defaultValue = undefined;
                    let description = extractJSDocDescription(prop);

                    if (value) {
                        const valueText = value.getText();
                        // Naive parsing of zod chain
                        if (valueText.includes('.optional()')) required = false;
                        if (valueText.includes('.default(')) {
                            // Try to extract default value
                            const match = valueText.match(/\.default\((.*)\)/);
                            if (match) defaultValue = match[1];
                        }

                        // Try to guess type from zod
                        if (valueText.includes('z.string()')) type = 'string';
                        else if (valueText.includes('z.number()')) type = 'number';
                        else if (valueText.includes('z.boolean()')) type = 'boolean';
                        else if (valueText.includes('z.array')) type = 'array';
                        else if (valueText.includes('z.enum')) type = 'enum';
                        else if (valueText.includes('Schema')) type = 'schema-reference'; // Referenced schema
                        else type = 'custom';
                    }

                    fields.push({
                        name,
                        type,
                        description,
                        required,
                        defaultValue
                    });
                }
            }
        }
    }
    return fields;
}

function processComponent(dir: string) {
    const files = fs.readdirSync(dir);

    // Find definition file: [Component].tsx
    const componentFile = files.find(f => f.endsWith('.tsx') && !f.includes('.test.') && !f.includes('.stories.'));
    if (!componentFile) return;

    const componentName = path.basename(componentFile, '.tsx');
    const filePath = path.join(dir, componentFile);
    const sourceFile = project.getSourceFile(filePath);

    if (!sourceFile) return;

    // Find the component declaration
    const componentDecl = sourceFile.getVariableDeclaration(componentName) || sourceFile.getFunction(componentName);

    // If it's a memo/forwardRef, we might need to look at the variable declaration
    let description = '';
    if (componentDecl) {
        description = extractJSDocDescription(componentDecl);
        // If empty, check the export assignment or the variable statement
        if (!description && Node.isVariableDeclaration(componentDecl)) {
            const stmt = componentDecl.getVariableStatement();
            if (stmt) description = extractJSDocDescription(stmt);
        }
    }

    // Ideally find the JSDoc @fileoverview if component doc is missing
    if (!description && sourceFile) {
        // Safe access to JSDocs on statements
        const fileProcess = sourceFile.getStatements().find(s => {
            // check if method exists
            return typeof (s as any).getJsDocs === 'function' && (s as any).getJsDocs().length > 0;
        });

        if (fileProcess) {
            const docs = (fileProcess as any).getJsDocs();
            const doc = docs.find((d: any) => d.getTags().some((t: any) => t.getTagName() === 'fileoverview' || t.getTagName() === 'component'));
            if (doc) description = doc.getDescription().trim();
        }
    }


    // Props
    const props: ComponentProp[] = [];
    const propsInterface = sourceFile.getInterface(`${componentName}Props`);
    if (propsInterface) {
        const type = propsInterface.getType();
        const properties = type.getProperties();

        for (const propSymbol of properties) {
            const declarations = propSymbol.getDeclarations();
            if (declarations.length > 0) {
                const decl = declarations[0];
                const declSourceFile = decl.getSourceFile();

                // Skip properties from node_modules (React attributes, etc.)
                if (declSourceFile.getFilePath().includes('node_modules')) continue;

                // Check for ignore tags on the symbol or declaration
                const jsDocs = propSymbol.getJsDocTags();
                if (jsDocs.some(t => t.getName() === 'ignore')) continue;

                // Get type text - simplified
                const typeText = propSymbol.getValueDeclaration()?.getType().getText()
                    || propSymbol.getDeclarations()[0].getType().getText();

                // Get description from symbol (merges JSDocs from all declarations)
                const description = propSymbol.compilerSymbol.getDocumentationComment(project.getTypeChecker().compilerObject).map(p => p.text).join('\n');

                props.push({
                    name: propSymbol.getName(),
                    type: typeText,
                    description: description || '',
                    required: !propSymbol.isOptional(),
                });
            }
        }
    }


    // Model
    // Look for both explicit model file and co-located model
    // 1. [Component].model.ts
    // 2. Or just in the same file if defined there (less common in this project)
    let modelFile = files.find(f => f.endsWith('.model.ts'));

    // If not found, check if it fits the pattern ComponentName.model.ts
    if (!modelFile) {
        modelFile = files.find(f => f.endsWith('Model.ts'));
    }

    let modelFields: ComponentModelField[] = [];
    if (modelFile) {
        modelFields = extractModelFields(path.join(dir, modelFile));
    }

    componentsRequest.push({
        name: componentName,
        description,
        filePath: path.relative(PROJ_ROOT, filePath),
        props,
        modelFields
    });
}

function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir);

    // Check if this directory looks like a component directory
    // Criteria: Contains [Name].tsx
    const componentFile = items.find(f => f.endsWith('.tsx') && !f.includes('.test.') && !f.includes('.stories.'));

    if (componentFile) {
        // It is a component directory
        processComponent(dir);
        // Don't recurse further into a component directory usually
        return;
    }

    // Otherwise, recurse into subdirectories
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDirectory(fullPath);
        }
    }
}

function main() {
    console.log(`Scanning ${COMPONENTS_DIR}...`);
    scanDirectory(COMPONENTS_DIR);

    console.log(`Found ${componentsRequest.length} components.`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(componentsRequest, null, 2));
    console.log(`Manifest written to ${OUTPUT_FILE}`);
}

main();
