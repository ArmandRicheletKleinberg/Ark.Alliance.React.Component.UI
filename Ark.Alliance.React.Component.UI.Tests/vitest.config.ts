/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./setup.ts'],
        include: ['**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'setup.ts',
                '**/*.d.ts',
            ],
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
    resolve: {
        alias: {
            // Ensure single React instance across test project and UI library
            'react': resolve(__dirname, 'node_modules/react'),
            'react-dom': resolve(__dirname, 'node_modules/react-dom'),
            // Path aliases for UI library
            '@': resolve(__dirname, '../Ark.Alliance.React.Component.UI/src'),
            '@core': resolve(__dirname, '../Ark.Alliance.React.Component.UI/src/core'),
            '@components': resolve(__dirname, '../Ark.Alliance.React.Component.UI/src/components'),
            '@lib': resolve(__dirname, '../Ark.Alliance.React.Component.UI/src'),
        },
    },
});
