import { ref, type Ref } from 'vue';
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import * as stores from '@/stores';
import { VsComponent, type ColorScheme } from '@/declaration';
import { OptionsStore } from '@/stores';
import { useColorScheme } from './../color-scheme-composable';

describe('useColorScheme', () => {
    let optionsStore: OptionsStore;

    beforeEach(() => {
        optionsStore = new OptionsStore();
        vi.spyOn(stores, 'useOptionsStore').mockReturnValue(optionsStore);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('computedColorScheme', () => {
        it('colorScheme.value가 있을 때 우선적으로 사용해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme> = ref('red');
            const component = VsComponent.VsButton;
            optionsStore.setColorScheme({
                [component]: 'blue',
            });

            // when
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe('red');
        });

        it('colorScheme.value가 없을 때 옵션 스토어의 컴포넌트별 값을 사용해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme | undefined> = ref(undefined);
            const component = VsComponent.VsButton;
            optionsStore.setColorScheme({
                [component]: 'blue',
            });

            // when
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe('blue');
        });

        it('문자열 컴포넌트 이름으로도 동작해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme | undefined> = ref(undefined);
            const component = 'CustomComponent';
            optionsStore.setColorScheme({
                [component]: 'green',
            });

            // when
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe('green');
        });

        it('colorScheme.value가 none일 때 undefined를 반환해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme> = ref('none');
            const component = VsComponent.VsButton;

            // when
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe(undefined);
        });

        it('colorScheme.value가 none일 때 옵션 스토어 값이 있어도 undefined를 반환해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme> = ref('none');
            const component = VsComponent.VsButton;
            optionsStore.setColorScheme({
                [component]: 'blue',
                default: 'red',
            });

            // when
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe(undefined);
        });

        it('colorScheme.value와 옵션 스토어 값이 모두 없을 때 undefined를 반환해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme | undefined> = ref(undefined);
            const component = VsComponent.VsButton;

            // when
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe(undefined);
        });

        it('colorScheme.value가 none으로 변경될 때 반응적으로 undefined를 반환해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme | undefined> = ref('red');
            const component = VsComponent.VsButton;
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe('red');

            // when
            colorScheme.value = 'none';
            // then
            expect(computedColorScheme.value).toBe(undefined);

            // when
            colorScheme.value = 'blue';
            // then
            expect(computedColorScheme.value).toBe('blue');
        });

        it('colorScheme.value 변경 시 반응적으로 업데이트되어야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme | undefined> = ref(undefined);
            const component = VsComponent.VsButton;
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe(undefined);

            // when
            colorScheme.value = 'purple';
            // then
            expect(computedColorScheme.value).toBe('purple');

            // when
            colorScheme.value = undefined;
            // then
            expect(computedColorScheme.value).toBe(undefined);
        });

        it('옵션 스토어 값 변경 시 반응적으로 업데이트되어야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme | undefined> = ref(undefined);
            const component = VsComponent.VsBlock;
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe(undefined);

            // when
            optionsStore.setColorScheme({
                [component]: 'cyan',
            });
            // then
            expect(computedColorScheme.value).toBe('cyan');

            // when
            optionsStore.setColorScheme({});
            // then
            expect(computedColorScheme.value).toBe(undefined);
        });
    });

    describe('colorSchemeClass', () => {
        it('colorScheme 값이 있을 때 올바른 CSS 클래스를 생성해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme> = ref('red');
            const component = VsComponent.VsButton;

            // when
            const { colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(colorSchemeClass.value).toBe('vs-cs-red');
        });

        it('colorScheme 값이 없을 때 vs-cs-default 클래스를 생성해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme | undefined> = ref(undefined);
            const component = VsComponent.VsButton;

            // when
            const { colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(colorSchemeClass.value).toBe('vs-cs-default');
        });

        it('colorScheme 값이 none일 때 vs-cs-default 클래스를 생성해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme> = ref('none');
            const component = VsComponent.VsButton;
            optionsStore.setColorScheme({
                [component]: 'blue',
            });

            // when
            const { colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(colorSchemeClass.value).toBe('vs-cs-default');
        });

        it('옵션 스토어의 값으로 CSS 클래스를 생성해야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme | undefined> = ref(undefined);
            const component = VsComponent.VsBlock;
            optionsStore.setColorScheme({
                [component]: 'emerald',
            });

            // when
            const { colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(colorSchemeClass.value).toBe('vs-cs-emerald');
        });

        it('colorScheme 값 변경 시 CSS 클래스가 반응적으로 업데이트되어야 함', () => {
            // given
            const colorScheme: Ref<ColorScheme | undefined> = ref(undefined);
            const component = VsComponent.VsButton;
            const { colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(colorSchemeClass.value).toBe('vs-cs-default');

            // when
            colorScheme.value = 'violet';
            // then
            expect(colorSchemeClass.value).toBe('vs-cs-violet');

            // when
            colorScheme.value = 'amber';
            // then
            expect(colorSchemeClass.value).toBe('vs-cs-amber');

            // when
            colorScheme.value = undefined;
            // then
            expect(colorSchemeClass.value).toBe('vs-cs-default');
        });
    });

    describe('통합 테스트', () => {
        it('우선순위가 올바르게 적용되어야 함 (colorScheme.value > 옵션 스토어)', () => {
            // given
            const colorScheme: Ref<ColorScheme | undefined> = ref(undefined);
            const component = VsComponent.VsButton;
            optionsStore.setColorScheme({
                [component]: 'blue',
            });

            // when
            const { computedColorScheme, colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe('blue');
            expect(colorSchemeClass.value).toBe('vs-cs-blue');

            // when
            colorScheme.value = 'red';
            // then
            expect(computedColorScheme.value).toBe('red');
            expect(colorSchemeClass.value).toBe('vs-cs-red');

            // when
            colorScheme.value = undefined;
            // then
            expect(computedColorScheme.value).toBe('blue');
            expect(colorSchemeClass.value).toBe('vs-cs-blue');
        });
    });
});
