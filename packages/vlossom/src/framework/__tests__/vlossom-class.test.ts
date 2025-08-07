import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Vlossom } from './../vlossom-class';
import { THEME_KEY, type GlobalColorSchemes, type GlobalStyleSets, type VlossomOptions } from '@/declaration';

describe('Vlossom class', () => {
    let vlossom: Vlossom;

    describe('생성자는 기본 설정으로 인스턴스를 생성한다', () => {
        it('옵션 없이 생성할 때 기본값을 사용한다', () => {
            // given
            // when
            vlossom = new Vlossom();

            // then
            expect(vlossom.colorScheme).toEqual({});
            expect(vlossom.styleSet).toEqual({});
            expect(vlossom.radiusRatio).toBe(1);
        });

        it('옵션을 전달하면 해당 값으로 초기화된다', () => {
            // given
            const options: VlossomOptions = {
                colorScheme: { VsButton: 'red' },
                styleSet: { myStyle: { VsButton: { border: '1px solid red' } } },
                theme: 'dark',
                radiusRatio: 2,
            };

            // when
            vlossom = new Vlossom(options);

            // then
            expect(vlossom.colorScheme).toEqual({ VsButton: 'red' });
            expect(vlossom.styleSet).toEqual({ myStyle: { VsButton: { border: '1px solid red' } } });
            expect(vlossom.theme).toBe('dark');
            expect(vlossom.radiusRatio).toBe(2);
        });
    });

    describe('colorScheme 속성은 색상 스키마를 관리한다', () => {
        beforeEach(() => {
            vlossom = new Vlossom();
        });

        it('colorScheme을 설정하고 조회할 수 있다', () => {
            // given
            const newColorScheme: GlobalColorSchemes = { VsButton: 'red' };

            // when
            vlossom.colorScheme = newColorScheme;

            // then
            expect(vlossom.colorScheme).toEqual(newColorScheme);
        });
    });

    describe('styleSet 속성은 스타일 세트를 관리한다', () => {
        beforeEach(() => {
            vlossom = new Vlossom();
        });

        it('styleSet을 설정하고 조회할 수 있다', () => {
            // given
            const newStyleSet: GlobalStyleSets = { myStyle: { VsButton: { border: '1px solid red' } } };

            // when
            vlossom.styleSet = newStyleSet;

            // then
            expect(vlossom.styleSet).toEqual(newStyleSet);
        });
    });

    describe('theme 속성은 테마를 관리한다', () => {
        beforeEach(() => {
            vlossom = new Vlossom();
        });

        it('theme을 light로 설정하면 dark 클래스가 제거된다', () => {
            // given
            vi.spyOn(document.documentElement.classList, 'toggle');

            // when
            vlossom.theme = 'light';

            // then
            expect(vlossom.theme).toBe('light');
            expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('vs-dark', false);
        });

        it('theme을 dark로 설정하면 dark 클래스가 추가된다', () => {
            // given
            vi.spyOn(document.documentElement.classList, 'toggle');

            // when
            vlossom.theme = 'dark';

            // then
            expect(vlossom.theme).toBe('dark');
            expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('vs-dark', true);
        });
    });

    describe('radiusRatio 속성은 반지름 비율을 관리한다', () => {
        beforeEach(() => {
            vlossom = new Vlossom();
        });

        it('radiusRatio를 설정하고 조회할 수 있다', () => {
            // given
            const newRatio = 1.5;

            // when
            vlossom.radiusRatio = newRatio;

            // then
            expect(vlossom.radiusRatio).toBe(newRatio);
        });
    });

    describe('toggleTheme 메서드는 테마를 토글한다', () => {
        beforeEach(() => {
            vlossom = new Vlossom();
        });

        it('light 테마에서 호출하면 dark 테마로 변경된다', () => {
            // given
            vlossom.theme = 'light';

            // when
            vlossom.toggleTheme();

            // then
            expect(vlossom.theme).toBe('dark');
            expect(localStorage.setItem).toHaveBeenCalledWith(THEME_KEY, 'dark');
        });

        it('dark 테마에서 호출하면 light 테마로 변경된다', () => {
            // given
            vlossom.theme = 'dark';

            // when
            vlossom.toggleTheme();

            // then
            expect(vlossom.theme).toBe('light');
            expect(localStorage.setItem).toHaveBeenCalledWith(THEME_KEY, 'light');
        });
    });

    describe('setDefaultTheme 메서드는 기본 테마를 설정한다', () => {
        it('저장된 테마가 dark이면 dark 테마를 사용한다', () => {
            // given
            localStorage.getItem = vi.fn().mockReturnValue('dark');

            // when
            vlossom = new Vlossom();

            // then
            expect(vlossom.theme).toBe('dark');
        });

        it('저장된 테마가 없고 시스템이 dark 모드면 dark 테마를 사용한다', () => {
            // given
            localStorage.getItem = vi.fn().mockReturnValue(null);
            window.matchMedia = vi.fn().mockImplementation(() => ({
                matches: true,
            }));

            // when
            vlossom = new Vlossom();

            // then
            expect(vlossom.theme).toBe('dark');
        });

        it('저장된 테마가 없고 옵션에서 dark를 지정하면 dark 테마를 사용한다', () => {
            // given
            localStorage.getItem = vi.fn().mockReturnValue(null);
            window.matchMedia = vi.fn().mockImplementation(() => ({
                matches: false,
            }));

            // when
            vlossom = new Vlossom({ theme: 'dark' });

            // then
            expect(vlossom.theme).toBe('dark');
        });

        it('모든 조건이 light를 가리키면 light 테마를 사용한다', () => {
            // given
            localStorage.getItem = vi.fn().mockReturnValue(null);
            window.matchMedia = vi.fn().mockImplementation(() => ({
                matches: false,
            }));

            // when
            vlossom = new Vlossom({ theme: 'light' });

            // then
            expect(vlossom.theme).toBe('light');
        });
    });
});
