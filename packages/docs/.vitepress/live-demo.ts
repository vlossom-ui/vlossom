import { resolve } from 'node:path';
import type { MarkdownRenderer } from 'vitepress';
import { DEMO_SCOPE } from './demo-scope.ts';

// README 코드펜스의 info string에 `live`가 붙은 예제를 실제 동작하는 데모로 만든다.
// 첫 토큰이 `html` 그대로라 GitHub 렌더는 바뀌지 않고,
// vlossom-mcp는 코드펜스를 읽지 않으므로 영향이 없다.
//
// 데모마다 **자기 컴포넌트**로 컴파일한다. 한 페이지에 스코프 하나를 공유하면
// 같은 이름을 쓰는 예제끼리 상태가 붙어버린다(VsInput의 `value`가 그랬다).
// 펜스별로 가상 .vue 모듈을 만들어 등록하고, 페이지에서 import해 쓴다.

// 가상 모듈이지만 **실재하는 디렉터리 아래** 경로를 써야 한다.
// `/@vs-demo/...` 같은 가상 경로를 쓰면 그 안의 `import { ref } from 'vue'`를
// 해석할 기준 디렉터리가 없어서 번들러가 실패한다.
const DEMO_DIR = resolve(import.meta.dirname, '.demos').replace(/\\/g, '/');
const demoModules = new Map<string, string>();

// README 맨 위의 "다른 언어 문서 보기" 안내. 사이트에는 언어 스위처가 있으므로 뺀다.
const CROSS_DOC_NOTE = /^> (?:한국어 문서는|For English documentation).*$\r?\n?/m;
// README의 상대 링크는 GitHub 기준이라 사이트에서는 깨진다.
const SIBLING_README_LINK = /\]\(\.\.\/([a-z0-9-]+)\/README(?:\.ko)?\.md(#[a-z0-9-]+)?\)/g;
// 플러그인 문서가 컴포넌트 문서를 가리키는 식의 섹션 간 링크.
const CROSS_SECTION_README_LINK = /\]\(\.\.\/\.\.\/([a-z0-9-]+)\/([a-z0-9-]+)\/README(?:\.ko)?\.md(#[a-z0-9-]+)?\)/g;

const LIVE_MARKER = /(^|\s)live(?=\s|$)/;
const LIVE_FENCE = /```[a-z]*[^\n]*\blive\b[^\n]*\r?\n([\s\S]*?)```/g;
const SCRIPT_BLOCK = /<script[^>]*>([\s\S]*?)<\/script>/;
const VUE_IMPORT = /^import\s*\{([^}]*)\}\s*from\s*['"]vue['"]/;
const RELATIVE_IMPORT = /from\s*['"]\.{1,2}\//;
const OPEN_TAG = '<template>';
const CLOSE_TAG = '</template>';

// README 예제의 이미지 경로는 실재하지 않는다(`/profile.png`, `example.com`).
// Vite는 `/profile.png`를 에셋 import로 바꾸려다 빌드를 실패시키고,
// 외부 URL은 그냥 깨진 이미지로 보인다. 데모 렌더에서만 플레이스홀더로 바꾼다.
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

function slugOf(relativePath: string): string {
    return relativePath.replace(/\\/g, '/').replace(/\.md$/, '').replace(/[^a-zA-Z0-9]+/g, '_');
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

// 데모 하나가 쓸 <script setup>을 조립한다. 앞에 오는 쪽이 이긴다.
//
// 1. DEMO_SCOPE  — README가 선언하지 않거나, 선언했지만 실행 불가능한 것을 덮어쓴다
// 2. 자기 펜스의 스크립트 — 그 예제가 직접 정의한 데이터
// 3. 문서 안의 다른 펜스들 — 앞선 예제가 만든 데이터를 물려받는 예제들을 위해
function buildScope(component: string, ownScript: string, allScripts: string[]): string {
    const sources = [DEMO_SCOPE[component] ?? '', ownScript, ...allScripts].filter(Boolean);

    const vueImports = new Set<string>();
    const otherImports = new Set<string>();
    const declared = new Set<string>();
    const body: string[] = [];

    for (const source of sources) {
        for (const statement of splitStatements(source)) {
            const vueNames = VUE_IMPORT.exec(statement)?.[1];
            if (vueNames) {
                for (const name of vueNames.split(',')) {
                    if (name.trim()) vueImports.add(name.trim());
                }
                continue;
            }
            if (statement.startsWith('import ')) {
                // 예제의 상대 경로 import(`./Greeting.vue`)는 존재하지 않는 파일이다.
                if (!RELATIVE_IMPORT.test(statement)) otherImports.add(statement);
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

    return [
        vueImports.size ? `import { ${[...vueImports].join(', ')} } from 'vue';` : '',
        ...otherImports,
        ...body,
    ]
        .filter(Boolean)
        .join('\n');
}

// 가상 .vue 모듈을 Vite에 넘겨준다. 확장자가 .vue라 plugin-vue가 그대로 컴파일한다.
// vite는 docs의 직접 의존이 아니라서(vitepress가 물고 온다) 타입을 여기서 최소한으로 둔다.
export function vlossomDemoPlugin() {
    return {
        name: 'vlossom-demo-modules',
        enforce: 'pre' as const,
        resolveId(id: string) {
            return demoModules.has(id) ? id : undefined;
        },
        load(id: string) {
            return demoModules.get(id);
        },
    };
}

export function liveDemo(md: MarkdownRenderer) {
    md.core.ruler.before('normalize', 'vlossom-live-demo', (state) => {
        const relativePath = state.env?.relativePath ?? '';
        const routeBase = routeBaseOf(relativePath);
        const localeBase = relativePath.startsWith('ko/') ? '/ko' : '';

        state.src = state.src
            .replace(CROSS_DOC_NOTE, '')
            .replace(CROSS_SECTION_README_LINK, `](${localeBase}/$1/$2$3)`)
            .replace(SIBLING_README_LINK, `](${routeBase}/$1$2)`);

        const fences = [...state.src.matchAll(LIVE_FENCE)].map((match) => match[1]);
        const allScripts = fences.map((fence) => SCRIPT_BLOCK.exec(fence)?.[1] ?? '').filter(Boolean);

        const component = componentOf(relativePath);
        const slug = slugOf(relativePath);
        const imports: string[] = [];

        fences.forEach((fence, index) => {
            const body = templateBody(fence);
            if (!body) {
                return;
            }

            const scope = buildScope(component, SCRIPT_BLOCK.exec(fence)?.[1] ?? '', allScripts);
            const id = `${DEMO_DIR}/${slug}-${index}.vue`;

            demoModules.set(
                id,
                `${scope ? `<script setup>\n${scope}\n</script>\n\n` : ''}<template>\n${body}\n</template>\n`,
            );
            imports.push(`import VsDemo${index} from '${id}';`);
        });

        // env에 담아 fence 렌더러가 몇 번 데모인지 알 수 있게 한다.
        state.env.vlossomDemoIndex = 0;

        if (imports.length) {
            state.src = `<script setup>\n${imports.join('\n')}\n</script>\n\n${state.src}`;
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

        const index = env.vlossomDemoIndex ?? 0;
        env.vlossomDemoIndex = index + 1;

        // 마커를 떼고 원래 렌더러에 넘겨야 shiki가 언어를 인식한다.
        token.info = token.info.replace(LIVE_MARKER, '').trim();
        const code = renderFence(tokens, idx, options, env, self);

        if (!templateBody(token.content)) {
            return code;
        }

        return `<ClientOnly><div class="vs-demo"><VsDemo${index} /></div></ClientOnly>\n${code}`;
    };
}
