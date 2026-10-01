import { resolve } from 'node:path';
import { defineConfig, type DefaultTheme } from 'vitepress';
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
const markdownFiles = listMarkdownFiles(PACKAGES_DIR);
const readmePages = selectReadmePages(markdownFiles);

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

export default defineConfig({
    title: 'Vlossom',
    description: 'Vue 3 UI component library',

    // VitePress는 srcDir 안의 파일만 페이지로 만든다. README를 복사하지 않으려고 srcDir를 packages/로 넓힌다.
    srcDir: '..',
    srcExclude: toSrcExclude(markdownFiles, readmePages),
    rewrites: toRewrites(markdownFiles, readmePages),

    markdown: {
        config: (md) => {
            md.use(readmeLinks, { srcDir: PACKAGES_DIR, pages: readmePages });
        },
    },

    vite: {
        resolve: {
            // README 페이지 모듈은 packages/vlossom 아래에 있어 bare import 'vue'를 packages/vlossom/node_modules부터 찾는다.
            // CI처럼 docs 패키지만 설치한 환경에서는 그 경로가 없어 빌드가 깨지므로 docs의 vue로 고정한다.
            alias: [{ find: VUE_SUBPATH, replacement: `${resolve(import.meta.dirname, '../node_modules/vue')}$1` }],
        },
    },

    themeConfig: {
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
