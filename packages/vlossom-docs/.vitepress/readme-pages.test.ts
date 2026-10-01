import { resolve } from 'node:path';
import { createMarkdownRenderer, resolveConfig } from 'vitepress';
import { describe, expect, it } from 'vitest';
import {
    readmeLinks,
    resolveReadmeLink,
    selectReadmePages,
    toRewrites,
    toSidebar,
    toSrcExclude,
    type ReadmePage,
} from './readme-pages.ts';

const BUTTON: ReadmePage = {
    source: 'vlossom/src/components/vs-button/README.md',
    route: 'components/vs-button.md',
    section: 'components',
    name: 'vs-button',
};
const INPUT_WRAPPER: ReadmePage = {
    source: 'vlossom/src/components/vs-input-wrapper/README.md',
    route: 'components/vs-input-wrapper.md',
    section: 'components',
    name: 'vs-input-wrapper',
};
const MODAL: ReadmePage = {
    source: 'vlossom/src/components/vs-modal/README.md',
    route: 'components/vs-modal.md',
    section: 'components',
    name: 'vs-modal',
};
const SCROLL_LOCK: ReadmePage = {
    source: 'vlossom/src/composables/scroll-lock/README.md',
    route: 'composables/scroll-lock.md',
    section: 'composables',
    name: 'scroll-lock',
};
const MODAL_PLUGIN: ReadmePage = {
    source: 'vlossom/src/plugins/modal-plugin/README.md',
    route: 'plugins/modal-plugin.md',
    section: 'plugins',
    name: 'modal-plugin',
};
const UTILS: ReadmePage = {
    source: 'vlossom/src/utils/README.md',
    route: 'utils.md',
    section: 'utils',
    name: 'utils',
};

describe('selectReadmePages', () => {
    it('섹션 단위 디렉터리의 README.md만 사이트 경로로 매핑한다', () => {
        const files = [
            'vlossom/src/components/vs-button/README.md',
            'vlossom/src/components/vs-button/README.ko.md',
            'vlossom/src/components/COMPONENT_README_TEMPLATE.md',
            'vlossom/src/components/vs-table/parts/README.md',
            'vlossom/src/composables/scroll-lock/README.md',
            'vlossom/src/directives/vs-shake/README.md',
            'vlossom/src/plugins/modal-plugin/README.md',
            'vlossom/src/utils/README.md',
            'vlossom/src/utils/UTIL_REAMDE_TEMPLATE.md',
            'vlossom/src/styles/README.md',
            'vlossom/src/.claude/README_CHECK_LIST.md',
            'vlossom/README.md',
            'vlossom/CHANGELOG.md',
            'vlossom-mcp/README.md',
            'vlossom-docs/pages/index.md',
        ];

        expect(selectReadmePages(files)).toEqual([
            BUTTON,
            SCROLL_LOCK,
            {
                source: 'vlossom/src/directives/vs-shake/README.md',
                route: 'directives/vs-shake.md',
                section: 'directives',
                name: 'vs-shake',
            },
            MODAL_PLUGIN,
            UTILS,
        ]);
    });

    it('섹션 순서를 따르고 섹션 안에서는 이름순으로 정렬한다', () => {
        const files = [
            'vlossom/src/utils/README.md',
            'vlossom/src/plugins/modal-plugin/README.md',
            'vlossom/src/components/vs-modal/README.md',
            'vlossom/src/components/vs-button/README.md',
        ];

        expect(selectReadmePages(files).map((page) => page.route)).toEqual([
            'components/vs-button.md',
            'components/vs-modal.md',
            'plugins/modal-plugin.md',
            'utils.md',
        ]);
    });
});

describe('toSrcExclude', () => {
    it('README 페이지와 문서 사이트 페이지를 뺀 마크다운을 모두 제외한다', () => {
        const files = [
            'vlossom-docs/pages/index.md',
            'vlossom-docs/README.md',
            'vlossom/src/components/vs-button/README.md',
            'vlossom/src/components/vs-button/README.ko.md',
            'vlossom/CHANGELOG.md',
            'vlossom-mcp/README.md',
        ];

        expect(toSrcExclude(files, [BUTTON])).toEqual([
            'vlossom-docs/README.md',
            'vlossom/src/components/vs-button/README.ko.md',
            'vlossom/CHANGELOG.md',
            'vlossom-mcp/README.md',
        ]);
    });
});

describe('toRewrites', () => {
    it('문서 사이트 페이지는 깊이와 상관없이 사이트 루트로, README는 섹션 경로로 매핑한다', () => {
        const files = [
            'vlossom-docs/pages/index.md',
            'vlossom-docs/pages/guide/intro.md',
            'vlossom-docs/README.md',
            'vlossom/src/components/vs-button/README.md',
        ];

        expect(toRewrites(files, [BUTTON])).toEqual({
            'vlossom-docs/pages/index.md': 'index.md',
            'vlossom-docs/pages/guide/intro.md': 'guide/intro.md',
            'vlossom/src/components/vs-button/README.md': 'components/vs-button.md',
        });
    });
});

