import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsModalNode from './../VsModalNode.vue';

describe('VsModalNode', () => {
    describe('size props', () => {
        it('size가 lg일 때 지정된 lg 크기가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { size: 'lg' },
            });

            // then
            expect(wrapper.vm.componentStyleSet.variables).toEqual({
                width: '70%',
                height: '66%',
            });
        });

        it('size가 문자열로 주어지면 해당 값이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { size: '500px' },
            });

            // then
            expect(wrapper.vm.componentStyleSet.variables).toEqual({
                width: '500px',
                height: '500px',
            });
        });

        it('size가 객체로 주어지면 width와 height가 각각 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: {
                    size: { width: '600px', height: '400px' },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.variables).toEqual({
                width: '600px',
                height: '400px',
            });
        });

        it('size가 객체이고 width만 주어지면 height는 md가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: {
                    size: { width: '600px' },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.variables).toEqual({
                width: '600px',
                height: '50%',
            });
        });

        it('size가 객체이고 height만 주어지면 width는 md가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: {
                    size: { height: '400px' },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.variables).toEqual({
                width: '45%',
                height: '400px',
            });
        });
    });

    describe('복합 styleSet 조합', () => {
        it('styleSet과 size props가 동시에 주어지면 size props가 우선되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: {
                    size: 'lg',
                    styleSet: {
                        variables: {
                            width: '300px',
                            height: '200px',
                            backgroundColor: '#f5f5f5',
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.variables?.width).toBe('70%');
            expect(wrapper.vm.componentStyleSet.variables?.height).toBe('66%');
            expect(wrapper.vm.componentStyleSet.variables?.backgroundColor).toBe('#f5f5f5');
        });
    });

    describe('dimmed 기능', () => {
        it('dimmed가 true일 때 dimmed 요소가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { dimmed: true },
            });

            // then
            expect(wrapper.findComponent({ name: 'VsDimmed' }).exists()).toBe(true);
        });

        it('dimmed가 false일 때 dimmed 요소가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsModalNode, {
                props: { dimmed: false },
            });

            // then
            expect(wrapper.findComponent({ name: 'VsDimmed' }).exists()).toBe(false);
        });

        it('dimClose가 true일 때 dimmed 클릭 시 close 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsModalNode, {
                props: {
                    dimmed: true,
                    dimClose: true,
                },
            });

            await wrapper.vm.$nextTick();

            // when
            await wrapper.vm.onClickDimmed();
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
        });

        it('dimClose가 false일 때 dimmed 클릭 시 close 이벤트가 발생하지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsModalNode, {
                props: {
                    dimmed: true,
                    dimClose: false,
                },
            });

            await wrapper.vm.$nextTick();

            // when
            await wrapper.vm.onClickDimmed();
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('close')).toBeFalsy();
        });
    });

    describe('styleSet 하위 속성 전달', () => {
        it('dimmed styleSet이 vs-dimmed 컴포넌트에 전달되어야 한다', async () => {
            // given
            const dimmedStyleSet = {
                component: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
            };

            // when
            const wrapper = mount(VsModalNode, {
                props: {
                    dimmed: true,
                    styleSet: {
                        dimmed: dimmedStyleSet,
                    },
                },
            });

            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.vm.componentStyleSet.dimmed).toEqual(dimmedStyleSet);
            const vsDimmed = wrapper.findComponent({ name: 'VsDimmed' });
            expect(vsDimmed.exists()).toBe(true);
            expect(vsDimmed.props('styleSet')).toEqual(dimmedStyleSet);
        });

        it('모든 styleSet 하위 속성이 함께 전달되어야 한다', async () => {
            // given
            const fullStyleSet = {
                variables: {
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                },
                dimmed: {
                    component: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            };

            // when
            const wrapper = mount(VsModalNode, {
                props: {
                    dimmed: true,
                    styleSet: fullStyleSet,
                },
            });

            await wrapper.vm.$nextTick();

            // then
            // VsModalNode는 baseStyleSet이 빈 객체이므로 variables가 그대로 적용됨
            expect(wrapper.vm.styleSetVariables['--vs-modal-node-backgroundColor']).toBe('#ffffff');
            expect(wrapper.vm.componentStyleSet.dimmed).toEqual(fullStyleSet.dimmed);
        });
    });
});
