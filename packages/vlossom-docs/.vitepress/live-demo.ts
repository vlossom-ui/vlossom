import { createHash } from 'node:crypto';
import { relative, sep } from 'node:path';
import type { MarkdownRenderer, Plugin } from 'vitepress';
import { babelParse, extractIdentifiers } from 'vue/compiler-sfc';
import type { ReadmePage } from './readme-pages.ts';

export interface LiveDemoOptions {
    srcDir: string;
    pages: ReadmePage[];
    scope: Record<string, string>;
    registry: DemoRegistry;
    runtime: string;
}

interface ScopeSources {
    own: string;
    others: string[];
    fallback: string;
}

type ScriptStatement = ReturnType<typeof babelParse>['program']['body'][number];
type ImportStatement = Extract<ScriptStatement, { type: 'ImportDeclaration' }>;
type ImportSpecifierNode = ImportStatement['specifiers'][number];
type Slice = (node: { start?: number | null; end?: number | null }) => string;

interface ScriptItem {
    code: string;
    names: string[];
}

interface ImportBinding extends ScriptItem {
    source: string;
    kind: 'default' | 'namespace' | 'named';
    typeOnly: boolean;
}

interface ParsedScript {
    sideEffects: string[];
    bindings: ImportBinding[];
    items: ScriptItem[];
}

export const DEMO_CLASS = 'vs-demo';
const IMPORT_KINDS = {
    ImportDefaultSpecifier: 'default',
    ImportNamespaceSpecifier: 'namespace',
    ImportSpecifier: 'named',
} as const;
const LIVE_MARKER = 'live';
const SCRIPT_BLOCK = /<script\b[^>]*>([\s\S]*?)<\/script>/;
const SCRIPT_BLOCKS = /<script\b[\s\S]*?<\/script>/g;
const STYLE_BLOCKS = /<style\b[\s\S]*?<\/style>/g;
const OPEN_TEMPLATE = '<template>';
const CLOSE_TEMPLATE = '</template>';

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

function declarationNames(node: ScriptStatement): string[] {
    switch (node.type) {
        case 'VariableDeclaration':
            return node.declarations.flatMap((declarator) =>
                extractIdentifiers(declarator.id).map((identifier) => identifier.name),
            );
        case 'FunctionDeclaration':
        case 'ClassDeclaration':
        case 'TSEnumDeclaration':
        case 'TSTypeAliasDeclaration':
        case 'TSInterfaceDeclaration':
            return node.id ? [node.id.name] : [];
        default:
            return [];
    }
}

function toBinding(node: ImportStatement, specifier: ImportSpecifierNode, slice: Slice): ImportBinding {
    return {
        source: node.source.value,
        kind: IMPORT_KINDS[specifier.type],
        typeOnly: node.importKind === 'type',
        code: slice(specifier),
        names: [specifier.local.name],
    };
}

function toItems(node: ScriptStatement, slice: Slice): ScriptItem[] {
    if (node.type === 'VariableDeclaration' && node.declarations.length > 1) {
        return node.declarations.map((declarator) => ({
            code: `${node.declare ? 'declare ' : ''}${node.kind} ${slice(declarator)};`,
            names: extractIdentifiers(declarator.id).map((identifier) => identifier.name),
        }));
    }
    return [{ code: slice(node), names: declarationNames(node) }];
}

function parseScript(code: string): ParsedScript {
    if (!code.trim()) {
        return { sideEffects: [], bindings: [], items: [] };
    }

    const slice: Slice = (node) => code.slice(node.start ?? 0, node.end ?? 0);
    const body = babelParse(code, { sourceType: 'module', plugins: ['typescript'] }).program.body;
    // README 예제의 상대 경로 import(./Greeting.vue 등)는 실제로 없는 파일이라 뺀다.
    const imports = body.filter(
        (node): node is ImportStatement => node.type === 'ImportDeclaration' && !node.source.value.startsWith('.'),
    );
    return {
        sideEffects: imports.filter((node) => node.specifiers.length === 0).map((node) => node.source.value),
        bindings: imports.flatMap((node) => node.specifiers.map((specifier) => toBinding(node, specifier, slice))),
        items: body.flatMap((node) => (node.type === 'ImportDeclaration' ? [] : toItems(node, slice))),
    };
}

function quote(source: string): string {
    return `'${source.replace(/['\\]/g, '\\$&')}'`;
}

