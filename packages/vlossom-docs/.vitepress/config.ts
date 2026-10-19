import { relative, resolve, sep } from 'node:path';
import { defineConfig, postcssIsolateStyles, type DefaultTheme } from 'vitepress';
import { DEMO_IMAGES, DEMO_SCOPE } from './demo-scope.ts';
import { DemoRegistry, liveDemos } from './live-demo.ts';
import { vlossomSiteStyles } from './vlossom-css.ts';
import {
    listMarkdownFiles,
    pageLink,
    readmeLinks,
    selectReadmePages,
    toRewrites,
    toSidebar,
    toSrcExclude,
    type ReadmeLocale,
} from './readme-pages.ts';

const PACKAGES_DIR = resolve(import.meta.dirname, '../..');
const VUE_SUBPATH = /^vue(\/.*)?$/;
const VLOSSOM_RUNTIME = resolve(import.meta.dirname, 'theme/vlossom.ts');
const markdownFiles = listMarkdownFiles(PACKAGES_DIR);
const readmePages = selectReadmePages(markdownFiles);
// 데모 모듈은 메모리에만 있지만, 안쪽의 bare import를 풀 기준 디렉터리가 필요해 실제 경로 아래 id를 쓴다.
const demoRegistry = new DemoRegistry(resolve(import.meta.dirname, '.demos'));

function componentsNav(locale: ReadmeLocale, text: string): DefaultTheme.NavItem[] {
    const first = readmePages.find((page) => page.locale === locale && page.section === 'components');
    return first ? [{ text, link: pageLink(first) }] : [];
}

const KOREAN_THEME_LABELS: DefaultTheme.Config = {
    outline: { label: '이 페이지에서' },
    docFooter: { prev: '이전 페이지', next: '다음 페이지' },
    darkModeSwitchLabel: '테마',
    lightModeSwitchTitle: '라이트 테마로 전환',
    darkModeSwitchTitle: '다크 테마로 전환',
    sidebarMenuLabel: '메뉴',
    navMenuLabel: '주 메뉴',
    mobileMenuLabel: '메뉴',
    extraMenuLabel: '더 보기',
    returnToTopLabel: '맨 위로',
    langMenuLabel: '언어 변경',
    skipToContentLabel: '본문으로 건너뛰기',
    notFound: {
        title: '페이지를 찾을 수 없습니다',
        quote: '주소가 바뀌었거나 없는 페이지입니다.',
        linkLabel: '홈으로 이동',
        linkText: '홈으로 돌아가기',
    },
};

const KOREAN_SEARCH_LABELS: DefaultTheme.LocalSearchOptions['translations'] = {
    button: { buttonText: '검색', buttonAriaLabel: '검색' },
    modal: {
        displayDetails: '자세한 목록 보기',
        resetButtonTitle: '검색어 지우기',
        backButtonTitle: '검색 닫기',
        noResultsText: '검색 결과 없음',
        footer: {
            selectText: '선택',
            selectKeyAriaLabel: 'Enter 키',
            navigateText: '이동',
            navigateUpKeyAriaLabel: '위쪽 화살표 키',
            navigateDownKeyAriaLabel: '아래쪽 화살표 키',
            closeText: '닫기',
            closeKeyAriaLabel: 'Esc 키',
        },
    },
};

export default defineConfig({
    title: 'Vlossom',
    description: 'Vue 3 UI component library',

    srcDir: PACKAGES_DIR,
    srcExclude: toSrcExclude(markdownFiles, readmePages),
    rewrites: toRewrites(markdownFiles, readmePages),

    markdown: {
        config: (md) => {
            md.use(readmeLinks, { srcDir: PACKAGES_DIR, pages: readmePages });
            md.use(liveDemos, {
                srcDir: PACKAGES_DIR,
                pages: readmePages,
                scope: DEMO_SCOPE,
                images: DEMO_IMAGES,
                registry: demoRegistry,
                runtime: VLOSSOM_RUNTIME,
            });
        },
    },

    transformHead: ({ siteConfig }) => [['link', { rel: 'icon', href: `${siteConfig.site.base}favicon.ico` }]],

    vite: {
        publicDir: 'vlossom/assets',
        plugins: [demoRegistry.vitePlugin(), vlossomSiteStyles()],
        css: { postcss: { plugins: [postcssIsolateStyles({ includeFiles: [/vp-doc\.css/] })] } },
        // vlossom은 동적 import로만 불러와서, 스캐너가 모르면 dev 서버가 첫 로드 뒤에 의존성을 다시 묶고 새로고침한다.
        // include: ['vlossom']은 Vite root(packages/) 기준으로 풀려 워크스페이스의 packages/vlossom을 가리키므로, import하는 파일을 entries로 준다.
        optimizeDeps: { entries: [relative(PACKAGES_DIR, VLOSSOM_RUNTIME).split(sep).join('/')] },
        resolve: {
            // README 페이지 모듈은 packages/vlossom 아래에 있어 bare import 'vue'를 packages/vlossom/node_modules부터 찾는다.
            // CI처럼 docs 패키지만 설치한 환경에서는 그 경로가 없어 빌드가 깨지므로 docs의 vue로 고정한다.
            alias: [{ find: VUE_SUBPATH, replacement: `${resolve(import.meta.dirname, '../node_modules/vue')}$1` }],
        },
    },

    themeConfig: {
        logo: '/vlossom-logo.png',
        search: {
            provider: 'local',
            options: {
                locales: { ko: { translations: KOREAN_SEARCH_LABELS } },
                miniSearch: {
                    options: {
                        // 예: 'VsButton'을 ['VsButton', 'Vs', 'Button']으로 나눠서 'button'이나 'vs-button'으로도 VsButton을 찾게 한다.
                        // VitePress가 이 함수를 소스 문자열로 검색 상자에 넣으므로, 함수 밖의 이름을 쓰면 안 된다.
                        tokenize: (text: string) =>
                            text.split(/[\n\r\p{Z}\p{P}]+/u).flatMap((word) => {
                                const parts = word.replace(/([a-z\d])([A-Z])/g, '$1 $2').split(' ');
                                return parts.length > 1 ? [word, ...parts] : [word];
                            }),
                    },
                },
            },
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/vlossom-ui/vlossom' }],
    },

    locales: {
        root: {
            label: 'English',
            lang: 'en-US',
            themeConfig: {
                nav: componentsNav('root', 'Components'),
                sidebar: toSidebar(readmePages, 'root'),
            },
        },
        ko: {
            label: '한국어',
            lang: 'ko-KR',
            link: '/ko/',
            description: 'Vue 3 UI 컴포넌트 라이브러리',
            themeConfig: {
                ...KOREAN_THEME_LABELS,
                nav: componentsNav('ko', '컴포넌트'),
                sidebar: toSidebar(readmePages, 'ko'),
            },
        },
    },
});
