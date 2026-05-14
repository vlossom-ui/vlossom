/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import { writeFileSync } from 'node:fs';
import { visualizer } from 'rollup-plugin-visualizer';
import dts from 'vite-plugin-dts';
import prettier from 'prettier';
import { commonConfig } from './vite.config.common';

/**
 * @description format .d.ts files with Prettier before vite write .d.ts to disk
 * @see {@link https://github.com/vlossom-ui/vlossom/issues/357|Issue #357}
 */
async function beforeWriteFile(
    filePath: string,
    content: string,
): Promise<{ filePath: string; content: string } | void> {
    if (!filePath.endsWith('.d.ts')) {
        return;
    }

    const prettierConfig = await prettier.resolveConfig(filePath);
    const formatted = await prettier.format(content, {
        ...prettierConfig,
        parser: 'typescript',
    });

    return { filePath, content: formatted };
}

export default defineConfig({
    ...commonConfig,
    plugins: [
        ...commonConfig.plugins,
        dts({
            tsconfigPath: './tsconfig.app.json',
            rollupTypes: true,
            insertTypesEntry: true,
            beforeWriteFile,
        }),
        visualizer({
            filename: 'visualizer-vlossom.html',
        }),
        {
            name: 'generate-styles-dts',
            closeBundle() {
                writeFileSync('dist/vlossom-styles.d.ts', 'export {};\n');
            },
        },
    ],
    build: {
        lib: {
            entry: fileURLToPath(new URL('./src/main.ts', import.meta.url)),
            name: 'Vlossom',
            fileName: (format) => `vlossom.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
    test: {
        environment: 'jsdom',
        root: fileURLToPath(new URL('./', import.meta.url)),
        setupFiles: ['src/test/test-setup.ts'],
        include: ['src/**/*.test.ts'],
        alias: {
            /**
             * [NOTE]
             * sortablejs = legacy / iife / commonjs / umd
             * so, we need to replace sortablejs with a mock "globally"
             *
             * → Import from @/declaration or @/components
             * → src/components/index.ts
             * → export { default as VsTable } from './vs-table/VsTable.vue'
             * → In VsTable.vue, import type { SortableEvent } from 'sortablejs'
             * → Loads sortablejs module
             * → sortablejs immediately runs navigator.userAgent.match() 💥
             *
             */
            sortablejs: fileURLToPath(new URL('./src/test/__mocks__/sortablejs.ts', import.meta.url)),
        },
    },
});
