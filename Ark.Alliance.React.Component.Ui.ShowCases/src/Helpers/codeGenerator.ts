/**
 * @fileoverview Code Snippet Generator
 * @module Helpers/codeGenerator
 */


export const generateCode = (
    componentName: string,
    props: Record<string, any>,
    language: 'ts' | 'js' | 'go' | 'blazor'
): string => {
    switch (language) {
        case 'ts':
        case 'js':
            return generateReactCode(componentName, props);
        case 'go':
            return generateGoCode(componentName, props);
        case 'blazor':
            return generateBlazorCode(componentName, props);
        default:
            return '';
    }
};

const formatValue = (value: any): string => {
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'boolean') return value ? 'true' : 'false'; // In JSX true is default so usually implicit
    if (typeof value === 'object') return `{${JSON.stringify(value)}}`;
    return String(value);
};

const generateReactCode = (name: string, props: Record<string, any>) => {
    const propStrings = Object.entries(props)
        .filter(([_, value]) => value !== undefined && value !== null && value !== false)
        .map(([key, value]) => {
            if (value === true) return key;
            if (typeof value === 'string') return `${key}="${value}"`;
            return `${key}={${formatValue(value)}}`;
        });

    const propsLine = propStrings.length > 0 ? ` ${propStrings.join(' ')}` : '';
    return `<${name}${propsLine} />`;
};

const generateGoCode = (name: string, props: Record<string, any>) => {
    // Mock Go/Templ syntax
    const propStrings = Object.entries(props)
        .map(([key, value]) => `${key}: ${formatValue(value)}`)
        .join(', ');
    return `${name}(${propStrings})`;
};

const generateBlazorCode = (name: string, props: Record<string, any>) => {
    const propStrings = Object.entries(props)
        .map(([key, value]) => {
            const val = typeof value === 'string' ? `"${value}"` : `{${value}}`;
            return `${key.charAt(0).toUpperCase() + key.slice(1)}=${val}`;
        })
        .join(' ');
    return `<${name} ${propStrings} />`;
};
