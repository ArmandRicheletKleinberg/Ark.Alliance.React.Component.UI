/**
 * @fileoverview StructuredDataScript Component
 * @module components/SEO/StructuredDataScript
 * @description Utility component to inject JSON-LD structured data schemas into the page.
 * Supports multiple schemas, validation in development mode, and SSR compatibility.
 * 
 * @example
 * ```tsx
 * <StructuredDataScript
 *   schemas={[
 *     {
 *       '@context': 'https://schema.org',
 *       '@type': 'Organization',
 *       name: 'Ark Alliance',
 *       url: 'https://example.com'
 *     }
 *   ]}
 *   validate={process.env.NODE_ENV === 'development'}
 * />
 * ```
 */

import { memo } from 'react';
import { validateSchema } from '../../../Helpers/seo/generateSchema';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface StructuredDataScriptProps {
    /** Single schema or array of schemas to embed */
    schemas: Record<string, any> | Record<string, any>[];

    /** Validate schemas in development (logs warnings) */
    validate?: boolean;

    /** Pretty-print JSON (2-space indent) */
    prettyPrint?: boolean;

    /** Additional script attributes */
    scriptProps?: React.ScriptHTMLAttributes<HTMLScriptElement>;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const StructuredDataScript = memo(function StructuredDataScript(props: StructuredDataScriptProps) {
    const {
        schemas,
        validate = false,
        prettyPrint = true,
        scriptProps = {},
    } = props;

    // Normalize to array
    const schemaArray = Array.isArray(schemas) ? schemas : [schemas];

    // Validate schemas (development only)
    if (validate && typeof window !== 'undefined') {
        schemaArray.forEach((schema, index) => {
            if (!validateSchema(schema)) {
                console.warn(`[StructuredDataScript] Schema ${index} validation failed:`, schema);
            }
        });
    }

    return (
        <>
            {schemaArray.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: prettyPrint
                            ? JSON.stringify(schema, null, 2)
                            : JSON.stringify(schema),
                    }}
                    {...scriptProps}
                />
            ))}
        </>
    );
});

StructuredDataScript.displayName = 'StructuredDataScript';

export default StructuredDataScript;
