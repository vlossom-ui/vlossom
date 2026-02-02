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
            expect(wrapper.vm.computedStyle).toMatchObject({
                width: '600px',
                height: '500px',
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
            expect(wrapper.vm.computedStyle).toMatchObject({
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
            expect(wrapper.vm.computedStyle).toMatchObject({
                '--vs-grid-columnGap': '20px',
                '--vs-grid-rowGap': '25px',
            });
        });
    });
});