describe('toSidebar', () => {
    it('페이지가 있는 섹션만 그룹으로 만들고 컴포넌트 이름은 PascalCase로 보여 준다', () => {
        expect(toSidebar([BUTTON, INPUT_WRAPPER, SCROLL_LOCK, UTILS])).toEqual([
            {
                text: 'Components',
                collapsed: false,
                items: [
                    { text: 'VsButton', link: '/components/vs-button' },
                    { text: 'VsInputWrapper', link: '/components/vs-input-wrapper' },
                ],
            },
            {
                text: 'Composables',
                collapsed: true,
                items: [{ text: 'scroll-lock', link: '/composables/scroll-lock' }],
            },
            {
                text: 'Utils',
                collapsed: true,
                items: [{ text: 'utils', link: '/utils' }],
            },
        ]);
    });
});

describe('resolveReadmeLink', () => {
    const pages = [BUTTON, INPUT_WRAPPER, MODAL, MODAL_PLUGIN, UTILS];
    const existingFiles = new Set([
        ...pages.map((page) => page.source),
        'vlossom/src/components/vs-button/README.ko.md',
        '../CONTRIBUTING.md',
    ]);
    const exists = (file: string) => existingFiles.has(file);

    it.each([
        ['형제 README', '../vs-input-wrapper/README.md', BUTTON.source, '/components/vs-input-wrapper.md'],
        [
            '앵커를 유지한다',
            '../vs-input-wrapper/README.md#types',
            BUTTON.source,
            '/components/vs-input-wrapper.md#types',
        ],
        ['다른 섹션의 README', '../../components/vs-modal/README.md', MODAL_PLUGIN.source, '/components/vs-modal.md'],
        ['utils README에서 컴포넌트로', '../components/vs-button/README.md', UTILS.source, '/components/vs-button.md'],
        [
            '페이지가 아닌 저장소 파일은 GitHub으로',
            './README.ko.md#props',
            BUTTON.source,
            'https://github.com/vlossom-ui/vlossom/blob/main/packages/vlossom/src/components/vs-button/README.ko.md#props',
        ],
        [
            'srcDir 밖 저장소 파일은 정규화된 GitHub 경로로',
            '../../../../../CONTRIBUTING.md',
            BUTTON.source,
            'https://github.com/vlossom-ui/vlossom/blob/main/CONTRIBUTING.md',
        ],
    ])('%s', (_, href, source, expected) => {
        expect(resolveReadmeLink(href, source, pages, exists)).toBe(expected);
    });

    it('없는 파일로 가는 링크는 바꾸지 않는다', () => {
        expect(resolveReadmeLink('../vs-nope/README.md', BUTTON.source, pages, exists)).toBeUndefined();
    });

    it.each([
        ['외부 링크', 'https://vuejs.org/guide/'],
        ['사이트 절대 경로', '/components/vs-button'],
        ['앵커만 있는 링크', '#props'],
        ['메일 링크', 'mailto:hello@example.com'],
    ])('%s는 같은 경로에 파일이 있어도 바꾸지 않는다', (_, href) => {
        expect(resolveReadmeLink(href, BUTTON.source, pages, () => true)).toBeUndefined();
    });

    it('문서 사이트 페이지끼리의 링크는 바꾸지 않는다', () => {
        expect(resolveReadmeLink('./index.md', 'vlossom-docs/pages/guide.md', pages, () => true)).toBeUndefined();
    });

    it('문서 사이트 페이지에서 README로 가는 링크는 사이트 경로로 바꾼다', () => {
        const href = '../../vlossom/src/components/vs-button/README.md';

        expect(resolveReadmeLink(href, 'vlossom-docs/pages/guide.md', pages, exists)).toBe('/components/vs-button.md');
    });
});

describe('readmeLinks', () => {
    it('VitePress 렌더러에서 rewrites 전 README 위치를 기준으로 링크를 바꾼다', async () => {
        const srcDir = resolve('/repo/packages');
        const pages = [BUTTON, INPUT_WRAPPER];
        const md = await createMarkdownRenderer(srcDir, {
            config: (instance) => {
                instance.use(readmeLinks, { srcDir, pages, exists: () => true });
            },
        });

        const html = await md.renderAsync('[Wrapper](../vs-input-wrapper/README.md#types)', {
            path: resolve(srcDir, BUTTON.route),
            realPath: resolve(srcDir, BUTTON.source),
            relativePath: BUTTON.route,
            cleanUrls: false,
        });

        expect(html).toContain('href="/components/vs-input-wrapper.html#types"');
    });
});

describe('docs site config', () => {
    it('README 페이지와 문서 사이트 페이지만 페이지로 잡고 사이트 경로로 매핑한다', async () => {
        const config = await resolveConfig(resolve(import.meta.dirname, '..'), 'build', 'production');
        const allowed =
            /^(vlossom\/src\/(components|composables|directives|plugins)\/[^/]+\/README\.md|vlossom\/src\/utils\/README\.md|vlossom-docs\/pages\/.+\.md)$/;

        expect(config.pages.filter((page) => !allowed.test(page))).toEqual([]);
        expect(config.rewrites.map).toMatchObject({
            'vlossom-docs/pages/index.md': 'index.md',
            'vlossom/src/components/vs-button/README.md': 'components/vs-button.md',
            'vlossom/src/utils/README.md': 'utils.md',
        });
    });
});
