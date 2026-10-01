import { resolve } from 'node:path';
import { createMarkdownRenderer, disposeMdItInstance } from 'vitepress';
import { afterEach, describe, expect, it } from 'vitest';
import {
    buildScope,
    createDemoSfc,
    DemoRegistry,
    fenceScript,
    isLiveFence,
    liveDemos,
    stripLiveMarker,
    templateBody,
} from './live-demo.ts';
import type { ReadmePage } from './readme-pages.ts';

const BUTTON: ReadmePage = {
    source: 'vlossom/src/components/vs-button/README.md',
    route: 'components/vs-button.md',
    section: 'components',
    name: 'vs-button',
    locale: 'root',
};

describe('isLiveFence', () => {
    it.each([
        ['html live', true],
        ['vue live', true],
        ['html live {1,3}', true],
        ['html', false],
        ['html liveness', false],
        ['', false],
    ])('%s → %s', (info, expected) => {
        expect(isLiveFence(info)).toBe(expected);
    });
});

describe('stripLiveMarker', () => {
    it.each([
        ['html live', 'html'],
        ['html live {1,3}', 'html {1,3}'],
        ['html', 'html'],
    ])('%s → %s', (info, expected) => {
        expect(stripLiveMarker(info)).toBe(expected);
    });
});

describe('templateBody', () => {
    it('루트 template 안쪽만 꺼낸다', () => {
        expect(templateBody('<template>\n    <vs-button>A</vs-button>\n</template>\n')).toBe(
            '<vs-button>A</vs-button>',
        );
    });

    it('슬롯용 template이 중첩돼도 루트의 마지막 닫는 태그까지 꺼낸다', () => {
        const source = '<template>\n<vs-input>\n<template #prepend>X</template>\n</vs-input>\n</template>';

        expect(templateBody(source)).toBe('<vs-input>\n<template #prepend>X</template>\n</vs-input>');
    });

    it('script와 style은 template 본문에서 뺀다', () => {
        const source =
            '<template>\n<p>A</p>\n</template>\n\n<script setup>\nconst a = 1;\n</script>\n<style>p { color: red; }</style>';

        expect(templateBody(source)).toBe('<p>A</p>');
    });

    it('template이 없으면 undefined를 돌려준다', () => {
        expect(templateBody('interface A {\n    a: string;\n}')).toBeUndefined();
    });
});

describe('fenceScript', () => {
    it('script 블록의 안쪽을 돌려준다', () => {
        expect(fenceScript('<template>A</template>\n<script setup lang="ts">\nconst a = 1;\n</script>')).toBe(
            'const a = 1;',
        );
    });

    it('script가 없으면 빈 문자열을 돌려준다', () => {
        expect(fenceScript('<template>A</template>')).toBe('');
    });
});

describe('buildScope', () => {
    it('README 선언을 먼저 쓰고, 데모 스코프는 선언되지 않은 이름만 채운다', () => {
        const own =
            "import { ref } from 'vue';\nconst isLoading = ref(false);\nasync function submit() {\n    await doSomething();\n}";
        const fallback =
            "import { ref } from 'vue';\nconst isLoading = ref(true);\nfunction doSomething() {\n    return Promise.resolve();\n}";

        expect(buildScope({ own, others: [], fallback })).toBe(
            [
                "import { ref } from 'vue';",
                'function doSomething() {\n    return Promise.resolve();\n}',
                'const isLoading = ref(false);',
                'async function submit() {\n    await doSomething();\n}',
            ].join('\n'),
        );
    });

    it('다른 펜스의 선언을 물려받되 자기 펜스 선언이 이긴다', () => {
        const own = "import { ref } from 'vue';\nconst value = ref('own');";
        const others = ["import { ref, computed } from 'vue';\nconst value = ref('other');\nconst text = ref('');"];

        expect(buildScope({ own, others, fallback: '' })).toBe(
            ["import { ref, computed } from 'vue';", "const value = ref('own');", "const text = ref('');"].join('\n'),
        );
    });

    it('vue가 아닌 import는 한 번만 남기고 상대 경로 import는 뺀다', () => {
        const own =
            "import { useVlossom } from 'vlossom';\nimport Greeting from './Greeting.vue';\nconst $vs = useVlossom();";
        const others = ["import { useVlossom } from 'vlossom';"];

        expect(buildScope({ own, others, fallback: '' })).toBe(
            ["import { useVlossom } from 'vlossom';", 'const $vs = useVlossom();'].join('\n'),
        );
    });
});

describe('createDemoSfc', () => {
    it('스코프가 있으면 script setup과 template으로 SFC를 만든다', () => {
        expect(createDemoSfc('const a = 1;', '<p>{{ a }}</p>')).toBe(
            '<script setup lang="ts">\nconst a = 1;\n</script>\n\n<template>\n<p>{{ a }}</p>\n</template>\n',
        );
    });

    it('스코프가 없으면 template만 만든다', () => {
        expect(createDemoSfc('', '<p>A</p>')).toBe('<template>\n<p>A</p>\n</template>\n');
    });
});

describe('liveDemos', () => {
    // createMarkdownRenderer는 렌더러를 모듈 단위로 캐시하므로, 테스트마다 비워야 플러그인 옵션이 반영된다.
    afterEach(() => {
        disposeMdItInstance();
    });

    it('live 펜스를 데모 컴포넌트와 코드 블록으로 렌더하고 페이지 script에 데모를 등록한다', async () => {
        const srcDir = resolve('/repo/packages');
        const registry = new DemoRegistry(resolve('/repo/packages/vlossom-docs/.vitepress/.demos'));
        const md = await createMarkdownRenderer(srcDir, {
            config: (instance) => {
                instance.use(liveDemos, {
                    srcDir,
                    pages: [BUTTON],
                    scope: { 'vs-button': 'function handleClick() {}' },
                    registry,
                });
            },
        });
        const env: Record<string, any> = {
            path: resolve(srcDir, BUTTON.route),
            realPath: resolve(srcDir, BUTTON.source),
            relativePath: BUTTON.route,
            cleanUrls: false,
        };
        const markdown = [
            '```html live',
            '<template>',
            '    <vs-button @click="handleClick">Click</vs-button>',
            '</template>',
            '```',
            '',
            '```html',
            '<template><p>static</p></template>',
            '```',
        ].join('\n');

        const html = await md.renderAsync(markdown, env);
        const [id] = registry.ids();

        expect(html.match(/<ClientOnly><div class="vs-demo"><VsDemo0 \/><\/div><\/ClientOnly>/g)).toHaveLength(1);
        expect(html.match(/class="language-html/g)).toHaveLength(2);
        expect(registry.get(id)).toBe(
            '<script setup lang="ts">\nfunction handleClick() {}\n</script>\n\n<template>\n<vs-button @click="handleClick">Click</vs-button>\n</template>\n',
        );
        expect(env.sfcBlocks.scriptSetup.content).toContain(
            `const VsDemo0 = defineAsyncComponent(() => import('${id}'));`,
        );
    });
});
