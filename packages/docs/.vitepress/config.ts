import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type DefaultTheme } from 'vitepress';
import { liveDemo, vlossomDemoPlugin } from './live-demo.ts';

const SRC = resolve(import.meta.dirname, '../../vlossom/src');

// `vue` 와 그 하위 경로(`vue/server-renderer` 등)를 모두 잡는다.
const VUE_SUBPATH = /^vue(\/.*)?$/;

// 라이브러리 소스에서 문서로 올릴 유닛들. 디렉터리마다 README.md가 하나씩 있다.
const SECTIONS = [
    { dir: 'components', text: 'Components' },
    { dir: 'composables', text: 'Composables' },
    { dir: 'directives', text: 'Directives' },
    { dir: 'plugins', text: 'Plugins' },
] as const;

function pascalCase(kebab: string): string {
    return kebab
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

function unitsIn(dir: string): string[] {
    const root = resolve(SRC, dir);
    if (!existsSync(root)) {
        return [];
    }

    return readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && existsSync(resolve(root, entry.name, 'README.md')))
        .map((entry) => entry.name)
        .sort();
}

function sidebarFor(base: string): DefaultTheme.SidebarItem[] {
    const items: DefaultTheme.SidebarItem[] = SECTIONS.map((section) => ({
        text: section.text,
        collapsed: section.dir !== 'components',
        items: unitsIn(section.dir).map((name) => ({
            text: section.dir === 'components' ? pascalCase(name) : name,
            link: `${base}/${section.dir}/${name}`,
        })),
    })).filter((group) => group.items && group.items.length > 0);

    items.push({ text: 'Utils', items: [{ text: 'utils', link: `${base}/utils` }] });
    items.push({ text: 'Design', items: [{ text: 'Color Palette', link: `${base}/palette` }] });

    return items;
}

// README 파일 자체를 라우트로 쓴다. 영어는 루트, 한국어는 /ko 아래.
const rewrites: Record<string, string> = {
    'docs/pages/ko/:page.md': 'ko/:page.md',
    'docs/pages/:page.md': ':page.md',
    'vlossom/src/utils/README.md': 'utils.md',
    'vlossom/src/utils/README.ko.md': 'ko/utils.md',
};

for (const section of SECTIONS) {
    rewrites[`vlossom/src/${section.dir}/:name/README.md`] = `${section.dir}/:name.md`;
    rewrites[`vlossom/src/${section.dir}/:name/README.ko.md`] = `ko/${section.dir}/:name.md`;
}

export default defineConfig({
    title: 'Vlossom',
    description: 'Vue 3 UI component library',
    base: '/vlossom/',

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
        'vlossom/src/**/*TEMPLATE*.md',
        'vlossom/src/**/*TEMPLETE*.md',
    ],
    rewrites,

    head: [['link', { rel: 'icon', href: '/vlossom/vlossom-logo.png' }]],

    markdown: {
        config: liveDemo,
    },

    vite: {
        // srcDir이 packages/ 라서 기본 publicDir(srcDir/public)이 엉뚱한 곳을 가리킨다.
        publicDir: resolve(import.meta.dirname, '../public'),
        plugins: [vlossomDemoPlugin()],
        resolve: {
            // README에서 만들어진 페이지 모듈은 경로상 packages/vlossom 아래에 놓인다.
            // 그래서 거기서 나온 bare import 'vue'를 packages/vlossom/node_modules부터 찾는다.
            // CI는 packages/docs에만 install하므로 그 경로가 없어 빌드가 깨진다.
            // (로컬은 vlossom을 개발하며 install해둔 게 있어서 우연히 통과했다.)
            alias: [{ find: VUE_SUBPATH, replacement: `${resolve(import.meta.dirname, '../node_modules/vue')}$1` }],
        },
    },

    themeConfig: {
        logo: { src: '/vlossom-logo.png', alt: 'Vlossom' },
        socialLinks: [{ icon: 'github', link: 'https://github.com/vlossom-ui/vlossom' }],
    },

    locales: {
        root: {
            label: 'English',
            lang: 'en-US',
            themeConfig: {
                nav: [
                    { text: 'Components', link: '/components/vs-button' },
                    { text: 'Palette', link: '/palette' },
                ],
                sidebar: sidebarFor(''),
            },
        },
        ko: {
            label: '한국어',
            lang: 'ko-KR',
            description: 'Vue 3 UI 컴포넌트 라이브러리',
            themeConfig: {
                nav: [
                    { text: '컴포넌트', link: '/ko/components/vs-button' },
                    { text: '팔레트', link: '/ko/palette' },
                ],
                sidebar: sidebarFor('/ko'),
            },
        },
    },
});
