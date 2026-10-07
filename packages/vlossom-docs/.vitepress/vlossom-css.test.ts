import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { containVlossomStyles, vlossomSiteStyles } from './vlossom-css.ts';

const APP_SELECTOR = /^(?:html|body)$/;
const APP_PROPERTIES = ['background-color', 'color', 'font-family', 'font-size'];
const DARK = ':is(.vs-dark,.dark)';
const SCOPED = /^:where\(\.vs-demo, body > :not\(#app\)\) /;
const GLOBAL = /^(?:\.vs-|:root\b|:is\(\.vs-dark,\.dark\) )/;

function installedCss(): string {
    return readFileSync(createRequire(import.meta.url).resolve('vlossom/styles'), 'utf8');
}

describe('containVlossomStyles', () => {
    it('레이어 밖 html·body 규칙에서는 배경색·글자색·글꼴·글자 크기만 남긴다', () => {
        const css = [
            '@import "https://cdn.example.com/font.css";',
            '@layer base{html{line-height:1}}',
            'html{font-size:15px}',
            'html,body{min-height:100vh;font-family:P;background-color:var(--vs-app-bg);line-height:1.5;position:relative}',
            'body{color:red;font-size:1rem}',
            'html{min-width:100%}',
            '.vs-button{color:blue}',
        ].join('');

        expect(containVlossomStyles(css)).toBe(
            [
                '@import "https://cdn.example.com/font.css";',
                '@layer base{html{line-height:1}}',
                'html{font-size:15px}',
                'html,body{font-family:P;background-color:var(--vs-app-bg)}',
                'body{color:red;font-size:1rem}',
                '.vs-button{color:blue}',
            ].join(''),
        );
    });

    it('요소 없이 쓴 스크롤바 규칙은 남긴다', () => {
        const css = '::-webkit-scrollbar{width:8px}::-webkit-scrollbar-thumb:hover{background-color:#0008}';

        expect(containVlossomStyles(css)).toBe(css);
    });

    it('vlossom 다크 모드 선택자는 VitePress 다크 모드(html.dark)에서도 걸리게 한다', () => {
        const css = [
            '@layer base{:root:where(.vs-dark,.vs-dark *){--vs-no-color:#000}}',
            ':root.vs-dark .vs-btn{color:red}',
            '.vs-dark ::-webkit-scrollbar-thumb{background-color:#fff6}',
            '.vs-dark-mode{color:blue}',
        ].join('');

        expect(containVlossomStyles(css)).toBe(
            [
                `@layer base{:root:where(${DARK},${DARK} *){--vs-no-color:#000}}`,
                `:root${DARK} .vs-btn{color:red}`,
                `${DARK} ::-webkit-scrollbar-thumb{background-color:#fff6}`,
                '.vs-dark-mode{color:blue}',
            ].join(''),
        );
    });

    it('앞에 주석이 붙은 html·body 규칙도 다룬다', () => {
        expect(containVlossomStyles('/*! a */html{line-height:1}/* b */body{position:relative}.vs-a{color:blue}')).toBe(
            '/*! a *//* b */.vs-a{color:blue}',
        );
    });

    it('문자열 안의 중괄호와 세미콜론은 규칙 경계로 보지 않는다', () => {
        expect(containVlossomStyles('.vs-x:before{content:"{;}"}body{position:relative}')).toBe(
            '.vs-x:before{content:"{;}"}',
        );
    });

    it('utilities 레이어의 일반 유틸리티는 데모 안과 VitePress 앱 밖(body에 띄운 대화상자 등)에서만 걸리게 한다', () => {
        const css = [
            '@layer utilities{',
            '.container{width:100%}',
            '@media (width>=40rem){.container{max-width:40rem}}',
            '.flex-shrink,.shrink{flex-shrink:1}',
            '.dark\\:bg-x:where(.vs-dark,.vs-dark *){color:red}',
            '}',
        ].join('');
        const scope = ':where(.vs-demo, body > :not(#app))';

        expect(containVlossomStyles(css)).toBe(
            [
                '@layer utilities{',
                `${scope} .container{width:100%}`,
                `@media (width>=40rem){${scope} .container{max-width:40rem}}`,
                `${scope} .flex-shrink,${scope} .shrink{flex-shrink:1}`,
                `${scope} .dark\\:bg-x:where(${DARK},${DARK} *){color:red}`,
                '}',
            ].join(''),
        );
    });

    it('utilities 레이어의 vlossom 클래스와 :root 규칙은 전역으로 둔다', () => {
        const css = '@layer utilities{.vs-disabled{opacity:.5}:root .vs-state-info{--a:1}}.outline{color:red}';

        expect(containVlossomStyles(css)).toBe(css);
    });

    it('설치된 vlossom.css를 바꾸면 html·body에는 정한 속성만 남고 유틸리티는 한정된 범위나 vlossom 클래스에만 걸린다', () => {
        const root = postcss.parse(containVlossomStyles(installedCss()));
        const leaks: string[] = [];
        const scoped: string[] = [];

        root.each((node) => {
            if (node.type === 'rule' && node.selectors.some((selector) => APP_SELECTOR.test(selector))) {
                node.walkDecls((declaration) => {
                    if (!APP_PROPERTIES.includes(declaration.prop)) {
                        leaks.push(`${node.selector} { ${declaration.prop} }`);
                    }
                });
            }
            if (node.type === 'atrule' && node.name === 'layer' && node.params === 'utilities') {
                node.walkRules((rule) => {
                    scoped.push(...rule.selectors.filter((selector) => SCOPED.test(selector)));
                    leaks.push(
                        ...rule.selectors.filter((selector) => !SCOPED.test(selector) && !GLOBAL.test(selector)),
                    );
                });
            }
        });

        expect(leaks).toEqual([]);
        // utilities 레이어 이름이 바뀌면 위 검사가 아무것도 보지 않고 통과하므로, 한정한 선택자가 있는지도 본다.
        expect(scoped.length).toBeGreaterThan(0);
    });

    it('설치된 vlossom.css를 바꾸면 모든 다크 모드 선택자가 html.dark에서도 걸린다', () => {
        const selectors: string[] = [];

        postcss.parse(containVlossomStyles(installedCss())).walkRules((rule) => {
            selectors.push(...rule.selectors);
        });

        expect(selectors.some((selector) => selector.includes(DARK))).toBe(true);
        expect(selectors.filter((selector) => /\.vs-dark(?![\w-])/.test(selector.replaceAll(DARK, '')))).toEqual([]);
    });

    it('설치된 vlossom.css의 @import는 그대로 남는다', () => {
        const imports = (css: string) => {
            const params: string[] = [];
            postcss.parse(css).walkAtRules('import', (rule) => {
                params.push(rule.params);
            });
            return params;
        };

        expect(imports(containVlossomStyles(installedCss()))).toEqual(imports(installedCss()));
    });
});

describe('vlossomSiteStyles', () => {
    it('vlossom 패키지의 CSS에만 적용한다', () => {
        const transform = vlossomSiteStyles().transform as (code: string, id: string) => string | undefined;

        expect(transform('body{position:relative}', 'C:/repo/node_modules/vlossom/dist/vlossom.css')).toBe('');
        expect(transform('body{position:relative}', 'C:/repo/node_modules/vlossom/dist/vlossom.css?direct')).toBe('');
        expect(transform('body{position:relative}', 'C:/repo/src/other.css')).toBeUndefined();
    });
});
