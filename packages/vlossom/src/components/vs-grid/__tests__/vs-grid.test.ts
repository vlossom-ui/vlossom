import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsGrid from './../VsGrid.vue';

describe('VsGrid', () => {
    describe('props', () => {
        it('tag prop이 주어지면 해당 태그로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    tag: 'section',
                },
            });

            // then
            expect(wrapper.find('section').exists()).toBe(true);
            expect(wrapper.find('section').classes()).toContain('vs-grid');
        });

        it('width & height', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    width: '600px',
                    height: '500px',
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-grid-width': '600px',
                '--vs-grid-height': '500px',
            });
        });

        it('gridSize가 주어지면 올바른 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    gridSize: 6,
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-grid-gridSize': 6,
            });
        });

        it('columnGap이 주어지면 올바른 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    columnGap: '20px',
                    rowGap: '25px',
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-grid-columnGap': '20px',
                '--vs-grid-rowGap': '25px',
            });
        });

        it('styleSet 객체가 주어지면 추가 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    styleSet: {
                        width: '800px',
                        height: '600px',
                        gridSize: 4,
                        columnGap: '30px',
                        rowGap: '20px',
                    },
                },
            });

            // then
            // styleSet의 값들이 적용되어야 함
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-grid-width': '800px',
                '--vs-grid-height': '600px',
                '--vs-grid-gridSize': 4,
                '--vs-grid-columnGap': '30px',
                '--vs-grid-rowGap': '20px',
            });
        });
    });

    describe('복합 styleSet 조합', () => {
        it('styleSet과 props가 동시에 주어지면 props가 우선되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    tag: 'main',
                    width: '1200px',
                    height: '800px',
                    gridSize: 16,
                    columnGap: '24px',
                    rowGap: '16px',
                    styleSet: {
                        width: '1000px',
                        height: '700px',
                    },
                },
            });

            // then
            const grid = wrapper.find('main');
            expect(grid.exists()).toBe(true);
            expect(grid.classes()).toContain('vs-grid');

            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-grid-gridSize': 16,
                '--vs-grid-columnGap': '24px',
                '--vs-grid-rowGap': '16px',
                // additionalStyleSet이 styleSet보다 우선되므로 props 값이 적용됨
                '--vs-grid-width': '1200px',
                '--vs-grid-height': '800px',
            });
        });

        it('일부 props만 주어지고 나머지는 기본값을 사용해야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    gridSize: 10,
                    columnGap: '12px',
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-grid-gridSize': 10,
                '--vs-grid-columnGap': '12px',
                // width, height, rowGap은 변수로 정의되지 않고 CSS 기본값 사용됨
            });
        });
    });
});
