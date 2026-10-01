import { createHash } from 'node:crypto';
import { relative, sep } from 'node:path';
import type { MarkdownRenderer, Plugin } from 'vitepress';
import type { ReadmePage } from './readme-pages.ts';

export interface LiveDemoOptions {
    srcDir: string;
    pages: ReadmePage[];
    scope: Record<string, string>;
    registry: DemoRegistry;
}

interface ScopeSources {
    own: string;
    others: string[];
    fallback: string;
}

const LIVE_MARKER = 'live';
const SCRIPT_BLOCK = /<script\b[^>]*>([\s\S]*?)<\/script>/;
const SCRIPT_BLOCKS = /<script\b[\s\S]*?<\/script>/g;
const STYLE_BLOCKS = /<style\b[\s\S]*?<\/style>/g;
const OPEN_TEMPLATE = '<template>';
const CLOSE_TEMPLATE = '</template>';
const VUE_IMPORT = /^import\s*\{([^}]*)\}\s*from\s*['"]vue['"]/;
const RELATIVE_IMPORT = /from\s*['"]\.{1,2}\//;

function infoParts(info: string): string[] {
    return info.trim().split(/\s+/).filter(Boolean);
}

export function isLiveFence(info: string): boolean {
    return infoParts(info).includes(LIVE_MARKER);
}

export function stripLiveMarker(info: string): string {
    return infoParts(info)
        .filter((part) => part !== LIVE_MARKER)
        .join(' ');
}

export function templateBody(source: string): string | undefined {
    const markup = source.replace(SCRIPT_BLOCKS, '').replace(STYLE_BLOCKS, '');
    const start = markup.indexOf(OPEN_TEMPLATE);
    // 슬롯용 <template #name>이 안에 중첩되므로 루트는 마지막 닫는 태그에서 끝난다.
    const end = markup.lastIndexOf(CLOSE_TEMPLATE);
    if (start === -1 || end <= start) {
        return undefined;
    }
    return markup.slice(start + OPEN_TEMPLATE.length, end).trim();
}

export function fenceScript(source: string): string {
    return SCRIPT_BLOCK.exec(source)?.[1].trim() ?? '';
}

function splitStatements(code: string): string[] {
    const statements: string[] = [];
    let depth = 0;
    let start = 0;

    for (let index = 0; index < code.length; index += 1) {
        const char = code[index];
        if (char === "'" || char === '"' || char === '`') {
            index += 1;
            while (index < code.length && code[index] !== char) {
                index += code[index] === '\\' ? 2 : 1;
            }
            continue;
        }
        if (char === '/' && code[index + 1] === '/') {
            while (index < code.length && code[index] !== '\n') {
                index += 1;
            }
            continue;
        }
        if (char === '/' && code[index + 1] === '*') {
            index = code.indexOf('*/', index + 2) + 1;
            continue;
        }
        if ('([{'.includes(char)) {
            depth += 1;
        } else if (')]}'.includes(char)) {
            depth -= 1;
        } else if ((char === ';' || char === '\n') && depth === 0) {
            statements.push(code.slice(start, index + 1).trim());
            start = index + 1;
        }
    }
    statements.push(code.slice(start).trim());

    return statements.filter(Boolean);
}

function declaredName(statement: string): string | undefined {
    return (
        statement.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)/)?.[1] ??
        statement.match(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/)?.[1]
    );
}

export function buildScope({ own, others, fallback }: ScopeSources): string {
    const vueImports = new Set<string>();
    const otherImports = new Set<string>();
    const declared = new Set<string>();

    const collect = (source: string): string[] =>
        splitStatements(source).filter((statement) => {
            const vueNames = VUE_IMPORT.exec(statement)?.[1];
            if (vueNames) {
                vueNames
                    .split(',')
                    .map((name) => name.trim())
                    .filter(Boolean)
                    .forEach((name) => vueImports.add(name));
                return false;
            }
            if (statement.startsWith('import ')) {
                // README 예제의 상대 경로 import(./Greeting.vue 등)는 실제로 없는 파일이다.
                if (!RELATIVE_IMPORT.test(statement)) {
                    otherImports.add(statement);
                }
                return false;
            }
            const name = declaredName(statement);
            if (!name) {
                return true;
            }
            if (declared.has(name)) {
                return false;
            }
            declared.add(name);
            return true;
        });

    const readmeBody = [own, ...others].flatMap(collect);
    const fallbackBody = collect(fallback);

    return [
        vueImports.size ? `import { ${[...vueImports].join(', ')} } from 'vue';` : '',
        ...otherImports,
        ...fallbackBody,
        ...readmeBody,
    ]
        .filter(Boolean)
        .join('\n');
}

