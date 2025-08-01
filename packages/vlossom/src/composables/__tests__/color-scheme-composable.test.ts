import { ref } from 'vue';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useColorScheme } from '../color-scheme-composable';
import { VsComponent } from '@/declaration';
import type { ColorScheme } from '@/declaration';

const mockOptionsStore = {
    colorScheme: ref({}),
};

vi.mock('@/stores', () => ({
    useOptionsStore: () => mockOptionsStore,
}));

describe('useColorScheme', () => {
    beforeEach(() => {
        mockOptionsStore.colorScheme.value = {};
    });

    describe('computedColorScheme', () => {
        it('colorScheme.value가 있을 때 우선적으로 사용해야 함', () => {
            // given
            const colorScheme = ref<ColorScheme>('red');
            const component = VsComponent.VsButton;
            mockOptionsStore.colorScheme.value = {
                [component]: 'blue',
            };

            // when
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe('red');
        });

        it('colorScheme.value가 없을 때 옵션 스토어의 컴포넌트별 값을 사용해야 함', () => {
            // given
            const colorScheme = ref<ColorScheme | undefined>(undefined);
            const component = VsComponent.VsButton;
            mockOptionsStore.colorScheme.value = {
                [component]: 'blue',
            };

            // when
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe('blue');
        });

        it('문자열 컴포넌트 이름으로도 동작해야 함', () => {
            // given
            const colorScheme = ref<ColorScheme | undefined>(undefined);
            const component = 'CustomComponent';
            mockOptionsStore.colorScheme.value = {
                [component]: 'green',
            };

            // when
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe('green');
        });

        it('colorScheme.value와 옵션 스토어 값이 모두 없을 때 undefined를 반환해야 함', () => {
            // given
            const colorScheme = ref<ColorScheme | undefined>(undefined);
            const component = VsComponent.VsButton;

            // when
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe(undefined);
        });

        it('colorScheme.value 변경 시 반응적으로 업데이트되어야 함', () => {
            // given
            const colorScheme = ref<ColorScheme | undefined>(undefined);
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
            const colorScheme = ref<ColorScheme | undefined>(undefined);
            const component = VsComponent.VsSection;
            const { computedColorScheme } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe(undefined);

            // when
            mockOptionsStore.colorScheme.value = {
                [component]: 'cyan',
            };
            // then
            expect(computedColorScheme.value).toBe('cyan');

            // when
            mockOptionsStore.colorScheme.value = {};
            // then
            expect(computedColorScheme.value).toBe(undefined);
        });
    });

    describe('colorSchemeClass', () => {
        it('colorScheme 값이 있을 때 올바른 CSS 클래스를 생성해야 함', () => {
            // given
            const colorScheme = ref<ColorScheme>('red');
            const component = VsComponent.VsButton;

            // when
            const { colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(colorSchemeClass.value).toBe('vs-red');
        });

        it('colorScheme 값이 없을 때 vs-none 클래스를 생성해야 함', () => {
            // given
            const colorScheme = ref<ColorScheme | undefined>(undefined);
            const component = VsComponent.VsButton;

            // when
            const { colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(colorSchemeClass.value).toBe('vs-none');
        });

        it('옵션 스토어의 값으로 CSS 클래스를 생성해야 함', () => {
            // given
            const colorScheme = ref<ColorScheme | undefined>(undefined);
            const component = VsComponent.VsSection;
            mockOptionsStore.colorScheme.value = {
                [component]: 'emerald',
            };

            // when
            const { colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(colorSchemeClass.value).toBe('vs-emerald');
        });

        it('colorScheme 값 변경 시 CSS 클래스가 반응적으로 업데이트되어야 함', () => {
            // given
            const colorScheme = ref<ColorScheme | undefined>(undefined);
            const component = VsComponent.VsButton;
            const { colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(colorSchemeClass.value).toBe('vs-none');

            // when
            colorScheme.value = 'violet';
            // then
            expect(colorSchemeClass.value).toBe('vs-violet');

            // when
            colorScheme.value = 'amber';
            // then
            expect(colorSchemeClass.value).toBe('vs-amber');

            // when
            colorScheme.value = undefined;
            // then
            expect(colorSchemeClass.value).toBe('vs-none');
        });
    });

    describe('통합 테스트', () => {
        it('우선순위가 올바르게 적용되어야 함 (colorScheme.value > 옵션 스토어)', () => {
            // given
            const colorScheme = ref<ColorScheme | undefined>(undefined);
            const component = VsComponent.VsButton;
            mockOptionsStore.colorScheme.value = {
                [component]: 'blue',
            };

            // when
            const { computedColorScheme, colorSchemeClass } = useColorScheme(component, colorScheme);

            // then
            expect(computedColorScheme.value).toBe('blue');
            expect(colorSchemeClass.value).toBe('vs-blue');

            // when
            colorScheme.value = 'red';
            // then
            expect(computedColorScheme.value).toBe('red');
            expect(colorSchemeClass.value).toBe('vs-red');

            // when
            colorScheme.value = undefined;
            // then
            expect(computedColorScheme.value).toBe('blue');
            expect(colorSchemeClass.value).toBe('vs-blue');
        });
    });
});
