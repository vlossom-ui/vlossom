import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vitepress';
import { liveDemo } from './live-demo.ts';

const COMPONENTS_DIR = resolve(import.meta.dirname, '../../vlossom/src/components');

function pascalCase(kebab: string): string {
    return kebab
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

const components = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('vs-'))
    .map((entry) => entry.name)
    .filter((name) => existsSync(resolve(COMPONENTS_DIR, name, 'README.md')))
    .sort();

export default defineConfig({
    title: 'Vlossom',
    description: 'Vue 3 UI component library',
    base: '/vlossom/',
    lang: 'en-US',

    // README 파일 자체를 문서 페이지로 쓴다. 복사본을 만들지 않는다.
    srcDir: '..',
    srcExclude: [
        'docs/.vitepress/**',
        'vlossom-mcp/**',
        'vlossom/CHANGELOG.md',
        'vlossom/README.md',
        'vlossom/VLOSSOM_USAGE_GUIDE.md',
        'vlossom/dist/**',
        'vlossom/storybook-static/**',
        'vlossom/src/.claude/**',
        'vlossom/src/components/*.md',
        'vlossom/src/components/**/README.ko.md',
        // 컴포넌트 외 유닛은 프로토타입 범위 밖
        'vlossom/src/composables/**',
        'vlossom/src/directives/**',
        'vlossom/src/plugins/**',
        'vlossom/src/utils/**',
    ],
    rewrites: {
        'docs/pages/:page.md': ':page.md',
        'vlossom/src/components/:comp/README.md': 'components/:comp.md',
    },

    markdown: {
        config: liveDemo,
    },

    themeConfig: {
        nav: [{ text: 'Components', link: '/components/vs-button' }],
        sidebar: [
            {
                text: 'Components',
                items: components.map((name) => ({
                    text: pascalCase(name),
                    link: `/components/${name}`,
                })),
            },
        ],
        socialLinks: [{ icon: 'github', link: 'https://github.com/vlossom-ui/vlossom' }],
    },
});
