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

    it('vue import의 별칭을 그대로 둔다', () => {
        expect(buildScope({ own: "import { ref as r } from 'vue';\nconst a = r(1);", others: [], fallback: '' })).toBe(
            ["import { ref as r } from 'vue';", 'const a = r(1);'].join('\n'),
        );
    });

    it('vue가 아닌 모듈의 import도 지역 이름으로 합친다', () => {
        const own = "import { useVlossom } from 'vlossom';\nconst $vs = useVlossom();";
        const others = ['import { useVlossom, type StyleSet } from "vlossom"\nconst style: StyleSet = {};'];

        expect(buildScope({ own, others, fallback: '' })).toBe(
            [
                "import { useVlossom, type StyleSet } from 'vlossom';",
                'const $vs = useVlossom();',
                'const style: StyleSet = {};',
            ].join('\n'),
        );
    });

    it('default와 namespace import는 지역 이름마다 한 번만 넣는다', () => {
        const own = "import Draggable from 'vuedraggable';";
        const others = ['import Draggable from "vuedraggable"\nimport * as icons from \'@vicons/ionicons5\';'];

        expect(buildScope({ own, others, fallback: '' })).toBe(
            ["import Draggable from 'vuedraggable';", "import * as icons from '@vicons/ionicons5';"].join('\n'),
        );
    });

    it('부수 효과 import는 한 번만 넣는다', () => {
        const own = "import 'some-lib/style.css';";
        const others = ['import "some-lib/style.css"'];

        expect(buildScope({ own, others, fallback: '' })).toBe("import 'some-lib/style.css';");
    });

    it('다른 펜스의 선언문 하나에 여러 변수가 있으면 겹치지 않는 변수는 남긴다', () => {
        expect(buildScope({ own: 'const a = 1;', others: ['const a = 2, b = 3;'], fallback: '' })).toBe(
            ['const a = 1;', 'const b = 3;'].join('\n'),
        );
    });

    it('주석이 앞에 붙은 선언도 같은 이름이면 한 번만 남긴다', () => {
        const own = '// 카운터\nconst count = ref(0);';
        const fallback = "import { ref } from 'vue';\n/* 기본값 */\nconst count = ref(5);";

        expect(buildScope({ own, others: [], fallback })).toBe(
            ["import { ref } from 'vue';", 'const count = ref(0);'].join('\n'),
        );
    });

    it('구조 분해와 타입 선언도 이름으로 중복을 막는다', () => {
        const own = 'const { a, b } = useThing();\ntype Item = { id: number };';
        const others = ['const a = 1;\ninterface Item {\n    id: number;\n}\nconst c = 2;'];

        expect(buildScope({ own, others, fallback: '' })).toBe(
            ['const { a, b } = useThing();', 'type Item = { id: number };', 'const c = 2;'].join('\n'),
        );
    });

    it('여러 줄에 걸친 문장을 나누지 않는다', () => {
        const own = 'const items = list\n    .map((item) => item * 2)\n    .filter(Boolean);';

        expect(buildScope({ own, others: [], fallback: '' })).toBe(own);
    });

    it('다른 펜스에서는 선언만 물려받고 실행 문장은 물려받지 않는다', () => {
        const own = 'onMounted(() => start());';
        const others = ["const text = ref('');\nonMounted(() => other());"];

        expect(buildScope({ own, others, fallback: '' })).toBe(
            ['onMounted(() => start());', "const text = ref('');"].join('\n'),
        );
    });

    it('문법 오류가 있으면 멈추지 않고 오류를 던진다', () => {
        expect(() => buildScope({ own: 'const a = /* unclosed', others: [], fallback: '' })).toThrow(
            /Unterminated comment/,
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

describe('DemoRegistry', () => {
    it('vite 플러그인은 등록한 모듈만 찾아 내용을 돌려준다', () => {
        const registry = new DemoRegistry('C:/repo/.demos');
        const id = registry.register('vlossom/src/components/vs-button/README.md', 0, '<template>A</template>');
        const plugin = registry.vitePlugin();
        const resolveId = plugin.resolveId as (id: string) => string | undefined;
        const load = plugin.load as (id: string) => string | undefined;

        expect(resolveId(id)).toBe(id);
        expect(load(id)).toBe('<template>A</template>');
        expect(resolveId('C:/repo/.demos/unknown.vue')).toBeUndefined();
    });
});

describe('liveDemos', () => {
    const srcDir = resolve('/repo/packages');
    const runtime = "C:/repo/O'Brien/theme/vlossom.ts";
    const env = (): Record<string, any> => ({
        path: resolve(srcDir, BUTTON.route),
        realPath: resolve(srcDir, BUTTON.source),
        relativePath: BUTTON.route,
        cleanUrls: false,
    });
    const createRenderer = (registry: DemoRegistry) =>
        createMarkdownRenderer(srcDir, {
            config: (instance) => {
                instance.use(liveDemos, {
                    srcDir,
                    pages: [BUTTON],
                    scope: { 'vs-button': 'function handleClick() {}' },
                    registry,
                    runtime,
                });
            },
        });

    // createMarkdownRenderer는 렌더러를 모듈 단위로 캐시하므로, 테스트마다 비워야 플러그인 옵션이 반영된다.
    afterEach(() => {
        disposeMdItInstance();
    });

    it('live 펜스를 데모 컴포넌트와 코드 블록으로 렌더하고, 데모는 vlossom 준비 뒤에 불러온다', async () => {
        const registry = new DemoRegistry(resolve('/repo/packages/vlossom-docs/.vitepress/.demos'));
        const md = await createRenderer(registry);
        const pageEnv = env();
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

        const html = await md.renderAsync(markdown, pageEnv);
        const [id] = registry.ids();
        const script = pageEnv.sfcBlocks.scriptSetup.content;

        expect(html.match(/<ClientOnly><div class="vs-demo"><VsDemo0 \/><\/div><\/ClientOnly>/g)).toHaveLength(1);
        expect(html.match(/class="language-html/g)).toHaveLength(2);
        expect(registry.get(id)).toBe(
            '<script setup lang="ts">\nfunction handleClick() {}\n</script>\n\n<template>\n<vs-button @click="handleClick">Click</vs-button>\n</template>\n',
        );
        expect(script).toContain('import { whenVlossomReady } from "C:/repo/O\'Brien/theme/vlossom.ts";');
        expect(script).toContain(
            `const VsDemo0 = defineAsyncComponent(() => whenVlossomReady().then(() => import("${id}")));`,
        );
    });

    it('루트 template이 없는 live 펜스는 파일과 펜스 번호를 밝혀 실패한다', async () => {
        const md = await createRenderer(new DemoRegistry('C:/repo/.demos'));

        await expect(md.renderAsync('```html live\n<p>no template</p>\n```', env())).rejects.toThrow(
            'vlossom/src/components/vs-button/README.md: live fence #1 needs a root <template>',
        );
    });

    it('데모 스크립트에 문법 오류가 있으면 파일과 펜스 번호를 밝혀 실패한다', async () => {
        const md = await createRenderer(new DemoRegistry('C:/repo/.demos'));
        const markdown =
            '```html live\n<template><p>A</p></template>\n<script setup>\nconst a = /* unclosed\n</script>\n```';

        await expect(md.renderAsync(markdown, env())).rejects.toThrow(
            'vlossom/src/components/vs-button/README.md: live fence #1 has an invalid <script setup>',
        );
    });
});
