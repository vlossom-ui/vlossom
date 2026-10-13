import { useVlossom } from 'vlossom';
import { computed, nextTick, ref, type App } from 'vue';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    attachVlossom,
    defaultColorScheme,
    followVlossomTheme,
    setDefaultColorScheme,
    syncVlossomTheme,
    vlossomColors,
    whenVlossomReady,
} from './vlossom.ts';

// vlossom은 import될 때 document를 건드려 node에서 불러올 수 없다. 테마 코드가 쓰는 부분만 흉내 낸다.
// theme은 vlossom처럼 ref를 읽는 getter라서, 값이 바뀌면 감시하는 쪽이 알 수 있다.
vi.mock('vlossom', async () => {
    const { ref } = await import('vue');
    const theme = ref('light');
    const instance = {
        colorScheme: {},
        modal: { clear: () => {} },
        get theme() {
            return theme.value;
        },
        set theme(value) {
            theme.value = value;
        },
    };
    return {
        COLORS: ['red', 'blue'],
        VlossomComponents: {},
        createVlossom: () => ({ install: () => {} }),
        useVlossom: () => instance,
    };
});

const vlossom = useVlossom();

describe('vlossom.ts', () => {
    beforeAll(async () => {
        vi.stubGlobal('document', { documentElement: { classList: { contains: () => false } } });
        attachVlossom({ use: () => {} } as unknown as App);
        await whenVlossomReady();
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    beforeEach(() => {
        vlossom.theme = 'light';
        vlossom.colorScheme = {};
    });

    it('vlossom을 불러오면 색 목록을 채운다', () => {
        expect(vlossomColors.value).toEqual(['red', 'blue']);
    });

    it('고른 색상 스킴을 기본값으로 쓰고, 컴포넌트별 설정은 남긴다', () => {
        vlossom.colorScheme = { VsButton: 'blue' };

        setDefaultColorScheme('red');
        expect(vlossom.colorScheme).toStrictEqual({ VsButton: 'blue', default: 'red' });
        expect(defaultColorScheme.value).toBe('red');

        setDefaultColorScheme(undefined);
        expect(vlossom.colorScheme).toStrictEqual({ VsButton: 'blue' });
        expect(defaultColorScheme.value).toBeUndefined();
    });

    it('데모가 vlossom 테마를 바꾸면 사이트 테마도 바꾼다', async () => {
        const isDark = ref(false);
        const stop = followVlossomTheme(isDark);

        vlossom.theme = 'dark';
        await nextTick();
        expect(isDark.value).toBe(true);

        vlossom.theme = 'light';
        await nextTick();
        expect(isDark.value).toBe(false);
        stop();
    });

    it('사이트 테마가 이미 같은 값이면 다시 쓰지 않는다', async () => {
        const site = ref(false);
        const writes: boolean[] = [];
        const isDark = computed({
            get: () => site.value,
            set: (value) => {
                writes.push(value);
                site.value = value;
            },
        });
        const stop = followVlossomTheme(isDark);

        // VitePress 스위치로 바꾸면 테마 진입점이 vlossom 테마를 맞춘다.
        site.value = true;
        syncVlossomTheme(true);
        await nextTick();

        expect(writes).toEqual([]);
        stop();
    });
});

// 사이트는 테마 진입점에서 감시를 시작하고, 첫 데모가 필요할 때 vlossom을 불러온다. 모듈을 새로 불러와 그 순서를 따른다.
describe('vlossom.ts (불러오기 전에 감시 시작)', () => {
    async function freshModules() {
        vi.resetModules();
        const runtime = await import('./vlossom.ts');
        const instance = (await import('vlossom')).useVlossom();
        return { runtime, instance };
    }

    function countedTheme(initial: boolean) {
        const site = ref(initial);
        const writes: boolean[] = [];
        const isDark = computed({
            get: () => site.value,
            set: (value) => {
                writes.push(value);
                site.value = value;
            },
        });
        return { isDark, writes };
    }

    beforeAll(() => {
        vi.stubGlobal('document', { documentElement: { classList: { contains: () => false } } });
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    it('불러온 뒤 데모가 바꾼 vlossom 테마를 따른다', async () => {
        const { runtime, instance } = await freshModules();
        const { isDark, writes } = countedTheme(false);
        const stop = runtime.followVlossomTheme(isDark);

        runtime.attachVlossom({ use: () => {} } as unknown as App);
        await runtime.whenVlossomReady();
        instance.theme = 'dark';
        await nextTick();

        expect(writes).toEqual([true]);
        stop();
    });

    it('vlossom이 저장된 다크 테마로 시작해도 사이트 테마로 맞추고, 사이트 테마는 바꾸지 않는다', async () => {
        const { runtime, instance } = await freshModules();
        instance.theme = 'dark';
        const { isDark, writes } = countedTheme(false);
        const stop = runtime.followVlossomTheme(isDark);

        runtime.attachVlossom({ use: () => {} } as unknown as App);
        await runtime.whenVlossomReady();
        await nextTick();

        expect(instance.theme).toBe('light');
        expect(writes).toEqual([]);
        stop();
    });
});
