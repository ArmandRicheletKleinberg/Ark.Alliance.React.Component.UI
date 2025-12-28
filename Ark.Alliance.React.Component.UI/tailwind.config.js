/**
 * @fileoverview Tailwind CSS Configuration
 * @module Ark.Alliance.React.Component.UI
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
                // Ark Alliance Brand Colors
                'ark-primary': 'var(--ark-primary, #3b82f6)',
                'ark-primary-hover': 'var(--ark-primary-hover, #2563eb)',
                'ark-secondary': 'var(--ark-secondary, #6366f1)',
                'ark-accent': 'var(--ark-accent, #22d3ee)',

                // Semantic Colors
                'ark-success': 'var(--ark-success, #10b981)',
                'ark-warning': 'var(--ark-warning, #f59e0b)',
                'ark-error': 'var(--ark-error, #ef4444)',
                'ark-info': 'var(--ark-info, #3b82f6)',

                // Background Colors
                'ark-bg': {
                    primary: 'var(--ark-bg-primary, #ffffff)',
                    secondary: 'var(--ark-bg-secondary, #f3f4f6)',
                    tertiary: 'var(--ark-bg-tertiary, #e5e7eb)',
                },

                // Text Colors
                'ark-text': {
                    primary: 'var(--ark-text-primary, #111827)',
                    secondary: 'var(--ark-text-secondary, #6b7280)',
                    muted: 'var(--ark-text-muted, #9ca3af)',
                },

                // Border Colors
                'ark-border': 'var(--ark-border, #e5e7eb)',
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