export function createDemoSfc(scope: string, body: string): string {
    const template = `<template>\n${body}\n</template>\n`;
    return scope ? `<script setup lang="ts">\n${scope}\n</script>\n\n${template}` : template;
}

export class DemoRegistry {
    private readonly modules = new Map<string, string>();
    private readonly dir: string;

    constructor(dir: string) {
        this.dir = dir.split(sep).join('/');
    }

    register(source: string, index: number, code: string): string {
        const slug = source.replace(/\.md$/, '').replace(/[^a-zA-Z0-9]+/g, '_');
        // 내용이 바뀌면 id도 바뀌어서, dev 서버가 이전 데모를 캐시에서 다시 쓰지 않는다.
        const hash = createHash('sha256').update(code).digest('hex').slice(0, 8);
        const id = `${this.dir}/${slug}-${index}-${hash}.vue`;
        this.modules.set(id, code);
        return id;
    }

    ids(): string[] {
        return [...this.modules.keys()];
    }

    get(id: string): string | undefined {
        return this.modules.get(id);
    }

    vitePlugin(): Plugin {
        return {
            name: 'vlossom-live-demos',
            enforce: 'pre',
            resolveId: (id) => (this.modules.has(id) ? id : undefined),
            load: (id) => this.modules.get(id),
        };
    }
}

export function liveDemos(md: MarkdownRenderer, options: LiveDemoOptions): void {
    const { srcDir, pages, scope, registry } = options;

    md.core.ruler.push('vlossom_live_demos', (state) => {
        const file: string | undefined = state.env?.realPath ?? state.env?.path;
        const fences = state.tokens.filter((token) => token.type === 'fence' && isLiveFence(token.info));
        if (!file || fences.length === 0) {
            return;
        }

        const source = relative(srcDir, file).split(sep).join('/');
        const fallback = scope[pages.find((page) => page.source === source)?.name ?? ''] ?? '';
        const scripts = fences.map((token) => fenceScript(token.content));
        const imports: string[] = [];

        fences.forEach((token, index) => {
            token.info = stripLiveMarker(token.info);
            const body = templateBody(token.content);
            if (!body) {
                return;
            }
            const others = scripts.filter((_, other) => other !== index);
            const id = registry.register(
                source,
                index,
                createDemoSfc(buildScope({ own: scripts[index], others, fallback }), body),
            );
            const name = `VsDemo${index}`;
            token.meta = { ...token.meta, demo: name };
            imports.push(`const ${name} = defineAsyncComponent(() => import('${id}'));`);
        });

        if (imports.length === 0) {
            return;
        }
        // vlossom은 SSR에서 불러올 수 없으므로 데모는 ClientOnly 안에서 비동기로만 불러온다.
        const script = new state.Token('html_block', '', 0);
        script.content = `<script setup>\nimport { defineAsyncComponent } from 'vue';\n${imports.join('\n')}\n</script>\n`;
        state.tokens.unshift(script);
    });

    const renderFence = md.renderer.rules.fence;
    if (!renderFence) {
        throw new Error('markdown-it fence renderer is missing');
    }
    md.renderer.rules.fence = (tokens, idx, renderOptions, env, self) => {
        const code = renderFence(tokens, idx, renderOptions, env, self);
        const demo = tokens[idx].meta?.demo;
        return demo ? `<ClientOnly><div class="vs-demo"><${demo} /></div></ClientOnly>\n${code}` : code;
    };
}
