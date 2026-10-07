import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { containVlossomStyles, vlossomSiteStyles } from './vlossom-css.ts';

const SITE_WIDE = /^(?:html|body|::-webkit-)/;
const SCOPED = /^:where\(\.vs-demo, body > :not\(#app\)\) /;
const GLOBAL = /^(?:\.vs-|:root\b)/;

describe('containVlossomStyles', () => {
    it('레이어 밖의 html·body·스크롤바 규칙과 외부 @import만 뺀다', () => {
        const css = [
            '@import "https://cdn.example.com/font.css";',
            '@layer components;',
            '@layer base{html{line-height:1}}',
            'html{font-size:15px}',
            'html,body{font-family:P;background-color:var(--vs-app-bg)}',
            'body{color:red}',
            '::-webkit-scrollbar{width:8px}',
            '::-webkit-scrollbar-thumb:hover{background-color:#0008}',
            '.vs-button{color:blue}',
            ':root{--vs-a:1}',
            '@keyframes vs-fade{0%{opacity:0}to{opacity:1}}',
            '[data-focusable]{border:1px solid #0000}',
        ].join('');

        expect(containVlossomStyles(css)).toBe(
            [
                '@layer components;',
                '@layer base{html{line-height:1}}',
                '.vs-button{color:blue}',
                ':root{--vs-a:1}',
                '@keyframes vs-fade{0%{opacity:0}to{opacity:1}}',
                '[data-focusable]{border:1px solid #0000}',
            ].join(''),
        );
    });

    it('스크롤바가 아니어도 ::-webkit-으로 시작하는 전역 규칙은 빼고, 요소에 붙은 규칙은 둔다', () => {
        const css = [
            '::-webkit-resizer{display:none}',
            '::-webkit-scrollbar-corner{background:red}',
            'input::-webkit-search-decoration{display:none}',
            '.vs-a{color:blue}',
        ].join('');

        expect(containVlossomStyles(css)).toBe('input::-webkit-search-decoration{display:none}.vs-a{color:blue}');
    });

    it('앞에 주석이 붙은 사이트 전역 규칙도 뺀다', () => {
        expect(
            containVlossomStyles('/*! a */html{color:red}/* b */@import "https://x.test/a.css";.vs-a{color:blue}'),
        ).toBe('/*! a *//* b */.vs-a{color:blue}');
    });

    it('문자열 안의 중괄호와 세미콜론은 규칙 경계로 보지 않는다', () => {
        expect(containVlossomStyles('.vs-x:before{content:"{;}"}body{color:red}')).toBe('.vs-x:before{content:"{;}"}');
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
                `${scope} .dark\\:bg-x:where(.vs-dark,.vs-dark *){color:red}`,
                '}',
            ].join(''),
        );
    });

    it('utilities 레이어의 vlossom 클래스와 :root 규칙은 전역으로 둔다', () => {
        const css = '@layer utilities{.vs-disabled{opacity:.5}:root .vs-state-info{--a:1}}.outline{color:red}';

        expect(containVlossomStyles(css)).toBe(css);
    });

    it('설치된 vlossom.css를 바꾸면 사이트 전역 규칙이 없고 유틸리티는 한정된 범위나 vlossom 클래스에만 걸린다', () => {
        const css = readFileSync(createRequire(import.meta.url).resolve('vlossom/styles'), 'utf8');
        const root = postcss.parse(containVlossomStyles(css));
        const leaks: string[] = [];
        const scoped: string[] = [];

        root.each((node) => {
            if (node.type === 'atrule' && node.name === 'import') {
                leaks.push(`@import ${node.params}`);
            }
            if (node.type === 'rule' && node.selectors.some((selector) => SITE_WIDE.test(selector))) {
                leaks.push(node.selector);
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
});

describe('vlossomSiteStyles', () => {
    it('vlossom 패키지의 CSS에만 적용한다', () => {
        const transform = vlossomSiteStyles().transform as (code: string, id: string) => string | undefined;

        expect(transform('body{color:red}', 'C:/repo/node_modules/vlossom/dist/vlossom.css')).toBe('');
        expect(transform('body{color:red}', 'C:/repo/node_modules/vlossom/dist/vlossom.css?direct')).toBe('');
        expect(transform('body{color:red}', 'C:/repo/src/other.css')).toBeUndefined();
    });
});
