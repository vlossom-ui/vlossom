import { resolve } from 'node:path';

/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard'],
    plugins: ['stylelint-value-no-unknown-custom-properties'],
    ignoreFiles: [
        // Vue files
        '**/*.vue',
        // SCSS files with dynamic variable interpolation
        '**/color-scheme.scss',
        // Tailwind CSS color variables (--color-*) reference
        '**/pallete.css',
        // Dynamic CSS variables set via inline styles from JS
        '**/vs-responsive/VsResponsive.css',
        '**/vs-steps/VsSteps.css',
    ],
    rules: {
        // CSS variable validation - main purpose of this config
        'csstools/value-no-unknown-custom-properties': [
            true,
            {
                importFrom: [
                    resolve(import.meta.dirname, './src/styles/variables.css'),
                    resolve(import.meta.dirname, './src/styles/pallete.css'),
                    resolve(import.meta.dirname, './src/styles/state.css'),
                    resolve(import.meta.dirname, './src/styles/color-scheme-variables.css'),
                ],
            },
        ],

        // Tailwind CSS 4 and SCSS at-rules
        'at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: [
                    // Tailwind CSS 4
                    'apply',
                    'layer',
                    'variant',
                    'tailwind',
                    'config',
                    'theme',
                    'source',
                    'utility',
                    'custom-variant',
                    'reference',
                    'container',
                    // SCSS
                    'use',
                    'forward',
                    'import',
                    'mixin',
                    'include',
                    'function',
                    'return',
                    'if',
                    'else',
                    'each',
                    'for',
                    'while',
                    'extend',
                    'at-root',
                    'debug',
                    'warn',
                    'error',
                ],
            },
        ],

        // Tailwind CSS functions
        'function-no-unknown': [
            true,
            {
                ignoreFunctions: ['theme', 'color-mix', '--*'],
            },
        ],

        // Disable style-related rules (focus on CSS variable validation only)
        'declaration-block-single-line-max-declarations': null,
        'declaration-block-no-redundant-longhand-properties': null,
        'declaration-empty-line-before': null,
        'at-rule-empty-line-before': null,
        'declaration-property-value-no-unknown': null,
        'no-invalid-position-at-import-rule': null,
        'no-duplicate-selectors': null,
        'no-descending-specificity': null,
        'custom-property-pattern': null,
        'custom-property-empty-line-before': null,
        'selector-class-pattern': null,
        'selector-pseudo-element-colon-notation': null,
        'selector-not-notation': null,
        'shorthand-property-no-redundant-values': null,
        'property-no-vendor-prefix': null,
        'value-no-vendor-prefix': null,
        'import-notation': null,
        'alpha-value-notation': null,
        'color-function-notation': null,
        'color-function-alias-notation': null,
        'color-hex-length': null,
        'font-family-name-quotes': null,
        'rule-empty-line-before': null,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['global', 'deep'],
            },
        ],
    },
};
