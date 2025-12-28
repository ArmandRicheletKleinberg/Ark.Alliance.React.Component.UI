/// <reference types="vite/client" />

// Image module declarations
declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.PNG' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}
