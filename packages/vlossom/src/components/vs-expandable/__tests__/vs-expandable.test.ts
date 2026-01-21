import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VsExpandable from './../VsExpandable.vue';

describe('VsExpandable', () => {
    let defaultProps: any;

    beforeEach(() => {
        defaultProps = {
            open: false,
        };
    });

    describe('기본 렌더링', () => {
        it('open이 false일 때 컨텐츠가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsExpandable, {
                props: defaultProps,
                slots: {
                    default: '<div class="test-content">Test Content</div>',
                },
            });

            // then
            expect(wrapper.find('.vs-expandable-wrapper').exists()).toBe(false);
            expect(wrapper.find('.test-content').exists()).toBe(false);
        });

        it('open이 true일 때 컨텐츠가 렌더링되어야 한다', () => {
            // given
            const props = { ...defaultProps, open: true };

            // when
            const wrapper = mount(VsExpandable, {
                props,
                slots: {
                    default: '<div class="test-content">Test Content</div>',
                },
            });

            // then
            expect(wrapper.find('.vs-expandable-wrapper').exists()).toBe(true);
            expect(wrapper.find('.vs-expandable-content').exists()).toBe(true);
            expect(wrapper.find('.test-content').exists()).toBe(true);
            expect(wrapper.find('.test-content').text()).toBe('Test Content');
        });
    });

    describe('styleSet', () => {
        it('styleSet이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsExpandable, {
                props: {
                    open: true,
                    styleSet: {
                        component: {
                            backgroundColor: '#f0f0f0',
                            padding: '2rem',
                            borderRadius: '8px',
                        },
                    },
                },
                slots: {
                    default: '<div class="test-content">Test Content</div>',
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                backgroundColor: '#f0f0f0',
                padding: '2rem',
                borderRadius: '8px',
            });
        });
    });

    describe('open 상태 변경', () => {
        it('open이 false에서 true로 변경되면 컨텐츠가 나타나야 한다', async () => {
            // given
            const wrapper = mount(VsExpandable, {
                props: defaultProps,
                slots: {
                    default: '<div class="test-content">Test Content</div>',
                },
            });

            // 초기 상태 확인
            expect(wrapper.find('.vs-expandable-wrapper').exists()).toBe(false);

            // when
            await wrapper.setProps({ open: true });
            await nextTick();

            // then
            expect(wrapper.find('.vs-expandable-wrapper').exists()).toBe(true);
            expect(wrapper.find('.vs-expandable-content').exists()).toBe(true);
            expect(wrapper.find('.test-content').exists()).toBe(true);
        });

        it('open이 true에서 false로 변경되면 컨텐츠가 사라져야 한다', async () => {
            // given
            const wrapper = mount(VsExpandable, {
                props: { ...defaultProps, open: true },
                slots: {
                    default: '<div class="test-content">Test Content</div>',
                },
            });

            // 초기 상태 확인
            expect(wrapper.find('.vs-expandable-wrapper').exists()).toBe(true);

            // when
            await wrapper.setProps({ open: false });
            await nextTick();

            // then
            expect(wrapper.find('.vs-expandable-wrapper').exists()).toBe(false);
            expect(wrapper.find('.test-content').exists()).toBe(false);
        });
    });
});
