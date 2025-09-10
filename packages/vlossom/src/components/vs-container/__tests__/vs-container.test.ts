import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { provide, defineComponent } from 'vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
import VsContainer from './../VsContainer.vue';

describe('VsContainer', () => {
    let layoutStore: LayoutStore;

    beforeEach(() => {
        // 각 테스트마다 새로운 mock LayoutStore 인스턴스 생성
        layoutStore = LayoutStore.getDefaultLayoutStore();
    });

    describe('tag prop', () => {
        it('기본 상태에서 div 태그로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsContainer);

            // then
            expect(wrapper.find('div').exists()).toBe(true);
            expect(wrapper.find('div').classes()).toContain('vs-container');
        });

        it('tag prop이 주어지면 해당 태그로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsContainer, {
                props: {
                    tag: 'section',
                },
            });

            // then
            expect(wrapper.find('section').exists()).toBe(true);
            expect(wrapper.find('section').classes()).toContain('vs-container');
        });
    });

    describe('vs-layout의 자식이 아닐 때', () => {
        it('vs-layout의 자식이 아니면 추가 스타일이 적용되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsContainer);

            // then
            expect(wrapper.vm.layoutStyles).toEqual({});
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

        it('header와 footer 모두 absolute/fixed일 때 두 패딩이 모두 적용되어야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'fixed', height: '70px' });
            layoutStore.setFooter({ position: 'absolute', height: '90px' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            expect(container.vm.layoutStyles).toEqual({
                paddingTop: '70px',
                paddingBottom: '90px',
            });
        });

        it('header와 footer position이 relative일 때 패딩이 적용되지 않아야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'relative', height: '60px' });
            layoutStore.setFooter({ position: 'relative', height: '80px' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            expect(container.vm.layoutStyles).toEqual({});
        });

        it('header와 footer position이 static일 때 패딩이 적용되지 않아야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'static', height: '60px' });
            layoutStore.setFooter({ position: 'static', height: '80px' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            expect(container.vm.layoutStyles).toEqual({});
        });

        it('header와 footer position이 sticky일 때 패딩이 적용되어야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'sticky', height: '60px' });
            layoutStore.setFooter({ position: 'sticky', height: '80px' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            expect(container.vm.layoutStyles).toEqual({
                paddingTop: '60px',
                paddingBottom: '80px',
            });
        });
    });

    describe('drawers 관련 테스트', () => {
        // vs-layout 컴포넌트 모킹
        const MockVsLayout = defineComponent({
            name: VsComponent.VsLayout,
            setup() {
                provide(LAYOUT_STORE_KEY, layoutStore);
                return {};
            },
            template: '<div><slot /></div>',
        });

        describe('각 방향별 drawer 테스트', () => {
            it('left drawer가 열려있고 responsive이며 size가 설정되어 있을 때 왼쪽 패딩이 적용되어야 한다', () => {
                // given
                layoutStore.setDrawer({
                    placement: 'left',
                    isOpen: true,
                    responsive: true,
                    size: '200px',
                });

                // when
                const wrapper = mount(MockVsLayout, {
                    slots: {
                        default: VsContainer,
                    },
                });

                // then
                const container = wrapper.findComponent(VsContainer);
                expect(container.vm.layoutStyles).toEqual({
                    paddingLeft: '200px',
                });
            });

            it('top drawer가 열려있고 responsive이며 size가 설정되어 있을 때 위쪽 패딩이 적용되어야 한다', () => {
                // given
                layoutStore.setDrawer({
                    placement: 'top',
                    isOpen: true,
                    responsive: true,
                    size: '150px',
                });

                // when
                const wrapper = mount(MockVsLayout, {
                    slots: {
                        default: VsContainer,
                    },
                });

                // then
                const container = wrapper.findComponent(VsContainer);
                expect(container.vm.layoutStyles).toEqual({
                    paddingTop: '150px',
                });
            });

            it('right drawer가 열려있고 responsive이며 size가 설정되어 있을 때 오른쪽 패딩이 적용되어야 한다', () => {
                // given
                layoutStore.setDrawer({
                    placement: 'right',
                    isOpen: true,
                    responsive: true,
                    size: '250px',
                });

                // when
                const wrapper = mount(MockVsLayout, {
                    slots: {
                        default: VsContainer,
                    },
                });

                // then
                const container = wrapper.findComponent(VsContainer);
                expect(container.vm.layoutStyles).toEqual({
                    paddingRight: '250px',
                });
            });

            it('bottom drawer가 열려있고 responsive이며 size가 설정되어 있을 때 아래쪽 패딩이 적용되어야 한다', () => {
                // given
                layoutStore.setDrawer({
                    placement: 'bottom',
                    isOpen: true,
                    responsive: true,
                    size: '100px',
                });

                // when
                const wrapper = mount(MockVsLayout, {
                    slots: {
                        default: VsContainer,
                    },
                });

                // then
                const container = wrapper.findComponent(VsContainer);
                expect(container.vm.layoutStyles).toEqual({
                    paddingBottom: '100px',
                });
            });
        });

        describe('drawer 조건 테스트', () => {
            it('drawer가 닫혀있으면 패딩이 적용되지 않아야 한다', () => {
                // given
                layoutStore.setDrawer({
                    placement: 'left',
                    isOpen: false,
                    responsive: true,
                    size: '200px',
                });

                // when
                const wrapper = mount(MockVsLayout, {
                    slots: {
                        default: VsContainer,
                    },
                });

                // then
                const container = wrapper.findComponent(VsContainer);
                expect(container.vm.layoutStyles).toEqual({});
            });

            it('drawer가 responsive하지 않으면 패딩이 적용되지 않아야 한다', () => {
                // given
                layoutStore.setDrawer({
                    placement: 'left',
                    isOpen: true,
                    responsive: false,
                    size: '200px',
                });

                // when
                const wrapper = mount(MockVsLayout, {
                    slots: {
                        default: VsContainer,
                    },
                });

                // then
                const container = wrapper.findComponent(VsContainer);
                expect(container.vm.layoutStyles).toEqual({});
            });

            it('drawer의 size가 빈 문자열이면 패딩이 적용되지 않아야 한다', () => {
                // given
                layoutStore.setDrawer({
                    placement: 'left',
                    isOpen: true,
                    responsive: true,
                    size: '',
                });

                // when
                const wrapper = mount(MockVsLayout, {
                    slots: {
                        default: VsContainer,
                    },
                });

                // then
                const container = wrapper.findComponent(VsContainer);
                expect(container.vm.layoutStyles).toEqual({});
            });
        });

        describe('모든 drawer가 활성화된 경우', () => {
            it('모든 방향의 drawer가 활성화되어 있을 때 모든 패딩이 적용되어야 한다', () => {
                // given
                layoutStore.setDrawer({ placement: 'left', isOpen: true, responsive: true, size: '200px' });
                layoutStore.setDrawer({ placement: 'top', isOpen: true, responsive: true, size: '150px' });
                layoutStore.setDrawer({ placement: 'right', isOpen: true, responsive: true, size: '250px' });
                layoutStore.setDrawer({ placement: 'bottom', isOpen: true, responsive: true, size: '100px' });

                // when
                const wrapper = mount(MockVsLayout, {
                    slots: {
                        default: VsContainer,
                    },
                });

                // then
                const container = wrapper.findComponent(VsContainer);
                expect(container.vm.layoutStyles).toEqual({
                    paddingLeft: '200px',
                    paddingTop: '150px',
                    paddingBottom: '100px',
                    paddingRight: '250px',
                });
            });
        });
    });

    describe('복합 조합 테스트', () => {
        // vs-layout 컴포넌트 모킹
        const MockVsLayout = defineComponent({
            name: VsComponent.VsLayout,
            setup() {
                provide(LAYOUT_STORE_KEY, layoutStore);
                return {};
            },
            template: '<div><slot /></div>',
        });

        it('header, footer, drawer가 모두 활성화되어 있을 때 모든 패딩이 올바르게 적용되어야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'fixed', height: '70px' });
            layoutStore.setFooter({ position: 'absolute', height: '90px' });
            layoutStore.setDrawer({ placement: 'left', isOpen: true, responsive: true, size: '200px' });
            layoutStore.setDrawer({ placement: 'right', isOpen: true, responsive: true, size: '250px' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            expect(container.vm.layoutStyles).toEqual({
                paddingTop: '70px',
                paddingBottom: '90px',
                paddingLeft: '200px',
                paddingRight: '250px',
            });
        });

        it('header는 sticky이고 drawer는 top/bottom일 때 padding-top이 중복되지 않고 올바르게 계산되어야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'sticky', height: '60px' });
            layoutStore.setDrawer({ placement: 'top', isOpen: true, responsive: true, size: '40px' });
            layoutStore.setDrawer({ placement: 'bottom', isOpen: true, responsive: true, size: '50px' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            // drawerStyles가 나중에 spread되므로 drawer의 paddingTop이 우선됨
            expect(container.vm.layoutStyles).toEqual({
                paddingTop: '40px',
                paddingBottom: '50px',
            });
        });

        it('일부 조건만 활성화되어 있을 때 해당하는 패딩만 적용되어야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'relative', height: '60px' }); // padding 적용되지 않음
            layoutStore.setFooter({ position: 'fixed', height: '80px' }); // padding 적용됨
            layoutStore.setDrawer({ placement: 'left', isOpen: false, responsive: true, size: '200px' }); // padding 적용되지 않음
            layoutStore.setDrawer({ placement: 'right', isOpen: true, responsive: true, size: '250px' }); // padding 적용됨

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            expect(container.vm.layoutStyles).toEqual({
                paddingBottom: '80px',
                paddingRight: '250px',
            });
        });
    });
});
