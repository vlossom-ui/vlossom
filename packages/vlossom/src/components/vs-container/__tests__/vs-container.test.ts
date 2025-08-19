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
        layoutStore = LayoutStore.getDefaultLayout();
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
            const container = wrapper.find('.vs-container');
            const style = container.attributes('style');
            expect(style).toBeUndefined();
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
            layoutStore.header.value = { position: 'fixed', height: '70px' };
            layoutStore.footer.value = { position: 'absolute', height: '90px' };

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            const style = container.attributes('style');
            expect(style).toContain('padding-top: 70px');
            expect(style).toContain('padding-bottom: 90px');
        });

        it('header와 footer position이 relative일 때 패딩이 적용되지 않아야 한다', () => {
            // given
            layoutStore.header = { position: 'relative', height: '60px' };
            layoutStore.footer = { position: 'relative', height: '80px' };

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            const style = container.attributes('style');
            expect(style).toBeUndefined();
        });

        it('header와 footer position이 static일 때 패딩이 적용되지 않아야 한다', () => {
            // given
            layoutStore.header = { position: 'static', height: '60px' };
            layoutStore.footer = { position: 'static', height: '80px' };

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            const style = container.attributes('style');
            expect(style).toBeUndefined();
        });

        it('header와 footer position이 sticky일 때 패딩이 적용되지 않아야 한다', () => {
            // given
            layoutStore.header = { position: 'sticky', height: '60px' };
            layoutStore.footer = { position: 'sticky', height: '80px' };

            // when
            const wrapper = mount(MockVsLayout, {
                slots: {
                    default: VsContainer,
                },
            });

            // then
            const container = wrapper.findComponent(VsContainer);
            const style = container.attributes('style');
            expect(style).toContain('padding-top: 60px');
            expect(style).toContain('padding-bottom: 80px');
        });
    });
});
