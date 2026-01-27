/**
 * @fileoverview Code Snippet Generator
 * @module Helpers/codeGenerator
 */

export const generateCode = (
    componentName: string,
    props: Record<string, any>,
    language: 'ts' | 'js' | 'go' | 'blazor'
): string => {
    // Extract children for content rendering
    const { children, ...restProps } = props;

    switch (language) {
        case 'ts':
            return generateTypeScriptCode(componentName, children, restProps);
        case 'js':
            // JS is same as TS but could be stripped of types if we had any logic for that
            // For JSX usage, it's identical
            return generateJavaScriptCode(componentName, children, restProps);
        case 'go':
            return generateGoTemplCode(componentName, children, restProps);
        case 'blazor':
            return generateBlazorCode(componentName, children, restProps);
        default:
            return '';
    }
};

const formatProp = (key: string, value: any): string => {
    if (value === true) return key;
    if (typeof value === 'string') return `${key}="${value}"`;
    if (typeof value === 'number') return `${key}={${value}}`;
    if (Array.isArray(value)) return `${key}={${JSON.stringify(value, null, 2)}}`;
    if (typeof value === 'object') return `${key}={${JSON.stringify(value)}}`;
    return `${key}={${value}}`;
};

const generateTypeScriptCode = (name: string, children: any, props: Record<string, any>): string => {
    const importLine = `import { ${name} } from 'ark-alliance-react-ui';`;

    const propStrings = Object.entries(props)
        .filter(([_, value]) => value !== undefined && value !== null && value !== false && value !== '')
        .map(([key, value]) => formatProp(key, value));

    const propsStr = propStrings.length > 0 ? ` ${propStrings.join(' ')}` : '';

    if (children) {
        return `${importLine}\n\n<${name}${propsStr}>\n    ${children}\n</${name}>`;
    }
    return `${importLine}\n\n<${name}${propsStr} />`;
};

const generateJavaScriptCode = (name: string, children: any, props: Record<string, any>): string => {
    // Reusing TS logic as per E.5.2
    return generateTypeScriptCode(name, children, props);
};

const generateGoTemplCode = (name: string, children: any, props: Record<string, any>): string => {
    // Fix E.2.5 - Correct templ syntax
    // @components.Button(templ.Attributes{"variant": "primary"}) { Click Me }

    const attrStrings = Object.entries(props)
        .filter(([_, value]) => value !== undefined && value !== null && value !== false && value !== '')
        .map(([key, value]) => `"${key}": ${JSON.stringify(value)}`);

    const attrs = attrStrings.length > 0 ? `templ.Attributes{${attrStrings.join(', ')}}` : 'templ.Attributes{}';

    if (children) {
        return `@components.${name}(${attrs}) {\n    ${children}\n}`;
    }
    return `@components.${name}(${attrs})`;
};

const generateBlazorCode = (name: string, children: any, props: Record<string, any>): string => {
    // Fix E.2.6 - PascalCase props and correct boolean syntax

    const propStrings = Object.entries(props)
        .filter(([_, value]) => value !== undefined && value !== null && value !== false && value !== '')
        .map(([key, value]) => {
            // Convert camelCase to PascalCase
            const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);

            if (value === true) return pascalKey; // Boolean attribute
            if (typeof value === 'string') return `${pascalKey}="${value}"`;
            return `${pascalKey}={${JSON.stringify(value)}}`;
        });

    const propsStr = propStrings.length > 0 ? ` ${propStrings.join(' ')}` : '';

    if (children) {
        return `<${name}${propsStr}>\n    ${children}\n</${name}>`;
    }
    return `<${name}${propsStr} />`;
};
