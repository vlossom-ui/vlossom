import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { createMarkdownRenderer, disposeMdItInstance } from 'vitepress';
import { afterAll, describe, expect, it } from 'vitest';
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc';
import { DEMO_IMAGES, DEMO_SCOPE } from './demo-scope.ts';
import { DemoRegistry, isLiveFence, liveDemos } from './live-demo.ts';
import { listMarkdownFiles, selectReadmePages, type ReadmePage } from './readme-pages.ts';

const PACKAGES_DIR = resolve(import.meta.dirname, '../..');
// $vs는 vlossom 플러그인이 붙이는 전역 속성이다.
const GLOBAL_NAMES = new Set(['$attrs', '$el', '$emit', '$props', '$refs', '$slots', '$vs']);
const COMPONENT_PAGES = selectReadmePages(listMarkdownFiles(PACKAGES_DIR)).filter(
    (page) => page.section === 'components',
);

class LabeledRegistry extends DemoRegistry {
    readonly labels = new Map<string, string>();

    override register(source: string, index: number, code: string): string {
        const id = super.register(source, index, code);
        this.labels.set(id, `${source} #${index + 1}`);
        return id;
    }
}

// createVlossom({ components: VlossomComponents })가 등록하는 이름이다. vlossom을 Node에서 import하면 document를 찾다 실패해서 선언 파일을 읽는다.
function vlossomComponents(): Set<string> {
    const entry = createRequire(import.meta.url).resolve('vlossom');
    const declaration = resolve(dirname(entry), 'components/component-map.d.ts');
    const names = readFileSync(declaration, 'utf8').matchAll(/^ {4}readonly (Vs\w+):/gm);
    return new Set([...names].map(([, name]) => name));
}

function pascalCase(tag: string): string {
    return tag.replace(/(^|-)(\w)/g, (_, __, letter: string) => letter.toUpperCase());
}

function demoProblems(id: string, code: string, components: Set<string>): string[] {
    const { descriptor, errors } = parse(code, { filename: id });
    if (errors.length > 0 || !descriptor.template) {
        return errors.map((error) => error.message);
    }
    const script = descriptor.scriptSetup ? compileScript(descriptor, { id, inlineTemplate: false }) : undefined;
    const template = compileTemplate({
        id,
        filename: id,
        source: descriptor.template.content,
        compilerOptions: { bindingMetadata: script?.bindings, prefixIdentifiers: true },
    });

    const problems = template.errors.map((error) => (typeof error === 'string' ? error : error.message));
    for (const [, name] of template.code.matchAll(/_ctx\.([\w$]+)/g)) {
        if (!GLOBAL_NAMES.has(name)) problems.push(`undeclared name "${name}"`);
    }
    for (const [, tag] of template.code.matchAll(/_resolveComponent\("([^"]+)"/g)) {
        if (!components.has(pascalCase(tag))) problems.push(`unknown component <${tag}>`);
    }
    for (const [, name] of template.code.matchAll(/_resolveDirective\("([^"]+)"/g)) {
        problems.push(`unregistered directive v-${name}`);
    }
    return [...new Set(problems)];
}

function liveMarks(page: ReadmePage): boolean[] {
    const markdown = readFileSync(resolve(PACKAGES_DIR, page.source), 'utf8');
    return [...markdown.matchAll(/^```(html[^\n]*)$/gm)].map(([, info]) => isLiveFence(info));
}

describe('컴포넌트 README 데모', () => {
    afterAll(() => {
        disposeMdItInstance();
    });

    it('영어와 한국어 README는 같은 예제를 live로 표시한다', () => {
        const mismatched = COMPONENT_PAGES.filter((page) => page.locale === 'root').flatMap((page) => {
            const korean = COMPONENT_PAGES.find((item) => item.locale === 'ko' && item.name === page.name);
            return korean && liveMarks(korean).join() === liveMarks(page).join() ? [] : [page.source];
        });

        expect(mismatched).toEqual([]);
    });

    it('선언된 이름과 vlossom이 등록한 컴포넌트만 쓴다', async () => {
        const registry = new LabeledRegistry(resolve(import.meta.dirname, '.demos'));
        const md = await createMarkdownRenderer(PACKAGES_DIR, {
            config: (instance) => {
                instance.use(liveDemos, {
                    srcDir: PACKAGES_DIR,
                    pages: COMPONENT_PAGES,
                    scope: DEMO_SCOPE,
                    images: DEMO_IMAGES,
                    registry,
                    runtime: 'vlossom-runtime',
                });
            },
        });

        for (const page of COMPONENT_PAGES) {
            const realPath = resolve(PACKAGES_DIR, page.source);
            await md.renderAsync(readFileSync(realPath, 'utf8'), {
                path: resolve(PACKAGES_DIR, page.route),
                realPath,
                relativePath: page.route,
                cleanUrls: false,
            });
        }

        const components = vlossomComponents();
        const problems = registry
            .ids()
            .flatMap((id) =>
                demoProblems(id, registry.get(id) ?? '', components).map(
                    (problem) => `${registry.labels.get(id)}: ${problem}`,
                ),
            );

        expect(components.size).toBeGreaterThan(0);
        expect(registry.ids().length).toBeGreaterThan(0);
        expect(problems.join('\n')).toBe('');
    });
});
