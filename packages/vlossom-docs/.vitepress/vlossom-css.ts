import postcss, { type Rule } from 'postcss';
import type { Plugin } from 'vitepress';
import { DEMO_CLASS } from './live-demo.ts';

// vlossom.css의 레이어 밖 html/body 규칙은 앱 전체에 걸리고, @layer __vitepress_base 안의 VitePress 기본 스타일을 이긴다.
// 리뷰에서 vlossom 고유 값을 사이트에도 쓰기로 해서 배경색, 글자색, 글꼴, 글자 크기만 남기고 줄 높이, 굵기, 최소 크기, position은 뺀다.
const APP_SELECTOR = /^(?:html|body)$/;
const APP_PROPERTIES = new Set(['background-color', 'color', 'font-family', 'font-size']);
// vlossom 다크 모드는 html.vs-dark로 켜지는데, vlossom 스크립트는 데모가 있는 페이지에서만 불러온다.
// 모든 페이지가 첫 화면부터 VitePress 다크 모드(html.dark)를 따르도록 .vs-dark를 .dark와 같이 본다.
const DARK_CLASS = /\.vs-dark(?![\w-])/g;
const DARK_SELECTOR = ':is(.vs-dark,.dark)';
// utilities 레이어에는 vlossom 소스에서 만들어진 Tailwind 유틸리티(.container, .outline 등)가 있어 VitePress 클래스와 겹친다.
// vlossom 자신의 클래스(.vs-*)와 :root 규칙만 전역으로 두고, 나머지는 데모 안과 VitePress 앱(#app) 밖에서만 걸리게 한다.
// alert·confirm·prompt 플러그인이 body에 띄우는 대화상자가 이 유틸리티로 배치되기 때문이다.
const VLOSSOM_SELECTOR = /^(?::root\b|\.vs-)/;
const UTILITY_SCOPE = `:where(.${DEMO_CLASS}, body > :not(#app))`;
const VLOSSOM_CSS = /\/vlossom\/dist\/vlossom\.css(?:\?|$)/;

function isAppRule(rule: Rule): boolean {
    return rule.selectors.every((selector) => APP_SELECTOR.test(selector));
}

function keepAppValues(rule: Rule): void {
    rule.walkDecls((declaration) => {
        if (!APP_PROPERTIES.has(declaration.prop)) {
            declaration.remove();
        }
    });
    if (!rule.some((child) => child.type === 'decl')) {
        rule.remove();
    }
}

function scopeSelector(selector: string): string {
    return VLOSSOM_SELECTOR.test(selector) ? selector : `${UTILITY_SCOPE} ${selector}`;
}

export function containVlossomStyles(css: string): string {
    const root = postcss.parse(css);
    root.each((node) => {
        if (node.type === 'rule' && isAppRule(node)) {
            keepAppValues(node);
        } else if (node.type === 'atrule' && node.name === 'layer' && node.params === 'utilities') {
            node.walkRules((rule) => {
                if (rule.parent?.type !== 'rule') {
                    rule.selectors = rule.selectors.map(scopeSelector);
                }
            });
        }
    });
    // 유틸리티 범위를 정한 뒤에 바꿔야 .vs-dark로 시작하는 vlossom 규칙이 전역으로 남는다.
    root.walkRules((rule) => {
        const selector = rule.selector.replace(DARK_CLASS, DARK_SELECTOR);
        if (selector !== rule.selector) {
            rule.selector = selector;
        }
    });
    return root.toString();
}

export function vlossomSiteStyles(): Plugin {
    return {
        name: 'vlossom-site-styles',
        enforce: 'pre',
        transform: (code, id) => (VLOSSOM_CSS.test(id) ? containVlossomStyles(code) : undefined),
    };
}
