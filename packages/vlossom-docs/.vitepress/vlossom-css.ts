import postcss, { type ChildNode } from 'postcss';
import type { Plugin } from 'vitepress';
import { DEMO_CLASS } from './live-demo.ts';

// vlossom.css의 레이어 밖 html/body 규칙과 요소 없이 쓴 ::-webkit- 의사 요소(스크롤바 등), 외부 폰트 @import는 앱 전체에 거는 전역 스타일이다.
// VitePress 기본 스타일은 @layer __vitepress_base 안에 있어 이 규칙들에 지므로, 문서 사이트 모양을 지키려고 뺀다.
const SITE_WIDE_SELECTOR = /^(?:html|body|::-webkit-[\w:-]+)$/;
const EXTERNAL_URL = /^(?:url\(\s*)?["']?https?:/;
// utilities 레이어에는 vlossom 소스에서 만들어진 Tailwind 유틸리티(.container, .outline 등)가 있어 VitePress 클래스와 겹친다.
// vlossom 자신의 클래스(.vs-*)와 :root 규칙만 전역으로 두고, 나머지는 데모 안과 VitePress 앱(#app) 밖에서만 걸리게 한다.
// alert·confirm·prompt 플러그인이 body에 띄우는 대화상자가 이 유틸리티로 배치되기 때문이다.
const VLOSSOM_SELECTOR = /^(?::root\b|\.vs-)/;
const UTILITY_SCOPE = `:where(.${DEMO_CLASS}, body > :not(#app))`;
const VLOSSOM_CSS = /\/vlossom\/dist\/vlossom\.css(?:\?|$)/;

function isSiteWide(node: ChildNode): boolean {
    if (node.type === 'atrule') {
        return node.name === 'import' && EXTERNAL_URL.test(node.params);
    }
    return node.type === 'rule' && node.selectors.every((selector) => SITE_WIDE_SELECTOR.test(selector));
}

function scopeSelector(selector: string): string {
    return VLOSSOM_SELECTOR.test(selector) ? selector : `${UTILITY_SCOPE} ${selector}`;
}

export function containVlossomStyles(css: string): string {
    const root = postcss.parse(css);
    root.each((node) => {
        if (isSiteWide(node)) {
            node.remove();
        } else if (node.type === 'atrule' && node.name === 'layer' && node.params === 'utilities') {
            node.walkRules((rule) => {
                if (rule.parent?.type !== 'rule') {
                    rule.selectors = rule.selectors.map(scopeSelector);
                }
            });
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
