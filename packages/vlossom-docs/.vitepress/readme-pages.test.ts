import { resolve } from 'node:path';
import { createMarkdownRenderer, disposeMdItInstance, resolveConfig } from 'vitepress';
import { afterEach, describe, expect, it } from 'vitest';
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
    locale: 'root',
};
const BUTTON_KO: ReadmePage = {
    source: 'vlossom/src/components/vs-button/README.ko.md',
    route: 'ko/components/vs-button.md',
    section: 'components',
    name: 'vs-button',
    locale: 'ko',
};
const INPUT_WRAPPER: ReadmePage = {
    source: 'vlossom/src/components/vs-input-wrapper/README.md',
    route: 'components/vs-input-wrapper.md',
    section: 'components',
    name: 'vs-input-wrapper',
    locale: 'root',
};
const INPUT_WRAPPER_KO: ReadmePage = {
    source: 'vlossom/src/components/vs-input-wrapper/README.ko.md',
    route: 'ko/components/vs-input-wrapper.md',
    section: 'components',
    name: 'vs-input-wrapper',
    locale: 'ko',
};
const MODAL: ReadmePage = {
    source: 'vlossom/src/components/vs-modal/README.md',
    route: 'components/vs-modal.md',
    section: 'components',
    name: 'vs-modal',
    locale: 'root',
};
const SCROLL_LOCK: ReadmePage = {
    source: 'vlossom/src/composables/scroll-lock/README.md',
    route: 'composables/scroll-lock.md',
    section: 'composables',
    name: 'scroll-lock',
    locale: 'root',
};
const MODAL_PLUGIN: ReadmePage = {
    source: 'vlossom/src/plugins/modal-plugin/README.md',
    route: 'plugins/modal-plugin.md',
    section: 'plugins',
    name: 'modal-plugin',
    locale: 'root',
};
const MODAL_PLUGIN_KO: ReadmePage = {
    source: 'vlossom/src/plugins/modal-plugin/README.ko.md',
    route: 'ko/plugins/modal-plugin.md',
    section: 'plugins',
    name: 'modal-plugin',
    locale: 'ko',
};
const UTILS: ReadmePage = {
    source: 'vlossom/src/utils/README.md',
    route: 'utils.md',
    section: 'utils',
    name: 'utils',
    locale: 'root',
};
const UTILS_KO: ReadmePage = {
    source: 'vlossom/src/utils/README.ko.md',
    route: 'ko/utils.md',
    section: 'utils',
    name: 'utils',
    locale: 'ko',
};
const SCROLL_LOCK_KO: ReadmePage = {
    source: 'vlossom/src/composables/scroll-lock/README.ko.md',
    route: 'ko/composables/scroll-lock.md',
    section: 'composables',
    name: 'scroll-lock',
    locale: 'ko',
};
const SHAKE_KO: ReadmePage = {
    source: 'vlossom/src/directives/vs-shake/README.ko.md',
    route: 'ko/directives/vs-shake.md',
    section: 'directives',
    name: 'vs-shake',
    locale: 'ko',
};

describe('selectReadmePages', () => {
    it('섹션 단위 디렉터리의 README.md와 README.ko.md를 언어별 사이트 경로로 매핑한다', () => {
        const files = [
            'vlossom/src/components/vs-button/README.md',
            'vlossom/src/components/vs-button/README.ko.md',
            'vlossom/src/components/vs-button/README.ja.md',
            'vlossom/src/components/COMPONENT_README_TEMPLATE.md',
            'vlossom/src/components/vs-table/parts/README.md',
            'vlossom/src/composables/scroll-lock/README.md',
            'vlossom/src/directives/vs-shake/README.md',
            'vlossom/src/plugins/modal-plugin/README.md',
            'vlossom/src/utils/README.md',
            'vlossom/src/utils/README.ko.md',
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
                locale: 'root',
            },
            MODAL_PLUGIN,
            UTILS,
            BUTTON_KO,
            UTILS_KO,
        ]);
    });

    it('언어, 섹션 순서를 따르고 섹션 안에서는 이름순으로 정렬한다', () => {
        const files = [
            'vlossom/src/components/vs-modal/README.ko.md',
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
            'ko/components/vs-modal.md',
        ]);
    });
});

describe('toSrcExclude', () => {
    it('README 페이지와 문서 사이트 페이지를 뺀 마크다운을 모두 제외한다', () => {
        const files = [
            'vlossom-docs/pages/index.md',
            'vlossom-docs/pages/ko/index.md',
            'vlossom-docs/README.md',
            'vlossom/src/components/vs-button/README.md',
            'vlossom/src/components/vs-button/README.ko.md',
            'vlossom/CHANGELOG.md',
            'vlossom-mcp/README.md',
        ];

        expect(toSrcExclude(files, [BUTTON, BUTTON_KO])).toEqual([
            'vlossom-docs/README.md',
            'vlossom/CHANGELOG.md',
            'vlossom-mcp/README.md',
        ]);
    });
});

