import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { provide, defineComponent, h } from 'vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
import VsFooter from './../VsFooter.vue';

describe('VsFooter', () => {
    let layoutStore: LayoutStore;

    beforeEach(() => {
        // 각 테스트마다 새로운 LayoutStore 인스턴스 생성
        layoutStore = LayoutStore.getDefaultLayoutStore();
    });

    describe('기본 렌더링', () => {
        it('기본 상태에서 footer 태그로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter);

            // then
            expect(wrapper.find('footer').exists()).toBe(true);
            expect(wrapper.find('footer').classes()).toContain('vs-footer');
        });

        it('vs-bar 컴포넌트가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter);

            // then
            expect(wrapper.findComponent({ name: 'VsBar' }).exists()).toBe(true);
        });
    });

    describe('props', () => {
        it('primary prop이 true이면 vs-primary 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    primary: true,
                },
            });

            // then
            expect(wrapper.classes()).toContain('vs-primary');
        });

        it('tag prop이 주어지면 vs-bar에 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    tag: 'div',
                },
            });

            // then
            const vsBar = wrapper.findComponent({ name: 'VsBar' });
            expect(vsBar.props('tag')).toBe('div');
        });

        it('height prop이 주어지면 computedStyleSet에 height가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    height: '4rem',
                },
            });

            // then
            expect(wrapper.vm.computedStyleSet.component?.height).toBe('4rem');
        });

        it('colorScheme이 주어지면 해당 colorScheme 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    colorScheme: 'blue',
                },
            });

            // then
            expect(wrapper.classes()).toContain('vs-color-scheme-blue');
        });

        it('position prop이 absolute로 설정되면 positioned 상태가 되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    position: 'absolute',
                },
            });

            // then
            expect(wrapper.vm.position).toBe('absolute');
            expect(wrapper.vm.computedStyleSet.component?.bottom).toBe(0);
            expect(wrapper.vm.computedStyleSet.component?.left).toBe(0);
        });

        it('position prop이 fixed로 설정되면 positioned 상태가 되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    position: 'fixed',
                },
            });

            // then
            expect(wrapper.vm.position).toBe('fixed');
            expect(wrapper.vm.computedStyleSet.component?.bottom).toBe(0);
            expect(wrapper.vm.computedStyleSet.component?.left).toBe(0);
        });

        it('position prop이 sticky로 설정되면 positioned 상태가 되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    position: 'sticky',
                },
            });

            // then
            expect(wrapper.vm.position).toBe('sticky');
            expect(wrapper.vm.computedStyleSet.component?.bottom).toBe(0);
            expect(wrapper.vm.computedStyleSet.component?.left).toBe(0);
        });

        it('styleSet 객체가 주어지면 computedStyleSet에 병합되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    styleSet: {
                        component: {
                            backgroundColor: '#ff0000',
                            height: '60px',
                            padding: '0 1rem',
                            zIndex: '1000',
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.computedStyleSet.component?.backgroundColor).toBe('#ff0000');
            expect(wrapper.vm.computedStyleSet.component?.height).toBe('60px');
            expect(wrapper.vm.computedStyleSet.component?.padding).toBe('0 1rem');
            expect(wrapper.vm.computedStyleSet.component?.zIndex).toBe('1000');
        });

        it('position과 height가 모두 주어지면 positioned 상태에서 height가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    position: 'absolute',
                    height: '5rem',
                },
            });

            // then
            expect(wrapper.vm.position).toBe('absolute');
            expect(wrapper.vm.computedStyleSet.component?.height).toBe('5rem');
            expect(wrapper.vm.computedStyleSet.component?.bottom).toBe(0);
            expect(wrapper.vm.computedStyleSet.component?.left).toBe(0);
        });

        it('position이 relative일 때도 height가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    position: 'relative',
                    height: '6rem',
                },
            });

            // then
            expect(wrapper.vm.position).toBe('relative');
            expect(wrapper.vm.computedStyleSet.component?.height).toBe('6rem'); // height prop이 적용됨
        });

        it('position이 없어도 height가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsFooter, {
                props: {
                    height: '7rem',
                },
            });

            // then
            expect(wrapper.vm.position).toBeUndefined();
            expect(wrapper.vm.computedStyleSet.component?.height).toBe('7rem'); // height prop이 적용됨
        });
    });

    describe('vs-layout의 자식일 때', () => {
        // vs-layout 컴포넌트 모킹
        const MockVsLayout = defineComponent({
            name: VsComponent.VsLayout,
            setup() {
                provide(LAYOUT_STORE_KEY, layoutStore);
                return {};
            },
            template: '<div><slot /></div>',
        });

        it('footer 정보가 layoutStore에 설정되어야 한다', () => {
            // given
            const setFooterSpy = vi.spyOn(layoutStore, 'setFooter');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: VsFooter,
                },
            });

            // then
            // setFooter가 호출되었는지 확인
            expect(setFooterSpy).toHaveBeenCalled();
        });

        it('position이 absolute일 때 footer 정보가 올바르게 설정되어야 한다', () => {
            // given
            const setFooterSpy = vi.spyOn(layoutStore, 'setFooter');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsFooter, { position: 'absolute', height: '4rem' }),
                },
            });

            // then
            expect(setFooterSpy).toHaveBeenCalledWith({
                position: 'absolute',
                height: '4rem',
            });
        });

        it('position이 fixed일 때 footer 정보가 올바르게 설정되어야 한다', () => {
            // given
            const setFooterSpy = vi.spyOn(layoutStore, 'setFooter');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsFooter, { position: 'fixed', height: '5rem' }),
                },
            });

            // then
            expect(setFooterSpy).toHaveBeenCalledWith({
                position: 'fixed',
                height: '5rem',
            });
        });

        it('position이 sticky일 때 footer 정보가 올바르게 설정되어야 한다', () => {
            // given
            const setFooterSpy = vi.spyOn(layoutStore, 'setFooter');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsFooter, { position: 'sticky', height: '4rem' }),
                },
            });

            // then
            expect(setFooterSpy).toHaveBeenCalledWith({
                position: 'sticky',
                height: '4rem',
            });
        });

        it('position이 relative일 때 footer 정보가 올바르게 설정되어야 한다', () => {
            // given
            const setFooterSpy = vi.spyOn(layoutStore, 'setFooter');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsFooter, { position: 'relative', height: '6rem' }),
                },
            });

            // then
            expect(setFooterSpy).toHaveBeenCalledWith({
                position: 'relative',
                height: '6rem', // height prop이 적용됨
            });
        });
    });
});
