import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { provide, defineComponent, h } from 'vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_PROVIDED_KEY, LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
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

        it('height prop이 주어지면 componentStyleSet에 height가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    height: '4rem',
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.component?.height).toBe('4rem');
        });

        it('position prop이 absolute로 설정되면 positioned 상태가 되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    position: 'absolute',
                },
            });

            // then
            expect(wrapper.props('position')).toBe('absolute');
            expect(wrapper.vm.componentStyleSet.component?.position).toBe('absolute');
            expect(wrapper.vm.componentStyleSet.component?.top).toBe(0);
            expect(wrapper.vm.componentStyleSet.component?.left).toBe(0);
        });

        it('position prop이 fixed로 설정되면 positioned 상태가 되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    position: 'fixed',
                },
            });

            // then
            expect(wrapper.props('position')).toBe('fixed');
            expect(wrapper.vm.componentStyleSet.component?.position).toBe('fixed');
            expect(wrapper.vm.componentStyleSet.component?.top).toBe(0);
            expect(wrapper.vm.componentStyleSet.component?.left).toBe(0);
        });

        it('position prop이 sticky로 설정되면 positioned 상태가 되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    position: 'sticky',
                },
            });

            // then
            expect(wrapper.props('position')).toBe('sticky');
            expect(wrapper.vm.componentStyleSet.component?.position).toBe('sticky');
            expect(wrapper.vm.componentStyleSet.component?.top).toBe(0);
            expect(wrapper.vm.componentStyleSet.component?.left).toBe(0);
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
            expect(wrapper.props('position')).toBe('absolute');
            expect(wrapper.vm.componentStyleSet.component?.height).toBe('5rem');
            expect(wrapper.vm.componentStyleSet.component?.top).toBe(0);
            expect(wrapper.vm.componentStyleSet.component?.left).toBe(0);
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
            expect(wrapper.props('position')).toBe('relative');
            expect(wrapper.vm.componentStyleSet.component?.height).toBe('6rem');
        });

        it('position이 없어도 height가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsHeader, {
                props: {
                    height: '7rem',
                },
            });

            // then
            expect(wrapper.props('position')).toBeUndefined();
            expect(wrapper.vm.componentStyleSet.component?.height).toBe('7rem');
        });
    });

    describe('vs-layout의 자식일 때 (layout prop)', () => {
        // vs-layout 컴포넌트 모킹
        const MockVsLayout = defineComponent({
            name: VsComponent.VsLayout,
            setup() {
                provide(LAYOUT_STORE_KEY, layoutStore);
                provide(LAYOUT_PROVIDED_KEY, true);
                return {};
            },
            template: '<div><slot /></div>',
        });

        it('layout prop이 true이면 header 정보가 layoutStore에 설정되어야 한다', () => {
            // given
            const setHeaderSpy = vi.spyOn(layoutStore, 'setHeader');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsHeader, { layout: true }),
                },
            });

            // then
            expect(setHeaderSpy).toHaveBeenCalled();
        });

        it('layout prop이 없으면 layoutStore에 등록되지 않아야 한다', () => {
            // given
            const setHeaderSpy = vi.spyOn(layoutStore, 'setHeader');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsHeader, { position: 'fixed', height: '4rem' }),
                },
            });

            // then
            expect(setHeaderSpy).not.toHaveBeenCalled();
        });

        it('position이 absolute일 때 header 정보가 올바르게 설정되어야 한다', () => {
            // given
            const setHeaderSpy = vi.spyOn(layoutStore, 'setHeader');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () => h(VsHeader, { layout: true, position: 'absolute', height: '4rem' }),
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
                    default: () => h(VsHeader, { layout: true, position: 'fixed', height: '5rem' }),
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
                    default: () => h(VsHeader, { layout: true, position: 'sticky', height: '4rem' }),
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
                    default: () => h(VsHeader, { layout: true, position: 'relative', height: '6rem' }),
                },
            });

            // then
            expect(setHeaderSpy).toHaveBeenCalledWith({
                position: 'relative',
                height: '6rem', // height prop이 적용됨
            });
        });
    });

    describe('vs-layout 외부에서는 layout prop이 무시되어야 한다', () => {
        it('VsLayout 조상이 없으면 layout prop이 true여도 layoutStore에 등록되지 않아야 한다', () => {
            // given
            const setHeaderSpy = vi.spyOn(layoutStore, 'setHeader');

            // when
            mount(VsHeader, { props: { layout: true } });

            // then
            expect(setHeaderSpy).not.toHaveBeenCalled();
        });
    });
});
