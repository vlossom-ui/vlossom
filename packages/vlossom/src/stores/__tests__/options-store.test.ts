import { describe, it, expect, beforeEach } from 'vitest';
import { OptionsStore } from './../options-store';

describe('options-store', () => {
    let store: OptionsStore;

    beforeEach(() => {
        store = new OptionsStore();
    });

    describe('초기 상태', () => {
        it('colorScheme이 빈 객체여야 한다', () => {
            // then
            expect(store.colorScheme.value).toEqual({});
        });

        it('styleSet이 빈 객체여야 한다', () => {
            // then
            expect(store.styleSet.value).toEqual({});
        });

        it('theme이 light여야 한다', () => {
            // then
            expect(store.theme.value).toBe('light');
        });

        it('radiusRatio가 1이어야 한다', () => {
            // then
            expect(store.radiusRatio.value).toBe(1);
        });
    });

    describe('setColorScheme', () => {
        it('colorScheme을 설정할 수 있어야 한다', () => {
            // given
            const colorScheme = { VsButton: 'red' } as const;

            // when
            store.setColorScheme(colorScheme);

            // then
            expect(store.colorScheme.value).toEqual(colorScheme);
        });
    });

    describe('setStyleSet', () => {
        it('styleSet을 설정할 수 있어야 한다', () => {
            // given
            const styleSet = { myStyle: { VsButton: { backgroundColor: 'red' } } };

            // when
            store.setStyleSet(styleSet);

            // then
            expect(store.styleSet.value).toEqual(styleSet);
        });
    });

    describe('setTheme', () => {
        it('theme을 설정할 수 있어야 한다', () => {
            // when
            store.setTheme('dark');

            // then
            expect(store.theme.value).toBe('dark');
        });
    });

    describe('setRadiusRatio', () => {
        it('0과 1 사이의 값을 설정할 수 있어야 한다', () => {
            // when
            store.setRadiusRatio(0.5);

            // then
            expect(store.radiusRatio.value).toBe(0.5);
        });

        it('0을 설정할 수 있어야 한다', () => {
            // when
            store.setRadiusRatio(0);

            // then
            expect(store.radiusRatio.value).toBe(0);
        });

        it('1을 설정할 수 있어야 한다', () => {
            // when
            store.setRadiusRatio(1);

            // then
            expect(store.radiusRatio.value).toBe(1);
        });

        it('1보다 큰 값은 1로 clamp되어야 한다', () => {
            // when
            store.setRadiusRatio(1.5);

            // then
            expect(store.radiusRatio.value).toBe(1);
        });

        it('0보다 작은 값은 0으로 clamp되어야 한다', () => {
            // when
            store.setRadiusRatio(-0.5);

            // then
            expect(store.radiusRatio.value).toBe(0);
        });
    });

    describe('getComponentStyleSet', () => {
        it('존재하는 styleSet의 컴포넌트 스타일을 반환해야 한다', () => {
            // given
            const componentStyle = { backgroundColor: 'red' };
            const styleSet = { myStyle: { VsButton: componentStyle } };
            store.setStyleSet(styleSet);

            // when
            const result = store.getComponentStyleSet('myStyle', 'VsButton');

            // then
            expect(result).toEqual(componentStyle);
        });

        it('존재하지 않는 styleSet은 빈 객체를 반환해야 한다', () => {
            // when
            const result = store.getComponentStyleSet('nonexistent', 'VsButton');

            // then
            expect(result).toEqual({});
        });

        it('존재하지 않는 컴포넌트는 빈 객체를 반환해야 한다', () => {
            // given
            const styleSet = { myStyle: { VsButton: { backgroundColor: 'red' } } };
            store.setStyleSet(styleSet);

            // when
            const result = store.getComponentStyleSet('myStyle', 'NonexistentComponent');

            // then
            expect(result).toEqual({});
        });
    });
});
