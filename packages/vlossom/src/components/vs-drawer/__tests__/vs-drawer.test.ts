import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, type DOMWrapper } from '@vue/test-utils';
import { provide, defineComponent, h, nextTick } from 'vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_PROVIDED_KEY, LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
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
            expect(wrapper.vm.componentStyleSet.$size).toBe('20%');
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
            expect(wrapper.vm.componentStyleSet.$size).toBe('60%');
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
            expect(wrapper.vm.componentStyleSet.$size).toBe('300px');
        });
    });

    describe('resizable', () => {
        function mockRect(element: Element, rect: Partial<DOMRect>) {
            vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ width: 0, height: 0, ...rect } as DOMRect);
        }

        async function dispatchPointer(handle: DOMWrapper<Element>, type: string, init: MouseEventInit) {
            handle.element.dispatchEvent(new MouseEvent(type, { bubbles: true, ...init }));
            await nextTick();
        }

        function mountResizable(props: Record<string, unknown> = {}) {
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: { ...defaultOptions.props, modelValue: true, resizable: true, size: '200px', ...props },
            });
            const handle = wrapper.find('.vs-drawer-resize-handle');
            (handle.element as HTMLElement).setPointerCapture = vi.fn();
            mockRect(wrapper.find('.vs-drawer').element, { width: 1000, height: 800 });
            mockRect(wrapper.find('.vs-drawer-content').element, { width: 200, height: 200 });
            return { wrapper, handle };
        }

        it('resizable이 없으면 resize handle을 렌더링하지 않는다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: { ...defaultOptions.props, modelValue: true },
            });

            // then
            expect(wrapper.find('.vs-drawer-resize-handle').exists()).toBe(false);
        });

        it('left drawer의 handle을 오른쪽으로 드래그하면 size가 커지고 update:size를 emit한다', async () => {
            // given
            const { wrapper, handle } = mountResizable();

            // when
            await dispatchPointer(handle, 'pointerdown', { clientX: 200 });
            await dispatchPointer(handle, 'pointermove', { clientX: 260 });

            // then
            expect(wrapper.vm.styleSetVariables['--vs-drawer-size']).toBe('260px');
            expect(wrapper.emitted('update:size')).toEqual([[260]]);
        });

        it('right drawer는 왼쪽으로, bottom drawer는 위로 드래그해야 size가 커진다', async () => {
            // given
            const right = mountResizable({ placement: 'right' });
            const bottom = mountResizable({ placement: 'bottom' });

            // when
            await dispatchPointer(right.handle, 'pointerdown', { clientX: 800 });
            await dispatchPointer(right.handle, 'pointermove', { clientX: 750 });
            await dispatchPointer(bottom.handle, 'pointerdown', { clientY: 600 });
            await dispatchPointer(bottom.handle, 'pointermove', { clientY: 580 });

            // then
            expect(right.wrapper.emitted('update:size')).toEqual([[250]]);
            expect(bottom.wrapper.emitted('update:size')).toEqual([[220]]);
        });

        it('drawer 영역을 넘거나 0보다 작아지지 않도록 size를 제한한다', async () => {
            // given
            const { wrapper, handle } = mountResizable();

            // when
            await dispatchPointer(handle, 'pointerdown', { clientX: 200 });
            await dispatchPointer(handle, 'pointermove', { clientX: 5000 });
            await dispatchPointer(handle, 'pointermove', { clientX: -5000 });

            // then
            expect(wrapper.emitted('update:size')).toEqual([[1000], [0]]);
        });

        it('minSize와 maxSize를 실제 크기로 환산해 size를 제한한다', async () => {
            // given
            const { wrapper, handle } = mountResizable({ minSize: 120, maxSize: '480px' });
            const content = wrapper.find('.vs-drawer-content').element as HTMLElement;
            vi.spyOn(content, 'getBoundingClientRect').mockImplementation(
                () => ({ width: parseFloat(content.style.width) || 200 }) as DOMRect,
            );

            // when
            await dispatchPointer(handle, 'pointerdown', { clientX: 200 });
            await dispatchPointer(handle, 'pointermove', { clientX: 900 });
            await dispatchPointer(handle, 'pointermove', { clientX: 0 });

            // then
            expect(wrapper.emitted('update:size')).toEqual([[480], [120]]);
            expect(content.style.width).toBe('');
        });

        it('pointer capture가 해제되면 이후 pointermove는 무시한다', async () => {
            // given
            const { wrapper, handle } = mountResizable();
            await dispatchPointer(handle, 'pointerdown', { clientX: 200 });

            // when
            await handle.trigger('lostpointercapture');
            await dispatchPointer(handle, 'pointermove', { clientX: 300 });

            // then
            expect(wrapper.emitted('update:size')).toBeUndefined();
            expect(wrapper.find('.vs-drawer-resizing').exists()).toBe(false);
        });

        it('size prop이 바뀌면 드래그로 바뀐 size 대신 새 prop 값을 사용한다', async () => {
            // given
            const { wrapper, handle } = mountResizable();
            await dispatchPointer(handle, 'pointerdown', { clientX: 200 });
            await dispatchPointer(handle, 'pointermove', { clientX: 300 });

            // when
            await wrapper.setProps({ size: 'md' });

            // then
            expect(wrapper.vm.styleSetVariables['--vs-drawer-size']).toBe('40%');
        });
    });

    describe('position props', () => {
        it('position이 fixed일 때 position: fixed가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                    position: 'fixed',
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-drawer-size': '20%',
            });
            expect(wrapper.vm.componentStyleSet.position).toBe('fixed');
        });

        it('position이 absolute일 때 position: absolute가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDrawer, {
                ...defaultOptions,
                props: {
                    ...defaultOptions.props,
                    modelValue: true,
                    position: 'absolute',
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.position).toBe('absolute');
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
                provide(LAYOUT_PROVIDED_KEY, true);
                return {};
            },
            template: '<div><slot /></div>',
        });

        const layoutStubs = {
            'vs-focus-trap': {
                template: '<div class="vs-focus-trap-stub"><slot /></div>',
                methods: { focus: vi.fn(), blur: vi.fn() },
            },
            'vs-inner-scroll': {
                template:
                    '<div class="vs-inner-scroll-stub"><slot name="header" /><slot /><slot name="footer" /></div>',
            },
            Transition: { template: '<div><slot /></div>' },
        };

        it('layout prop이 true일 때 layoutStore.setDrawer가 호출되어야 한다', () => {
            // given
            const setDrawerSpy = vi.spyOn(layoutStore, 'setDrawer');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () =>
                        h(VsDrawer, {
                            layout: true,
                            modelValue: true,
                            placement: 'left',
                            size: 'md',
                            pushContainer: true,
                        }),
                },
                global: { stubs: layoutStubs },
            });

            // then
            expect(setDrawerSpy).toHaveBeenCalledWith({
                isOpen: true,
                placement: 'left',
                size: '40%',
                pushContainer: true,
                resizing: false,
            });
        });

        it("pushContainer가 'responsive'이면 그 값 그대로 layoutStore에 전달되어야 한다", () => {
            // given
            const setDrawerSpy = vi.spyOn(layoutStore, 'setDrawer');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () =>
                        h(VsDrawer, {
                            layout: true,
                            modelValue: true,
                            placement: 'left',
                            size: 'md',
                            pushContainer: 'responsive',
                        }),
                },
                global: { stubs: layoutStubs },
            });

            // then
            expect(setDrawerSpy).toHaveBeenCalledWith(expect.objectContaining({ pushContainer: 'responsive' }));
        });

        it('layout prop이 없으면 setDrawer가 호출되지 않아야 한다', () => {
            // given
            const setDrawerSpy = vi.spyOn(layoutStore, 'setDrawer');

            // when
            mount(MockVsLayout, {
                slots: {
                    default: () =>
                        h(VsDrawer, { modelValue: true, placement: 'left', size: 'md', pushContainer: true }),
                },
                global: { stubs: layoutStubs },
            });

            // then
            expect(setDrawerSpy).not.toHaveBeenCalled();
        });
    });

    describe('layoutStyles', () => {
        const MockVsLayout = defineComponent({
            name: VsComponent.VsLayout,
            setup() {
                provide(LAYOUT_STORE_KEY, layoutStore);
                provide(LAYOUT_PROVIDED_KEY, true);
                return {};
            },
            template: '<div><slot /></div>',
        });

        const layoutStubs = {
            'vs-focus-trap': {
                template: '<div class="vs-focus-trap-stub"><slot /></div>',
                methods: { focus: vi.fn(), blur: vi.fn() },
            },
            'vs-inner-scroll': {
                template:
                    '<div class="vs-inner-scroll-stub"><slot name="header" /><slot /><slot name="footer" /></div>',
            },
            Transition: { template: '<div><slot /></div>' },
        };

        it('placement가 left이고 header가 fixed이면 paddingTop이 적용되어야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'fixed', height: '3rem' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: () => h(VsDrawer, { layout: true, modelValue: true, placement: 'left' }),
                },
                global: { stubs: layoutStubs },
            });

            // then
            const drawerVm = wrapper.findComponent(VsDrawer).vm as any;
            expect(drawerVm.layoutStyles.paddingTop).toBe('3rem');
        });

        it('placement가 right이고 footer가 fixed이면 paddingBottom이 적용되어야 한다', () => {
            // given
            layoutStore.setFooter({ position: 'fixed', height: '3rem' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: () => h(VsDrawer, { layout: true, modelValue: true, placement: 'right' }),
                },
                global: { stubs: layoutStubs },
            });

            // then
            const drawerVm = wrapper.findComponent(VsDrawer).vm as any;
            expect(drawerVm.layoutStyles.paddingBottom).toBe('3rem');
        });

        it('placement가 top이고 header가 fixed이면 top offset이 적용되어야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'fixed', height: '3rem' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: () => h(VsDrawer, { layout: true, modelValue: true, placement: 'top' }),
                },
                global: { stubs: layoutStubs },
            });

            // then
            const drawerVm = wrapper.findComponent(VsDrawer).vm as any;
            expect(drawerVm.layoutStyles.top).toBe('3rem');
        });

        it('placement가 top이고 header가 sticky이면 top offset이 적용되어야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'sticky', height: '3rem' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: () => h(VsDrawer, { layout: true, modelValue: true, placement: 'top' }),
                },
                global: { stubs: layoutStubs },
            });

            // then
            const drawerVm = wrapper.findComponent(VsDrawer).vm as any;
            expect(drawerVm.layoutStyles.top).toBe('3rem');
        });

        it('placement가 bottom이고 footer가 fixed이면 bottom offset이 적용되어야 한다', () => {
            // given
            layoutStore.setFooter({ position: 'fixed', height: '3rem' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: () => h(VsDrawer, { layout: true, modelValue: true, placement: 'bottom' }),
                },
                global: { stubs: layoutStubs },
            });

            // then
            const drawerVm = wrapper.findComponent(VsDrawer).vm as any;
            expect(drawerVm.layoutStyles.bottom).toBe('3rem');
        });

        it('placement가 bottom이고 footer가 sticky이면 bottom offset이 적용되어야 한다', () => {
            // given
            layoutStore.setFooter({ position: 'sticky', height: '3rem' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: () => h(VsDrawer, { layout: true, modelValue: true, placement: 'bottom' }),
                },
                global: { stubs: layoutStubs },
            });

            // then
            const drawerVm = wrapper.findComponent(VsDrawer).vm as any;
            expect(drawerVm.layoutStyles.bottom).toBe('3rem');
        });

        it('header position이 relative이면 padding이 적용되지 않아야 한다', () => {
            // given
            layoutStore.setHeader({ position: 'relative', height: '3rem' });

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: () => h(VsDrawer, { layout: true, modelValue: true, placement: 'left' }),
                },
                global: { stubs: layoutStubs },
            });

            // then
            const drawerVm = wrapper.findComponent(VsDrawer).vm as any;
            expect(drawerVm.layoutStyles.paddingTop).toBeUndefined();
        });
    });
});