describe('toRewrites', () => {
    it('문서 사이트 페이지는 깊이와 상관없이 사이트 루트로, README는 언어별 섹션 경로로 매핑한다', () => {
        const files = [
            'vlossom-docs/pages/index.md',
            'vlossom-docs/pages/ko/index.md',
            'vlossom-docs/README.md',
            'vlossom/src/components/vs-button/README.md',
            'vlossom/src/components/vs-button/README.ko.md',
        ];

        expect(toRewrites(files, [BUTTON, BUTTON_KO])).toEqual({
            'vlossom-docs/pages/index.md': 'index.md',
            'vlossom-docs/pages/ko/index.md': 'ko/index.md',
            'vlossom/src/components/vs-button/README.md': 'components/vs-button.md',
            'vlossom/src/components/vs-button/README.ko.md': 'ko/components/vs-button.md',
        });
    });
});

describe('toSidebar', () => {
    it('영어 사이드바는 영어 페이지만 섹션별로 묶고 컴포넌트 이름은 PascalCase로 보여 준다', () => {
        expect(toSidebar([BUTTON, INPUT_WRAPPER, SCROLL_LOCK, UTILS, BUTTON_KO], 'root')).toEqual([
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

    it('한국어 사이드바는 한국어 페이지만 한국어 섹션 이름으로 묶는다', () => {
        const pages = [BUTTON, BUTTON_KO, INPUT_WRAPPER_KO, SCROLL_LOCK_KO, SHAKE_KO, MODAL_PLUGIN_KO, UTILS_KO];

        expect(toSidebar(pages, 'ko')).toEqual([
            {
                text: '컴포넌트',
                collapsed: false,
                items: [
                    { text: 'VsButton', link: '/ko/components/vs-button' },
                    { text: 'VsInputWrapper', link: '/ko/components/vs-input-wrapper' },
                ],
            },
            {
                text: '컴포저블',
                collapsed: true,
                items: [{ text: 'scroll-lock', link: '/ko/composables/scroll-lock' }],
            },
            {
                text: '디렉티브',
                collapsed: true,
                items: [{ text: 'vs-shake', link: '/ko/directives/vs-shake' }],
            },
            {
                text: '플러그인',
                collapsed: true,
                items: [{ text: 'modal-plugin', link: '/ko/plugins/modal-plugin' }],
            },
            {
                text: '유틸리티',
                collapsed: true,
                items: [{ text: 'utils', link: '/ko/utils' }],
            },
        ]);
    });
});

describe('resolveReadmeLink', () => {
    const pages = [BUTTON, INPUT_WRAPPER, MODAL, MODAL_PLUGIN, UTILS, BUTTON_KO, INPUT_WRAPPER_KO, MODAL_PLUGIN_KO];
    const existingFiles = new Set([
        ...pages.map((page) => page.source),
        'vlossom/src/components/COMPONENT_README_TEMPLATE.md',
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
            '../COMPONENT_README_TEMPLATE.md#props',
            BUTTON.source,
            'https://github.com/vlossom-ui/vlossom/blob/main/packages/vlossom/src/components/COMPONENT_README_TEMPLATE.md#props',
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

    it.each([
        ['영어 README의 언어 안내는 한국어 페이지로', './README.ko.md', BUTTON.source, '/ko/components/vs-button.md'],
        ['한국어 README의 언어 안내는 영어 페이지로', './README.md', BUTTON_KO.source, '/components/vs-button.md'],
        [
            '한국어 README에서 다른 컴포넌트의 영어 README는 한국어 페이지로',
            '../vs-input-wrapper/README.md#types',
            BUTTON_KO.source,
            '/ko/components/vs-input-wrapper.md#types',
        ],
        [
            '한국어 README에서 다른 컴포넌트의 한국어 README는 한국어 페이지로',
            '../vs-input-wrapper/README.ko.md',
            BUTTON_KO.source,
            '/ko/components/vs-input-wrapper.md',
        ],
        [
            '영어 README에서 다른 컴포넌트의 한국어 README는 영어 페이지로',
            '../vs-input-wrapper/README.ko.md',
            BUTTON.source,
            '/components/vs-input-wrapper.md',
        ],
        [
            '현재 언어 페이지가 없으면 원본이 가리키는 페이지로',
            '../../components/vs-modal/README.md',
            MODAL_PLUGIN_KO.source,
            '/components/vs-modal.md',
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

    it('한국어 문서 사이트 페이지에서 README로 가는 링크는 한국어 페이지로 바꾼다', () => {
        const href = '../../../vlossom/src/components/vs-button/README.md';

        expect(resolveReadmeLink(href, 'vlossom-docs/pages/ko/guide.md', pages, exists)).toBe(
            '/ko/components/vs-button.md',
        );
    });

    it('언어를 바꿀 때 대응 페이지에 같은 앵커가 없으면 원래 대상으로 연결한다', () => {
        const hasAnchor = () => false;

        expect(
            resolveReadmeLink('../vs-input-wrapper/README.md#types', BUTTON_KO.source, pages, exists, hasAnchor),
        ).toBe('/components/vs-input-wrapper.md#types');
    });

    it('대응 페이지의 앵커는 디코딩한 id로 확인한다', () => {
        const hasAnchor = (file: string, id: string) => file === INPUT_WRAPPER_KO.source && id === '타입';
        const href = '../vs-input-wrapper/README.md#%ED%83%80%EC%9E%85';

        expect(resolveReadmeLink(href, BUTTON_KO.source, pages, exists, hasAnchor)).toBe(
            '/ko/components/vs-input-wrapper.md#%ED%83%80%EC%9E%85',
        );
    });
});

describe('readmeLinks', () => {
    // createMarkdownRenderer는 렌더러를 모듈 단위로 캐시하므로, 테스트마다 비워야 플러그인 옵션이 반영된다.
    afterEach(() => {
        disposeMdItInstance();
    });

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

    it.each([
        [
            '대응 페이지에 같은 앵커가 있으면 현재 언어 페이지로',
            '## Types',
            'href="/ko/components/vs-input-wrapper.html#types"',
        ],
        [
            '대응 페이지 제목이 달라 앵커가 없으면 원래 대상으로',
            '## 타입',
            'href="/components/vs-input-wrapper.html#types"',
        ],
    ])('%s 연결한다', async (_, koreanHeading, expected) => {
        const srcDir = resolve('/repo/packages');
        const pages = [BUTTON_KO, INPUT_WRAPPER, INPUT_WRAPPER_KO];
        const sources: Record<string, string> = { [INPUT_WRAPPER_KO.source]: `# VsInputWrapper\n\n${koreanHeading}\n` };
        const md = await createMarkdownRenderer(srcDir, {
            config: (instance) => {
                instance.use(readmeLinks, {
                    srcDir,
                    pages,
                    exists: () => true,
                    readFile: (file: string) => sources[file] ?? '',
                });
            },
        });

        const html = await md.renderAsync('[Wrapper](../vs-input-wrapper/README.md#types)', {
            path: resolve(srcDir, BUTTON_KO.route),
            realPath: resolve(srcDir, BUTTON_KO.source),
            relativePath: BUTTON_KO.route,
            cleanUrls: false,
        });

        expect(html).toContain(expected);
    });
});

describe('docs site config', () => {
    it('README 페이지와 문서 사이트 페이지만 언어별 사이트 경로로 매핑하고 언어마다 사이드바를 둔다', async () => {
        const config = await resolveConfig(resolve(import.meta.dirname, '..'), 'build', 'production');
        const allowed =
            /^(vlossom\/src\/(components|composables|directives|plugins)\/[^/]+\/README(\.ko)?\.md|vlossom\/src\/utils\/README(\.ko)?\.md|vlossom-docs\/pages\/.+\.md)$/;
        const { root, ko } = config.site.locales;

        expect(config.pages.filter((page) => !allowed.test(page))).toEqual([]);
        expect(config.rewrites.map).toMatchObject({
            'vlossom-docs/pages/index.md': 'index.md',
            'vlossom-docs/pages/ko/index.md': 'ko/index.md',
            'vlossom/src/components/vs-button/README.md': 'components/vs-button.md',
            'vlossom/src/components/vs-button/README.ko.md': 'ko/components/vs-button.md',
            'vlossom/src/utils/README.ko.md': 'ko/utils.md',
        });
        expect(root).toMatchObject({ label: 'English', lang: 'en-US' });
        expect(ko).toMatchObject({ label: '한국어', lang: 'ko-KR', link: '/ko/' });
        expect(root.themeConfig?.sidebar?.[0]).toMatchObject({ text: 'Components' });
        expect(ko.themeConfig?.sidebar?.[0]).toMatchObject({
            text: '컴포넌트',
            items: expect.arrayContaining([{ text: 'VsButton', link: '/ko/components/vs-button' }]),
        });
    });

    it('테마 문구는 한국어 locale에만 한국어로 둔다', async () => {
        const config = await resolveConfig(resolve(import.meta.dirname, '..'), 'build', 'production');
        const { root, ko } = config.site.locales;

        expect(ko.themeConfig).toMatchObject({
            outline: { label: '이 페이지에서' },
            docFooter: { prev: '이전 페이지', next: '다음 페이지' },
            navMenuLabel: '주 메뉴',
            mobileMenuLabel: '메뉴',
            extraMenuLabel: '더 보기',
        });
        expect(root.themeConfig).not.toHaveProperty('outline');
        expect(root.themeConfig).not.toHaveProperty('docFooter');
        expect(config.site.themeConfig).not.toHaveProperty('outline');
    });
});
