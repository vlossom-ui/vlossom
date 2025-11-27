import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VsTabs from './../VsTabs.vue';

describe('VsTabs', () => {
    beforeEach(() => {
        // Mock scrollIntoView and focus
        Element.prototype.scrollIntoView = () => {};
        HTMLElement.prototype.focus = () => {};
    });

    describe('props', () => {
        it('tabs prop이 주어지지 않으면 빈 배열이 기본값으로 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {},
            });

            // then
            const tabItems = wrapper.findAll('.vs-tab-item');
            expect(tabItems).toHaveLength(0);
        });

        it('tabs prop이 주어지면 해당 개수만큼 탭 아이템이 렌더링되어야 한다', () => {
            // given
            const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];

            // when
            const wrapper = mount(VsTabs, {
                props: { tabs },
            });

            // then
            const tabItems = wrapper.findAll('.vs-tab-item');
            expect(tabItems).toHaveLength(3);
            expect(tabItems[0].text()).toBe('Tab 1');
            expect(tabItems[1].text()).toBe('Tab 2');
            expect(tabItems[2].text()).toBe('Tab 3');
        });

        it('modelValue prop이 주어지면 해당 인덱스의 탭이 선택되어야 한다', async () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    modelValue: 1,
                },
            });

            await nextTick();

            // then
            const tabItems = wrapper.findAll('.vs-tab-item');
            expect(tabItems[1].classes()).toContain('vs-selected');
        });

        it('vertical prop이 true이면 vs-vertical 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    vertical: true,
                },
            });

            // then
            expect(wrapper.find('.vs-tabs').classes()).toContain('vs-vertical');
        });

        it('dense prop이 true이면 vs-dense 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    dense: true,
                },
            });

            // then
            expect(wrapper.find('.vs-tabs').classes()).toContain('vs-dense');
        });

        it('primary prop이 true이면 vs-primary 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    primary: true,
                },
            });

            // then
            expect(wrapper.find('.vs-tabs').classes()).toContain('vs-primary');
        });

        it('disabled prop에 true가 주어지면 모든 탭에 vs-disabled 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    disabled: true,
                },
            });

            // then
            const tabItems = wrapper.findAll('.vs-tab-item');
            expect(tabItems[0].classes()).toContain('vs-disabled');
            expect(tabItems[1].classes()).toContain('vs-disabled');
            expect(tabItems[2].classes()).toContain('vs-disabled');
        });

        it('disabled prop에 false가 주어지면 모든 탭에 vs-disabled 클래스가 적용되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    disabled: false,
                },
            });

            // then
            const tabItems = wrapper.findAll('.vs-tab-item');
            expect(tabItems[0].classes()).not.toContain('vs-disabled');
            expect(tabItems[1].classes()).not.toContain('vs-disabled');
            expect(tabItems[2].classes()).not.toContain('vs-disabled');
        });

        it('disabled prop에 함수가 주어지면 해당 인덱스의 탭에 vs-disabled 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'],
                    disabled: (tab: string, index: number) => [1, 3].includes(index),
                },
            });

            // then
            const tabItems = wrapper.findAll('.vs-tab-item');
            expect(tabItems[0].classes()).not.toContain('vs-disabled');
            expect(tabItems[1].classes()).toContain('vs-disabled');
            expect(tabItems[2].classes()).not.toContain('vs-disabled');
            expect(tabItems[3].classes()).toContain('vs-disabled');
        });

        it('scrollButtons prop이 show이면 스크롤 버튼이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    scrollButtons: 'show',
                },
            });

            // then
            const scrollButtons = wrapper.findAll('.vs-tab-scroll-button');
            expect(scrollButtons).toHaveLength(2);
        });

        it('scrollButtons prop이 hide이면 스크롤 버튼이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    scrollButtons: 'hide',
                },
            });

            // then
            const scrollButtons = wrapper.findAll('.vs-tab-scroll-button');
            expect(scrollButtons).toHaveLength(0);
        });

        it('scrollButtons prop이 auto이면 필요시에만 스크롤 버튼이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    scrollButtons: 'auto',
                },
            });

            // then
            const scrollButtons = wrapper.findAll('.vs-tab-scroll-button');
            expect([0, 2]).toContain(scrollButtons.length);
        });
    });

    describe('events', () => {
        it('탭을 클릭하면 update:modelValue 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                },
            });

            // when
            const tabItems = wrapper.findAll('.vs-tab-item');
            await tabItems[1].trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
        });

        it('탭을 클릭하면 change 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                },
            });

            // when
            const tabItems = wrapper.findAll('.vs-tab-item');
            await tabItems[2].trigger('click');

            // then
            expect(wrapper.emitted('change')).toBeTruthy();
            expect(wrapper.emitted('change')?.[0]).toEqual([2]);
        });

        it('비활성화된 탭(함수)을 클릭하면 이벤트가 발생하지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    disabled: (tab: string, index: number) => index === 1,
                },
            });

            // when
            const tabItems = wrapper.findAll('.vs-tab-item');
            await tabItems[1].trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeFalsy();
            expect(wrapper.emitted('change')).toBeFalsy();
        });

        it('전체 비활성화(true)된 탭을 클릭하면 이벤트가 발생하지 않아야 한다', async () => {
            // given
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    disabled: true,
                },
            });

            // when
            const tabItems = wrapper.findAll('.vs-tab-item');
            await tabItems[0].trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeFalsy();
            expect(wrapper.emitted('change')).toBeFalsy();
        });
    });

    describe('aria attributes', () => {
        it('선택된 탭은 aria-selected가 true여야 한다', async () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    modelValue: 1,
                },
            });

            await nextTick();

            // then
            const tabItems = wrapper.findAll('.vs-tab-item');
            expect(tabItems[0].attributes('aria-selected')).toBe('false');
            expect(tabItems[1].attributes('aria-selected')).toBe('true');
            expect(tabItems[2].attributes('aria-selected')).toBe('false');
        });

        it('비활성화된 탭(함수)은 aria-disabled가 true여야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    disabled: (tab: string, index: number) => index === 1,
                },
            });

            // then
            const tabItems = wrapper.findAll('.vs-tab-item');
            expect(tabItems[0].attributes('aria-disabled')).toBe('false');
            expect(tabItems[1].attributes('aria-disabled')).toBe('true');
            expect(tabItems[2].attributes('aria-disabled')).toBe('false');
        });

        it('전체 비활성화(true)된 탭은 모두 aria-disabled가 true여야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    disabled: true,
                },
            });

            // then
            const tabItems = wrapper.findAll('.vs-tab-item');
            expect(tabItems[0].attributes('aria-disabled')).toBe('true');
            expect(tabItems[1].attributes('aria-disabled')).toBe('true');
            expect(tabItems[2].attributes('aria-disabled')).toBe('true');
        });

        it('선택된 탭은 tabindex가 0이고 나머지는 -1이어야 한다', async () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                    modelValue: 1,
                },
            });

            await nextTick();

            // then
            const tabItems = wrapper.findAll('.vs-tab-item');
            expect(tabItems[0].attributes('tabindex')).toBe('-1');
            expect(tabItems[1].attributes('tabindex')).toBe('0');
            expect(tabItems[2].attributes('tabindex')).toBe('-1');
        });
    });

    describe('slot', () => {
        it('tab slot이 주어지면 커스텀 콘텐츠가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTabs, {
                props: {
                    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
                },
                slots: {
                    tab: '<span class="custom-tab">{{ tab }} - {{ index }}</span>',
                },
            });

            // then
            const customTabs = wrapper.findAll('.custom-tab');
            expect(customTabs).toHaveLength(3);
        });
    });
});
