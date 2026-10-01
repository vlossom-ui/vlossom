import { defineConfig } from 'vitepress';

export default defineConfig({
    title: 'Vlossom',
    description: 'Vue 3 UI component library',
    lang: 'en-US',

    // 마크다운 페이지는 pages/ 아래에만 둔다. 패키지 README.md 같은 파일이 페이지로 잡히지 않게 한다.
    srcDir: 'pages',

    themeConfig: {
        socialLinks: [{ icon: 'github', link: 'https://github.com/vlossom-ui/vlossom' }],
    },
});
