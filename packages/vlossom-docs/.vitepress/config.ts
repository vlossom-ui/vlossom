import { resolve } from 'node:path';
import { defineConfig } from 'vitepress';
import {
    listMarkdownFiles,
    pageLink,
    readmeLinks,
    selectReadmePages,
    toRewrites,
    toSidebar,
    toSrcExclude,
} from './readme-pages.ts';

const PACKAGES_DIR = resolve(import.meta.dirname, '../..');
const VUE_SUBPATH = /^vue(\/.*)?$/;
const markdownFiles = listMarkdownFiles(PACKAGES_DIR);
const readmePages = selectReadmePages(markdownFiles);
const firstComponent = readmePages.find((page) => page.section === 'components');

export default defineConfig({
    title: 'Vlossom',
    description: 'Vue 3 UI component library',
    lang: 'en-US',

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
        nav: firstComponent ? [{ text: 'Components', link: pageLink(firstComponent) }] : [],
        sidebar: toSidebar(readmePages),
        socialLinks: [{ icon: 'github', link: 'https://github.com/vlossom-ui/vlossom' }],
    },
});
