import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

const cssFiles = globSync('./src/**/*.css', { cwd: import.meta.dirname, absolute: true });

// color-scheme.scss는 @each 루프로 --vs-{color}(-soft|-strong)를 만들어서 파일에서 정적으로 추출할 수 없다.
// $colors 목록만 읽어 SCSS와 같은 규칙으로 변수 이름을 다시 만든다.
const colorSchemeScss = fs.readFileSync(path.join(import.meta.dirname, 'src/styles/color-scheme.scss'), 'utf-8');
const colors = (colorSchemeScss.match(/\$colors:([^;]*);/)?.[1] ?? '')
    .split(',')
    .map((color) => color.trim().replaceAll("'", ''))
    .filter(Boolean);
const semanticColorProperties = Object.fromEntries(
    colors.flatMap((color) =>
        [`--vs-${color}-soft`, `--vs-${color}`, `--vs-${color}-strong`].map((name) => [name, '']),
    ),
);

/** @type {import('stylelint').Config} */
export default {
    extends: ['stylelint-config-standard'],
    plugins: ['stylelint-value-no-unknown-custom-properties'],
    ignoreFiles: [
        // Vue files
        '**/*.vue',
        // SCSS files with dynamic variable interpolation
        '**/color-scheme.scss',
        // Dynamic CSS variables set via inline styles from JS
        '**/vs-responsive/VsResponsive.css',
    ],
    rules: {
        // CSS variable validation - main purpose of this config
        'csstools/value-no-unknown-custom-properties': [
            true,
            {
                importFrom: [...cssFiles, { customProperties: semanticColorProperties }],
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
        'hue-degree-notation': 'number',
        'at-rule-prelude-no-invalid': [true, { ignoreAtRules: ['media', 'apply'] }],
    },
};
