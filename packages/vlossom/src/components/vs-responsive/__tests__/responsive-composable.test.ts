import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import type { Breakpoints } from '@/declaration';
import { useResponsive } from './../composables/responsive-composable';

describe('useResponsive', () => {
    describe('responsiveClasses', () => {
        it('width와 grid가 undefined이면 빈 배열을 반환해야 한다', () => {
            // given
            const width = ref<Breakpoints | undefined>(undefined);
            const grid = ref<Breakpoints | undefined>(undefined);

            // when
            const { responsiveClasses } = useResponsive(width, grid);

            // then
            expect(responsiveClasses.value).toEqual([]);
        });

        it('width가 객체일 때 각 breakpoint에 대한 클래스를 생성해야 한다', () => {
            // given
            const width = ref<Breakpoints>({
                sm: '100px',
                md: '200px',
                lg: '300px',
                xl: '400px',
            });
            const grid = ref<Breakpoints | undefined>(undefined);

            // when
            const { responsiveClasses } = useResponsive(width, grid);

            // then
            expect(responsiveClasses.value).toEqual(['vs-width-sm', 'vs-width-md', 'vs-width-lg', 'vs-width-xl']);
        });

        it('grid가 객체일 때 각 breakpoint에 대한 클래스를 생성해야 한다', () => {
            // given
            const width = ref<Breakpoints | undefined>(undefined);
            const grid = ref<Breakpoints>({
                sm: 1,
                md: 2,
                lg: 3,
                xl: 4,
            });

            // when
            const { responsiveClasses } = useResponsive(width, grid);

            // then
            expect(responsiveClasses.value).toEqual(['vs-grid-sm', 'vs-grid-md', 'vs-grid-lg', 'vs-grid-xl']);
        });

        it('width와 grid가 모두 객체일 때 모든 클래스를 생성해야 한다', () => {
            // given
            const width = ref<Breakpoints>({
                sm: '100px',
                lg: '300px',
            });
            const grid = ref<Breakpoints>({
                md: 2,
                xl: 4,
            });

            // when
            const { responsiveClasses } = useResponsive(width, grid);

            // then
            expect(responsiveClasses.value).toEqual(['vs-width-sm', 'vs-width-lg', 'vs-grid-md', 'vs-grid-xl']);
        });

        it('빈 값(undefined, null, "")은 클래스를 생성하지 않아야 한다', () => {
            // given
            const width = ref<Breakpoints>({
                sm: undefined,
                md: null as any,
                lg: '',
                xl: '400px',
            });
            const grid = ref<Breakpoints>({
                sm: 0,
                md: '',
                lg: null as any,
                xl: undefined,
            });

            // when
            const { responsiveClasses } = useResponsive(width, grid);

            // then
            expect(responsiveClasses.value).toEqual(['vs-width-xl', 'vs-grid-sm']);
        });

        it('숫자 0은 유효한 값으로 처리해야 한다', () => {
            // given
            const width = ref<Breakpoints>({
                sm: 0,
                md: 100,
            });
            const grid = ref<Breakpoints>({
                lg: 0,
                xl: 5,
            });

            // when
            const { responsiveClasses } = useResponsive(width, grid);

            // then
            expect(responsiveClasses.value).toEqual(['vs-width-sm', 'vs-width-md', 'vs-grid-lg', 'vs-grid-xl']);
        });
    });

    describe('responsiveStyles', () => {
        it('width와 grid가 undefined이면 빈 객체를 반환해야 한다', () => {
            // given
            const width = ref<Breakpoints | undefined>(undefined);
            const grid = ref<Breakpoints | undefined>(undefined);

            // when
            const { responsiveStyles } = useResponsive(width, grid);

            // then
            expect(responsiveStyles.value).toEqual({});
        });

        it('width가 객체일 때 각 breakpoint에 대한 CSS 변수를 생성해야 한다', () => {
            // given
            const width = ref<Breakpoints>({
                xs: '50px',
                sm: 100,
                md: '200px',
                lg: 300,
                xl: '400px',
            });
            const grid = ref<Breakpoints | undefined>(undefined);

            // when
            const { responsiveStyles } = useResponsive(width, grid);

            // then
            expect(responsiveStyles.value).toEqual({
                '--vs-width-xs': '50px',
                '--vs-width-sm': '100px',
                '--vs-width-md': '200px',
                '--vs-width-lg': '300px',
                '--vs-width-xl': '400px',
            });
        });

        it('width가 단일 값일 때 width 스타일을 생성해야 한다', () => {
            // given
            const width = ref<string | number>('150px');
            const grid = ref<Breakpoints | undefined>(undefined);

            // when
            const { responsiveStyles } = useResponsive(width, grid);

            // then
            expect(responsiveStyles.value).toEqual({
                width: '150px',
            });
        });

        it('width가 숫자일 때 px 단위를 추가해야 한다', () => {
            // given
            const width = ref<number>(250);
            const grid = ref<Breakpoints | undefined>(undefined);

            // when
            const { responsiveStyles } = useResponsive(width, grid);

            // then
            expect(responsiveStyles.value).toEqual({
                width: '250px',
            });
        });

        it('grid가 객체일 때 각 breakpoint에 대한 CSS 변수를 생성해야 한다', () => {
            // given
            const width = ref<Breakpoints | undefined>(undefined);
            const grid = ref<Breakpoints>({
                xs: 1,
                sm: '2',
                md: 3,
                lg: '4',
                xl: 5,
            });

            // when
            const { responsiveStyles } = useResponsive(width, grid);

            // then
            expect(responsiveStyles.value).toEqual({
                '--vs-grid-xs': '1',
                '--vs-grid-sm': '2',
                '--vs-grid-md': '3',
                '--vs-grid-lg': '4',
                '--vs-grid-xl': '5',
            });
        });

        it('grid가 단일 값일 때 xs breakpoint에 대한 CSS 변수를 생성해야 한다', () => {
            // given
            const width = ref<Breakpoints | undefined>(undefined);
            const grid = ref<string | number>('3');

            // when
            const { responsiveStyles } = useResponsive(width, grid);

            // then
            expect(responsiveStyles.value).toEqual({
                '--vs-grid-xs': '3',
            });
        });

        it('width와 grid가 모두 설정되었을 때 모든 스타일을 병합해야 한다', () => {
            // given
            const width = ref<Breakpoints>({
                sm: 100,
                lg: 300,
            });
            const grid = ref<Breakpoints>({
                md: 2,
                xl: 4,
            });

            // when
            const { responsiveStyles } = useResponsive(width, grid);

            // then
            expect(responsiveStyles.value).toEqual({
                '--vs-width-sm': '100px',
                '--vs-width-lg': '300px',
                '--vs-grid-md': '2',
                '--vs-grid-xl': '4',
            });
        });

        it('빈 값(undefined, null, "")은 CSS 변수를 생성하지 않아야 한다', () => {
            // given
            const width = ref<Breakpoints>({
                sm: undefined,
                md: null as any,
                lg: '',
                xl: 400,
            });
            const grid = ref<Breakpoints>({
                xs: 0,
                sm: '',
                md: null as any,
                lg: undefined,
                xl: 5,
            });

            // when
            const { responsiveStyles } = useResponsive(width, grid);

            // then
            expect(responsiveStyles.value).toEqual({
                '--vs-width-xl': '400px',
                '--vs-grid-xs': '0',
                '--vs-grid-xl': '5',
            });
        });

        it('숫자 0은 유효한 값으로 처리해야 한다', () => {
            // given
            const width = ref<Breakpoints>({
                sm: 0,
                md: 100,
            });
            const grid = ref<Breakpoints>({
                lg: 0,
                xl: 5,
            });

            // when
            const { responsiveStyles } = useResponsive(width, grid);

            // then
            expect(responsiveStyles.value).toEqual({
                '--vs-width-sm': '0px',
                '--vs-width-md': '100px',
                '--vs-grid-lg': '0',
                '--vs-grid-xl': '5',
            });
        });
    });

    describe('통합 테스트', () => {
        it('복잡한 시나리오에서 올바르게 작동해야 한다', () => {
            // given
            const width = ref<Breakpoints>({
                sm: 100,
                md: undefined,
                lg: 300,
                xl: null as any,
            });
            const grid = ref<Breakpoints>({
                xs: 1,
                sm: '',
                md: 3,
                lg: null as any,
                xl: 5,
            });

            // when
            const { responsiveClasses, responsiveStyles } = useResponsive(width, grid);

            // then
            expect(responsiveClasses.value).toEqual(['vs-width-sm', 'vs-width-lg', 'vs-grid-md', 'vs-grid-xl']);

            expect(responsiveStyles.value).toEqual({
                '--vs-width-sm': '100px',
                '--vs-width-lg': '300px',
                '--vs-grid-xs': '1',
                '--vs-grid-md': '3',
                '--vs-grid-xl': '5',
            });
        });
    });
});
