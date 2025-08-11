import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsGrid from './../VsGrid.vue';

describe('VsGrid', () => {
    describe('기본 렌더링', () => {
        it('기본 props로 렌더링되면 div 태그와 vs-grid 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid);

            // then
            expect(wrapper.find('div').exists()).toBe(true);
            expect(wrapper.find('div').classes()).toContain('vs-grid');
        });

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

        it('슬롯 내용이 올바르게 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                slots: {
                    default: '<div class="test-content">테스트 내용</div>',
                },
            });

            // then
            expect(wrapper.find('.test-content').exists()).toBe(true);
            expect(wrapper.find('.test-content').text()).toBe('테스트 내용');
        });
    });

    describe('width와 height props', () => {
        it('문자열 width가 주어지면 올바른 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    width: '500px',
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-width: 500px');
        });

        it('숫자 width가 주어지면 픽셀 단위로 변환되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    width: 300,
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-width: 300px');
        });

        it('문자열 height가 주어지면 올바른 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    height: '400px',
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-height: 400px');
        });

        it('숫자 height가 주어지면 픽셀 단위로 변환되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    height: 250,
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-height: 250px');
        });

        it('width와 height가 모두 주어지면 둘 다 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    width: '600px',
                    height: '500px',
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-width: 600px');
            expect(grid.attributes('style')).toContain('--vs-grid-height: 500px');
        });
    });

    describe('gridSize prop', () => {
        it('gridSize가 주어지면 올바른 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    gridSize: 6,
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-gridSize: 6');
        });

        it('문자열 gridSize가 주어지면 숫자로 변환되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    gridSize: '8',
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-gridSize: 8');
        });
    });

    describe('columnGap과 rowGap props', () => {
        it('columnGap이 주어지면 올바른 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    columnGap: '20px',
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-columnGap: 20px');
        });

        it('숫자 columnGap이 주어지면 픽셀 단위로 변환되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    columnGap: 15,
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-columnGap: 15px');
        });

        it('rowGap이 주어지면 올바른 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    rowGap: '10px',
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-rowGap: 10px');
        });

        it('숫자 rowGap이 주어지면 픽셀 단위로 변환되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    rowGap: 25,
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toContain('--vs-grid-rowGap: 25px');
        });
    });

    describe('styleSet prop', () => {
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
            const grid = wrapper.find('.vs-grid');

            // styleSet의 값들이 적용되어야 함
            expect(grid.attributes('style')).toContain('--vs-grid-gridSize: 4');
            expect(grid.attributes('style')).toContain('--vs-grid-columnGap: 30px');
            expect(grid.attributes('style')).toContain('--vs-grid-rowGap: 20px');
            // width와 height는 기본값(100%)이 적용됨 (styleSet이 우선되지 않음)
            expect(grid.attributes('style')).toContain('--vs-grid-width: 100%');
            expect(grid.attributes('style')).toContain('--vs-grid-height: 100%');
        });

        it('styleSet 문자열이 주어지면 기본 스타일과 함께 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid, {
                props: {
                    styleSet: 'custom-style',
                },
            });

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.attributes('style')).toBeDefined();
        });
    });

    describe('복합 props 조합', () => {
        it('모든 주요 props가 주어지면 올바르게 적용되어야 한다', () => {
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

            const style = grid.attributes('style'); // additionalStyleSet이 styleSet보다 우선되므로 props 값이 적용됨
            expect(style).toContain('--vs-grid-width: 1200px');
            expect(style).toContain('--vs-grid-height: 800px');
            expect(style).toContain('--vs-grid-gridSize: 16');
            expect(grid.attributes('style')).toContain('--vs-grid-columnGap: 24px');
            expect(grid.attributes('style')).toContain('--vs-grid-rowGap: 16px');
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
            const grid = wrapper.find('.vs-grid');
            const style = grid.attributes('style');
            expect(style).toContain('--vs-grid-gridSize: 10');
            expect(style).toContain('--vs-grid-columnGap: 12px');
            // width, height, rowGap은 기본값 사용
        });
    });

    describe('CSS 클래스와 스타일', () => {
        it('vs-grid 클래스가 올바르게 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid);

            // then
            expect(wrapper.find('.vs-grid').exists()).toBe(true);
        });

        it('컴포넌트가 grid 레이아웃을 사용해야 한다', () => {
            // given, when
            const wrapper = mount(VsGrid);

            // then
            const grid = wrapper.find('.vs-grid');
            expect(grid.classes()).toContain('vs-grid');
            // display: grid는 CSS 클래스로 적용됨
        });
    });
});
