import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { provide, defineComponent, h } from 'vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
import VsHeader from './../VsHeader.vue';

describe('VsHeader', () => {
    let layoutStore: LayoutStore;

    beforeEach(() => {
        // 각 테스트마다 새로운 LayoutStore 인스턴스 생성
        layoutStore = LayoutStore.getDefaultLayoutStore();
    });

    describe('기본 렌더링', () => {
        it('기본 상태에서 header 태그로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader);

            // then
            expect(wrapper.find('header').exists()).toBe(true);
            expect(wrapper.find('header').classes()).toContain('vs-header');
        });

        it('vs-bar 컴포넌트가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader);

            // then
            expect(wrapper.findComponent({ name: 'VsBar' }).exists()).toBe(true);
        });
    });

    describe('props', () => {
        it('primary prop이 true이면 vs-primary 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    primary: true,
                },
            });

            // then
            expect(wrapper.classes()).toContain('vs-primary');
        });

        it('tag prop이 주어지면 vs-bar에 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
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
            const wrapper = mount(VsHeader, {
                props: {
                    height: '4rem',
                },
            });

            // then
            expect(wrapper.vm.computedStyleSet.height).toBe('4rem');
        });

        it('colorScheme이 주어지면 해당 colorScheme 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    colorScheme: 'blue',
                },
            });

            // then
            expect(wrapper.classes()).toContain('vs-color-scheme-blue');
        });

        it('position prop이 absolute로 설정되면 positioned 상태가 되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    position: 'absolute',
                },
            });

            // then
            expect(wrapper.vm.computedStyleSet.position).toBe('absolute');
            expect(wrapper.vm.computedStyleSet.top).toBe(0);
            expect(wrapper.vm.computedStyleSet.left).toBe(0);
        });

        it('position prop이 fixed로 설정되면 positioned 상태가 되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    position: 'fixed',
                },
            });

            // then
            expect(wrapper.vm.computedStyleSet.position).toBe('fixed');
            expect(wrapper.vm.computedStyleSet.top).toBe(0);
            expect(wrapper.vm.computedStyleSet.left).toBe(0);
        });

        it('position prop이 sticky로 설정되면 positioned 상태가 되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    position: 'sticky',
                },
            });

            // then
            expect(wrapper.vm.computedStyleSet.position).toBe('sticky');
            expect(wrapper.vm.computedStyleSet.top).toBe(0);
            expect(wrapper.vm.computedStyleSet.left).toBe(0);
        });

        it('styleSet 객체가 주어지면 computedStyleSet에 병합되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    styleSet: {
                        backgroundColor: '#ff0000',
                        height: '60px',
                        padding: '0 1rem',
                        zIndex: '1000',
                    },
                },
            });

            // then
            expect(wrapper.vm.computedStyleSet.backgroundColor).toBe('#ff0000');
            expect(wrapper.vm.computedStyleSet.height).toBe('60px');
            expect(wrapper.vm.computedStyleSet.padding).toBe('0 1rem');
            expect(wrapper.vm.computedStyleSet.zIndex).toBe('1000');
        });

        it('position과 height가 모두 주어지면 positioned 상태에서 height가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    position: 'absolute',
                    height: '5rem',
                },
            });

            // then
            expect(wrapper.vm.computedStyleSet.position).toBe('absolute');
            expect(wrapper.vm.computedStyleSet.height).toBe('5rem');
            expect(wrapper.vm.computedStyleSet.top).toBe(0);
            expect(wrapper.vm.computedStyleSet.left).toBe(0);
        });

        it('position이 relative일 때도 height가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    position: 'relative',
                    height: '6rem',
                },
            });

            // then
            expect(wrapper.vm.computedStyleSet.position).toBe('relative');
            expect(wrapper.vm.computedStyleSet.height).toBe('6rem'); // height prop이 적용됨
        });

        it('position이 없어도 height가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    height: '7rem',
                },
            });

            // then
            expect(wrapper.vm.computedStyleSet.position).toBeUndefined();
            expect(wrapper.vm.computedStyleSet.height).toBe('7rem'); // height prop이 적용됨
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

        it('header 정보가 layoutStore에 설정되어야 한다', () => {
            // given
            const setHeaderSpy = vi.spyOn(layoutStore, 'setHeader');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: VsHeader,
                },
            });

            // then
            // setHeader가 호출되었는지 확인
            expect(setHeaderSpy).toHaveBeenCalled();
        });

        it('position이 absolute일 때 header 정보가 올바르게 설정되어야 한다', () => {
            // given
            const setHeaderSpy = vi.spyOn(layoutStore, 'setHeader');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsHeader, { position: 'absolute', height: '4rem' }),
                },
            });

            // then
            expect(setHeaderSpy).toHaveBeenCalledWith({
                position: 'absolute',
                height: '4rem',
            });
        });

        it('position이 fixed일 때 header 정보가 올바르게 설정되어야 한다', () => {
            // given
            const setHeaderSpy = vi.spyOn(layoutStore, 'setHeader');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsHeader, { position: 'fixed', height: '5rem' }),
                },
            });

            // then
            expect(setHeaderSpy).toHaveBeenCalledWith({
                position: 'fixed',
                height: '5rem',
            });
        });

        it('position이 sticky일 때 header 정보가 올바르게 설정되어야 한다', () => {
            // given
            const setHeaderSpy = vi.spyOn(layoutStore, 'setHeader');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsHeader, { position: 'sticky', height: '4rem' }),
                },
            });

            // then
            expect(setHeaderSpy).toHaveBeenCalledWith({
                position: 'sticky',
                height: '4rem',
            });
        });

        it('position이 relative일 때 header 정보가 올바르게 설정되어야 한다', () => {
            // given
            const setHeaderSpy = vi.spyOn(layoutStore, 'setHeader');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsHeader, { position: 'relative', height: '6rem' }),
                },
            });

            // then
            expect(setHeaderSpy).toHaveBeenCalledWith({
                position: 'relative',
                height: '6rem', // height prop이 적용됨
            });
        });
    });
});
