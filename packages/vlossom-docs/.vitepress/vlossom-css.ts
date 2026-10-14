import postcss, { type Rule } from 'postcss';
import type { Plugin } from 'vitepress';
import { DEMO_CLASS } from './live-demo.ts';

// vlossom.css의 레이어 밖 html/body 규칙은 @layer __vitepress_base 안의 VitePress 기본 스타일을 이긴다.
// 리뷰에서 vlossom 고유 값을 사이트에도 쓰기로 한 속성만 남긴다.
const APP_SELECTOR = /^(?:html|body)$/;
const APP_PROPERTIES = new Set(['background-color', 'color', 'font-family', 'font-size']);
// vlossom 다크 모드는 html.vs-dark로 켜지는데, vlossom 스크립트는 데모가 있는 페이지에서만 불러온다.
// 모든 페이지가 첫 화면부터 VitePress 다크 모드(html.dark)를 따르게 한다.
const DARK_CLASS = /\.vs-dark(?![\w-])/g;
const DARK_SELECTOR = ':is(.vs-dark,.dark)';
// utilities 레이어의 Tailwind 유틸리티(.container, .outline 등)는 VitePress 클래스와 겹친다.
// alert·confirm·prompt 플러그인은 대화상자를 #app 밖 body에 띄우고 이 유틸리티로 배치한다.
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
