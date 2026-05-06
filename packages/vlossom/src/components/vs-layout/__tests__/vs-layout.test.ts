import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, inject } from 'vue';
import VsLayout from './../VsLayout.vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_PROVIDED_KEY, LAYOUT_STORE_KEY } from '@/declaration';

describe('VsLayout', () => {
    let layoutStore: LayoutStore;

    beforeEach(() => {
        layoutStore = new LayoutStore();

        vi.spyOn(LayoutStore, 'getDefaultLayoutStore').mockImplementation(() => layoutStore);
    });

    describe('LayoutStore 제공', () => {
        it('LAYOUT_STORE_KEY로 LayoutStore 인스턴스를 제공해야 한다', () => {
            // given
            const ChildComponent = defineComponent({
                name: 'TestChild',
                setup() {
                    const injectedLayoutStore = inject(LAYOUT_STORE_KEY);
                    return { injectedLayoutStore };
                },
                template: '<div>test</div>',
            });

            // when
            const wrapper = mount(VsLayout, {
                slots: {
                    default: ChildComponent,
                },
            });

            const childWrapper = wrapper.findComponent(ChildComponent);

            // then
            expect(childWrapper.vm.injectedLayoutStore).toBeDefined();
            expect(childWrapper.vm.injectedLayoutStore).toBe(layoutStore);
            expect(childWrapper.vm.injectedLayoutStore).toBeInstanceOf(LayoutStore);
        });
    });

    describe('LAYOUT_PROVIDED 마커 제공', () => {
        it('LAYOUT_PROVIDED_KEY로 true를 provide해야 한다', () => {
            // given
            const ChildComponent = defineComponent({
                name: 'TestChild',
                setup() {
                    const injectedFlag = inject<boolean>(LAYOUT_PROVIDED_KEY, false);
                    return { injectedFlag };
                },
                template: '<div>test</div>',
            });

            // when
            const wrapper = mount(VsLayout, {
                slots: {
                    default: ChildComponent,
                },
            });

            const childWrapper = wrapper.findComponent(ChildComponent);

            // then
            expect(childWrapper.vm.injectedFlag).toBe(true);
        });
    });
});