function importLines(sideEffects: string[], bindings: ImportBinding[]): string[] {
    const keyword = (binding: ImportBinding) => (binding.typeOnly ? 'import type' : 'import');
    const groupKey = (binding: ImportBinding) => `${keyword(binding)} ${quote(binding.source)}`;
    const named = bindings.filter((binding) => binding.kind === 'named');

    return [
        ...[...new Set(sideEffects)].map((source) => `import ${quote(source)};`),
        ...bindings
            .filter((binding) => binding.kind !== 'named')
            .map((binding) => `${keyword(binding)} ${binding.code} from ${quote(binding.source)};`),
        ...[...new Set(named.map(groupKey))].map((key) => {
            const group = named.filter((binding) => groupKey(binding) === key);
            const specifiers = group.map((binding) => binding.code).join(', ');
            return `${keyword(group[0])} { ${specifiers} } from ${quote(group[0].source)};`;
        }),
    ];
}

export function buildScope({ own, others, fallback }: ScopeSources): string {
    const ownScript = parseScript(own);
    const otherScripts = others.map(parseScript);
    const fallbackScript = parseScript(fallback);

    const declared = new Set<string>();
    const take = (entry: ScriptItem): boolean => {
        if (entry.names.some((name) => declared.has(name))) {
            return false;
        }
        entry.names.forEach((name) => declared.add(name));
        return true;
    };

    // 이름이 겹치면 먼저 가져간 쪽이 이기므로, 자기 펜스 → 다른 펜스 → 데모 스코프 순서로 가져간다.
    const ownPart = { bindings: ownScript.bindings.filter(take), items: ownScript.items.filter(take) };
    const otherParts = otherScripts.map((script) => ({
        bindings: script.bindings.filter(take),
        items: script.items.filter((item) => item.names.length > 0 && take(item)),
    }));
    const fallbackPart = { bindings: fallbackScript.bindings.filter(take), items: fallbackScript.items.filter(take) };

    return [
        ...importLines(
            [ownScript, ...otherScripts, fallbackScript].flatMap((script) => script.sideEffects),
            [...ownPart.bindings, ...otherParts.flatMap((part) => part.bindings), ...fallbackPart.bindings],
        ),
        ...fallbackPart.items.map((item) => item.code),
        ...ownPart.items.map((item) => item.code),
        ...otherParts.flatMap((part) => part.items.map((item) => item.code)),
    ].join('\n');
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
    const { srcDir, pages, scope, registry, runtime } = options;

    md.core.ruler.push('vlossom_live_demos', (state) => {
        const file: string | undefined = state.env?.realPath ?? state.env?.path;
        const fences = state.tokens.filter((token) => token.type === 'fence' && isLiveFence(token.info));
        if (!file || fences.length === 0) {
            return;
        }

        const source = relative(srcDir, file).split(sep).join('/');
        const label = (index: number) => `${source}: live fence #${index + 1}`;
        const fallback = scope[pages.find((page) => page.source === source)?.name ?? ''] ?? '';
        const scripts = fences.map((token, index) => {
            const script = fenceScript(token.content);
            try {
                parseScript(script);
            } catch (error) {
                throw new Error(`${label(index)} has an invalid <script setup>: ${(error as Error).message}`);
            }
            return script;
        });

        const imports = fences.map((token, index) => {
            token.info = stripLiveMarker(token.info);
            const body = templateBody(token.content);
            if (!body) {
                throw new Error(`${label(index)} needs a root <template>`);
            }
            const others = scripts.filter((_, other) => other !== index);
            const sfc = createDemoSfc(buildScope({ own: scripts[index], others, fallback }), body);
            const id = registry.register(source, index, sfc);
            const name = `VsDemo${index}`;
            token.meta = { ...token.meta, demo: name };
            return `const ${name} = defineAsyncComponent(() => whenVlossomReady().then(() => import(${JSON.stringify(id)})));`;
        });

        const script = new state.Token('html_block', '', 0);
        script.content = [
            '<script setup>',
            "import { defineAsyncComponent } from 'vue';",
            `import { whenVlossomReady } from ${JSON.stringify(runtime)};`,
            ...imports,
            '</script>',
            '',
        ].join('\n');
        state.tokens.unshift(script);
    });

    const renderFence = md.renderer.rules.fence;
    if (!renderFence) {
        throw new Error('markdown-it fence renderer is missing');
    }
    md.renderer.rules.fence = (tokens, idx, renderOptions, env, self) => {
        const code = renderFence(tokens, idx, renderOptions, env, self);
        const demo = tokens[idx].meta?.demo;
        return demo ? `<ClientOnly><div class="${DEMO_CLASS}"><${demo} /></div></ClientOnly>\n${code}` : code;
    };
}
