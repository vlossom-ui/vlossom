import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { provide, defineComponent, h } from 'vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
import VsDrawer from './../VsDrawer.vue';

describe('VsDrawer', () => {
    let layoutStore: LayoutStore;
    let defaultOptions: any;

    beforeEach(() => {
        // 각 테스트마다 새로운 LayoutStore 인스턴스 생성
        layoutStore = LayoutStore.getDefaultLayoutStore();

        defaultOptions = {
            props: {
                modelValue: false,
                placement: 'left',
            },
            global: {
                stubs: {
                    'vs-focus-trap': {
                        template: '<div class="vs-focus-trap-stub"><slot /></div>',
                        methods: {
                            focus: vi.fn(),
                            blur: vi.fn(),
                        },
                    },
                    'vs-inner-scroll': {
                        template:
                            '<div class="vs-inner-scroll-stub"><slot name="header" /><slot /><slot name="footer" /></div>',
                    },
                    Transition: {
                        template: '<div><slot /></div>',
                    },
                },
            },
        };
    });

    describe('기본 렌더링', () => {
        it('기본 상태에서 drawer가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, defaultOptions);

            // then
            expect(wrapper.find('.vs-drawer').exists()).toBe(true);
        });

        it('modelValue가 false일 때 drawer가 보이지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: false,
                },
            });

            // then
            expect(wrapper.vm.isOpen).toBe(false);
        });

        it('modelValue가 true일 때 drawer가 보여야 한다', async () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                },
            });

            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.vm.isOpen).toBe(true);
        });
    });

    describe('placement props', () => {
        it('placement가 left일 때 올바른 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    placement: 'left',
                    modelValue: true,
                },
            });

            // then
            expect(wrapper.find('.vs-drawer-left').exists()).toBe(true);
        });

        it('placement가 right일 때 올바른 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    placement: 'right',
                    modelValue: true,
                },
            });

            // then
            expect(wrapper.find('.vs-drawer-right').exists()).toBe(true);
        });

        it('placement가 top일 때 올바른 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    placement: 'top',
                    modelValue: true,
                },
            });

            // then
            expect(wrapper.find('.vs-drawer-top').exists()).toBe(true);
        });

        it('placement가 bottom일 때 올바른 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    placement: 'bottom',
                    modelValue: true,
                },
            });

            // then
            expect(wrapper.find('.vs-drawer-bottom').exists()).toBe(true);
        });
    });

    describe('size props', () => {
        it('size가 없을 때 기본 크기(sm)가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-drawer-size': '20%',
            });
        });

        it('size가 lg일 때 60%가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                    size: 'lg',
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-drawer-size': '60%',
            });
        });

        it('size가 문자열로 주어지면 해당 값이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                    size: '300px',
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-drawer-size': '300px',
            });
        });
    });

    describe('fixed props', () => {
        it('fixed가 true일 때 position: fixed가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                    fixed: true,
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-drawer-position': 'fixed',
                '--vs-drawer-size': '20%',
            });
        });
    });

    describe('dimmed 기능', () => {
        it('dimmed가 true일 때 dimmed 요소가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                    dimmed: true,
                },
            });

            // then
            expect(wrapper.find('.vs-drawer-dimmed').exists()).toBe(true);
        });

        it('dimmed 요소를 클릭하면 click-dimmed 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                    dimmed: true,
                },
            });

            await wrapper.vm.$nextTick();

            // when
            const dimmedElement = wrapper.find('.vs-drawer-dimmed');
            expect(dimmedElement.exists()).toBe(true); // dimmed 요소 존재 확인

            // onClickDimmed 함수를 직접 호출
            await wrapper.vm.onClickDimmed();

            // then
            expect(wrapper.emitted('click-dimmed')).toBeTruthy();
        });

        it('dimClose가 true일 때 dimmed 클릭 시 close 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                    dimmed: true,
                    dimClose: true,
                },
            });

            await wrapper.vm.$nextTick();

            // when
            const dimmedElement = wrapper.find('.vs-drawer-dimmed');
            expect(dimmedElement.exists()).toBe(true); // dimmed 요소 존재 확인

            // onClickDimmed 함수를 직접 호출
            await wrapper.vm.onClickDimmed();
            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
        });
    });

    describe('modelValue 이벤트', () => {
        it('modelValue 변경 시 update:modelValue 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: false,
                },
            });

            // when
            await wrapper.setProps({ modelValue: true });

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        });

        it('drawer가 열릴 때 open 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: false,
                },
            });

            // when
            await wrapper.setProps({ modelValue: true });

            // then
            expect(wrapper.emitted('open')).toBeTruthy();
        });

        it('drawer가 닫힐 때 close 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                },
            });

            // when
            await wrapper.setProps({ modelValue: false });

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
        });
    });

    describe('vs-layout 연동', () => {
        // vs-layout 컴포넌트 모킹
        const MockVsLayout = defineComponent({
            name: VsComponent.VsLayout,
            setup() {
                provide(LAYOUT_STORE_KEY, layoutStore);
                return {};
            },
            template: '<div><slot /></div>',
        });

        it('vs-layout의 자식일 때 layoutStore.setDrawer가 호출되어야 한다', () => {
            // given
            const setDrawerSpy = vi.spyOn(layoutStore, 'setDrawer');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () =>
                        h(VsDrawer, {
                            modelValue: true,
                            placement: 'left',
                            size: 'md',
                        }),
                },
                global: {
                    stubs: {
                        'vs-focus-trap': {
                            template: '<div class="vs-focus-trap-stub"><slot /></div>',
                            methods: { focus: vi.fn(), blur: vi.fn() },
                        },
                        'vs-inner-scroll': {
                            template:
                                '<div class="vs-inner-scroll-stub"><slot name="header" /><slot /><slot name="footer" /></div>',
                        },
                        Transition: {
                            template: '<div><slot /></div>',
                        },
                    },
                },
            });

            // then
            expect(setDrawerSpy).toHaveBeenCalledWith({
                isOpen: true,
                placement: 'left',
                size: '40%',
                responsive: false,
            });
        });

        it('layoutResponsive가 true일 때 responsive 옵션이 전달되어야 한다', () => {
            // given
            const setDrawerSpy = vi.spyOn(layoutStore, 'setDrawer');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () =>
                        h(VsDrawer, {
                            modelValue: true,
                            placement: 'right',
                            size: 'lg',
                            layoutResponsive: true,
                        }),
                },
                global: {
                    stubs: {
                        'vs-focus-trap': {
                            template: '<div class="vs-focus-trap-stub"><slot /></div>',
                            methods: { focus: vi.fn(), blur: vi.fn() },
                        },
                        'vs-inner-scroll': {
                            template:
                                '<div class="vs-inner-scroll-stub"><slot name="header" /><slot /><slot name="footer" /></div>',
                        },
                        Transition: {
                            template: '<div><slot /></div>',
                        },
                    },
                },
            });

            // then
            expect(setDrawerSpy).toHaveBeenCalledWith({
                isOpen: true,
                placement: 'right',
                size: '60%',
                responsive: true,
            });
        });
    });
});
