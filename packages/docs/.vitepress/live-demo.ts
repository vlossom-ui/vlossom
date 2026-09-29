import type { MarkdownRenderer } from 'vitepress';
import { DEMO_SCOPE } from './demo-scope.ts';

// VitePress는 마크다운 페이지를 Vue SFC 템플릿으로 컴파일한다.
// 그래서 코드펜스 안의 <template> 내용을 HTML로 그대로 흘려보내면
// Vue가 알아서 실제 컴포넌트로 컴파일해준다. 가상 모듈도 런타임 SFC 컴파일도 필요 없다.
//
// 마커는 펜스 info string에 `live`를 덧붙이는 방식이다.
// 첫 토큰이 `html` 그대로라 GitHub 렌더는 바뀌지 않고,
// vlossom-mcp는 코드펜스를 읽지 않으므로 영향이 없다.

// README 맨 위의 "다른 언어 문서 보기" 안내. 사이트에는 언어 스위처가 있으므로 뺀다.
const CROSS_DOC_NOTE = /^> (?:한국어 문서는|For English documentation).*$\r?\n?/m;
// README의 상대 링크는 GitHub 기준이라 사이트에서는 깨진다.
// 같은 섹션 안의 형제 문서를 가리키므로 현재 페이지의 라우트 기준으로 고쳐준다.
const SIBLING_README_LINK = /\]\(\.\.\/([a-z0-9-]+)\/README(?:\.ko)?\.md(#[a-z0-9-]+)?\)/g;
// 플러그인 문서가 컴포넌트 문서를 가리키는 식의 섹션 간 링크.
const CROSS_SECTION_README_LINK = /\]\(\.\.\/\.\.\/([a-z0-9-]+)\/([a-z0-9-]+)\/README(?:\.ko)?\.md(#[a-z0-9-]+)?\)/g;
const LIVE_MARKER = /(^|\s)live(?=\s|$)/;
const LIVE_FENCE = /```[a-z]*[^\n]*\blive\b[^\n]*\r?\n([\s\S]*?)```/g;
const SCRIPT_BLOCK = /<script[^>]*>([\s\S]*?)<\/script>/;
const VUE_IMPORT = /^import\s*\{([^}]*)\}\s*from\s*['"]vue['"]/;
const OPEN_TAG = '<template>';
const CLOSE_TAG = '</template>';

// README 예제의 이미지 경로는 실재하지 않는다(`/profile.png`, `example.com`).
// Vite는 `/profile.png`를 에셋 import로 바꾸려다 빌드를 실패시키고,
// 외부 URL은 그냥 깨진 이미지로 보인다. 데모 렌더에서만 플레이스홀더로 바꾼다.
// 코드 블록에는 README 원문이 그대로 보인다.
// `broken.png`는 폴백 동작을 보여주는 예제이므로 일부러 건드리지 않는다.
const PLACEHOLDER_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">' +
    '<rect width="96" height="96" fill="#cbd5e1"/>' +
    '<circle cx="48" cy="38" r="18" fill="#94a3b8"/>' +
    '<path d="M16 96c0-17.7 14.3-32 32-32s32 14.3 32 32z" fill="#94a3b8"/></svg>';
const PLACEHOLDER_IMAGE = `data:image/svg+xml;base64,${Buffer.from(PLACEHOLDER_SVG).toString('base64')}`;
const MISSING_IMAGE = /"(?:\/profile\.png|https:\/\/example\.com\/image\.png)"/g;

// 예제가 보여주는 <slot /> 아웃렛은 "여기에 페이지 내용이 들어간다"는 뜻이다.
// 문서 페이지 템플릿에 그대로 두면 페이지 자신의 슬롯을 렌더하려다 SSR에서 터진다.
const SLOT_OUTLET = /<slot\b[^>]*\/>|<slot\b[^>]*>[\s\S]*?<\/slot>/g;
const SLOT_PLACEHOLDER = '<span class="vs-demo-slot">slot content</span>';

// markdown-it이 받는 env.relativePath는 rewrites가 적용된 뒤의 경로다.
// 즉 `vlossom/src/components/vs-button/README.md`가 아니라 `components/vs-button.md`.
// (env.filePath는 이 시점에 존재하지 않는다.)
function componentOf(relativePath: string): string {
    const normalized = relativePath.replace(/\\/g, '/');

    return (
        normalized.match(/(?:^|\/)components\/(vs-[a-z0-9-]+)\.md$/)?.[1] ??
        normalized.match(/components\/(vs-[a-z0-9-]+)\/README\.md$/)?.[1] ??
        ''
    );
}

// 'ko/components/vs-button.md' -> '/ko/components'
function routeBaseOf(relativePath: string): string {
    const parts = relativePath.replace(/\\/g, '/').split('/');
    parts.pop();

    return `/${parts.join('/')}`;
}

// 예제의 루트 <template> 안쪽만 꺼낸다.
// 슬롯(<template #prepend>)이 중첩되므로 마지막 닫는 태그를 기준으로 잘라야 한다.
function templateBody(source: string): string | undefined {
    const markup = source.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
    const start = markup.indexOf(OPEN_TAG);
    const end = markup.lastIndexOf(CLOSE_TAG);

    if (start === -1 || end <= start) {
        return undefined;
    }

    return markup
        .slice(start + OPEN_TAG.length, end)
        .replace(MISSING_IMAGE, `"${PLACEHOLDER_IMAGE}"`)
        .replace(SLOT_OUTLET, SLOT_PLACEHOLDER)
        .trim();
}

// 문자열·주석을 건너뛰며 괄호 깊이 0에서 문장을 나눈다.
function splitStatements(code: string): string[] {
    const statements: string[] = [];
    let depth = 0;
    let start = 0;

    for (let i = 0; i < code.length; i += 1) {
        const char = code[i];

        if (char === "'" || char === '"' || char === '`') {
            i += 1;
            while (i < code.length && code[i] !== char) {
                i += code[i] === '\\' ? 2 : 1;
            }
            continue;
        }
        if (char === '/' && code[i + 1] === '/') {
            while (i < code.length && code[i] !== '\n') i += 1;
            continue;
        }
        if (char === '/' && code[i + 1] === '*') {
            i = code.indexOf('*/', i + 2) + 1;
            continue;
        }
        if ('([{'.includes(char)) depth += 1;
        else if (')]}'.includes(char)) depth -= 1;
        else if ((char === ';' || char === '\n') && depth === 0) {
            const statement = code.slice(start, i + 1).trim();
            if (statement) statements.push(statement);
            start = i + 1;
        }
    }

    const tail = code.slice(start).trim();
    if (tail) statements.push(tail);

    return statements;
}

function declaredName(statement: string): string | undefined {
    return (
        statement.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)/)?.[1] ??
        statement.match(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/)?.[1]
    );
}

// live 펜스들이 저마다 들고 있는 <script setup>을 페이지 스코프 하나로 합친다.
// README가 예제와 함께 적어둔 데이터(과일 배열, 테이블 컬럼 등)를 그대로 쓸 수 있다.
//
// DEMO_SCOPE를 맨 앞에 두어 같은 이름은 손으로 쓴 쪽이 이긴다.
// README 예제 중에는 정의되지 않은 함수를 호출하는 것들이 있어서 덮어써야 한다.
function buildPageSetup(source: string, component: string): string {
    const scripts = [DEMO_SCOPE[component] ?? ''];
    for (const match of source.matchAll(LIVE_FENCE)) {
        scripts.push(SCRIPT_BLOCK.exec(match[1])?.[1] ?? '');
    }

    const vueImports = new Set<string>();
    const otherImports = new Set<string>();
    const declared = new Set<string>();
    const body: string[] = [];

    for (const script of scripts.filter(Boolean)) {
        for (const statement of splitStatements(script)) {
            const vueNames = VUE_IMPORT.exec(statement)?.[1];
            if (vueNames) {
                for (const name of vueNames.split(',')) {
                    if (name.trim()) vueImports.add(name.trim());
                }
                continue;
            }
            if (statement.startsWith('import ')) {
                // 예제의 상대 경로 import(`./Greeting.vue`)는 문서 사이트 컨텍스트에
                // 존재하지 않는 파일이다. 버리고 DEMO_SCOPE가 대신 공급한다.
                if (!/from\s*['"]\.{1,2}\//.test(statement)) {
                    otherImports.add(statement);
                }
                continue;
            }

            const name = declaredName(statement);
            if (name) {
                if (declared.has(name)) continue;
                declared.add(name);
            }
            body.push(statement);
        }
    }

    if (!body.length) {
        return '';
    }

    return [
        vueImports.size ? `import { ${[...vueImports].join(', ')} } from 'vue';` : '',
        ...otherImports,
        ...body,
    ]
        .filter(Boolean)
        .join('\n');
}

export function liveDemo(md: MarkdownRenderer) {
    md.core.ruler.before('normalize', 'vlossom-demo-scope', (state) => {
        const relativePath = state.env?.relativePath ?? '';
        const routeBase = routeBaseOf(relativePath);
        const localeBase = relativePath.startsWith('ko/') ? '/ko' : '';

        state.src = state.src
            .replace(CROSS_DOC_NOTE, '')
            .replace(CROSS_SECTION_README_LINK, `](${localeBase}/$1/$2$3)`)
            .replace(SIBLING_README_LINK, `](${routeBase}/$1$2)`);

        const setup = buildPageSetup(state.src, componentOf(relativePath));
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
