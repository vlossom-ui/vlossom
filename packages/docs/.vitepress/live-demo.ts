import type { MarkdownRenderer } from 'vitepress';
import { DEMO_SCOPE } from './demo-scope.ts';

// VitePress는 마크다운 페이지를 Vue SFC 템플릿으로 컴파일한다.
// 그래서 코드펜스 안의 <template> 내용을 HTML로 그대로 흘려보내면
// Vue가 알아서 실제 컴포넌트로 컴파일해준다. 가상 모듈도 런타임 SFC 컴파일도 필요 없다.
//
// 마커는 펜스 info string에 `live`를 덧붙이는 방식이다.
// 첫 토큰이 `html` 그대로라 GitHub 렌더는 바뀌지 않고,
// vlossom-mcp는 코드펜스를 읽지 않으므로 영향이 없다.

const KO_LINK_LINE = /^> 한국어 문서는 .*$\r?\n?/m;
// README의 상대 링크는 GitHub 기준이라 사이트에서는 깨진다.
const SIBLING_README_LINK = /\]\(\.\.\/(vs-[a-z0-9-]+)\/README\.md(#[a-z0-9-]+)?\)/g;
const LIVE_MARKER = /(^|\s)live(?=\s|$)/;
const OPEN_TAG = '<template>';
const CLOSE_TAG = '</template>';

function componentOf(relativePath: string): string {
    return relativePath.replace(/\\/g, '/').match(/components\/([^/]+)\/README\.md$/)?.[1] ?? '';
}

// 예제의 루트 <template> 안쪽만 꺼낸다.
// 슬롯(<template #prepend>)이 중첩되므로 마지막 닫는 태그를 기준으로 잘라야 한다.
// <script setup>은 버린다. 데모가 쓰는 변수는 demo-scope가 페이지 단위로 공급한다.
function templateBody(source: string): string | undefined {
    const markup = source.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
    const start = markup.indexOf(OPEN_TAG);
    const end = markup.lastIndexOf(CLOSE_TAG);

    if (start === -1 || end <= start) {
        return undefined;
    }

    return markup.slice(start + OPEN_TAG.length, end).trim();
}

export function liveDemo(md: MarkdownRenderer) {
    md.core.ruler.before('normalize', 'vlossom-demo-scope', (state) => {
        state.src = state.src.replace(KO_LINK_LINE, '').replace(SIBLING_README_LINK, '](/components/$1$2)');

        const setup = DEMO_SCOPE[componentOf(state.env?.relativePath ?? '')];
        if (setup) {
            state.src = `<script setup>\n${setup}\n</script>\n\n${state.src}`;
        }
    });

    const renderFence = md.renderer.rules.fence;
    if (!renderFence) {
        throw new Error('markdown-it fence renderer is missing');
    }

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        if (!LIVE_MARKER.test(token.info)) {
            return renderFence(tokens, idx, options, env, self);
        }

        // 마커를 떼고 원래 렌더러에 넘겨야 shiki가 언어를 인식한다.
        token.info = token.info.replace(LIVE_MARKER, '').trim();
        const code = renderFence(tokens, idx, options, env, self);

        const body = templateBody(token.content);
        if (!body) {
            return code;
        }

        return `<ClientOnly><div class="vs-demo">\n${body}\n</div></ClientOnly>\n${code}`;
    };
}
