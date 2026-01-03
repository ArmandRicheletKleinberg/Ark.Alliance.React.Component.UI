/**
 * @fileoverview Tailwind CSS Configuration
 * @module Ark.Alliance.React.Component.Ui.ShowCases
 */

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Ark Alliance Brand Colors (Teal/Neon)
                'ark-primary': 'var(--color-ark-primary)',
                'ark-primary-hover': 'var(--color-ark-primary-hover)',
                'ark-secondary': 'var(--color-ark-secondary)',
                'ark-accent': 'var(--color-ark-accent)',

                // Semantic Colors
                'ark-success': 'var(--color-ark-success)',
                'ark-warning': 'var(--color-ark-warning)',
                'ark-error': 'var(--color-ark-error)',
                'ark-info': 'var(--color-ark-info)',

                // Background Colors
                'ark-bg-primary': 'var(--color-ark-bg-primary)',
                'ark-bg-secondary': 'var(--color-ark-bg-secondary)',
                'ark-bg-tertiary': 'var(--color-ark-bg-tertiary)',

                // Text Colors
                'ark-text-primary': 'var(--color-ark-text-primary)',
                'ark-text-secondary': 'var(--color-ark-text-secondary)',
                'ark-text-muted': 'var(--color-ark-text-muted)',

                // Border Colors
                'ark-border': 'var(--color-ark-border)',
            },
            borderRadius: {
                'ark': 'var(--ark-border-radius, 0.375rem)',
                'ark-lg': 'var(--ark-border-radius-lg, 0.5rem)',
                'ark-xl': 'var(--ark-border-radius-xl, 0.75rem)',
            },
            boxShadow: {
                'ark-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'ark': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'ark-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'ark-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            },
            animation: {
                'ark-spin': 'spin 1s linear infinite',
                'ark-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'ark-fade-in': 'fadeIn 0.2s ease-out',
                'ark-slide-up': 'slideUp 0.3s ease-out',
            },
            fontFamily: {
                'ark-sans': ['Inter', 'system-ui', 'sans-serif'],
                'ark-mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
        },
    },
    plugins: [],
}
