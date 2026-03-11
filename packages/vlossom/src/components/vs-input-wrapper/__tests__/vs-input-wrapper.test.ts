import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VsInputWrapper from '../VsInputWrapper.vue';

describe('VsInputWrapper', () => {
    describe('기본 props', () => {
        it('required prop이 true이면 필수 표시 별표가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                props: {
                    label: 'some label',
                    required: true,
                },
            });

            // then
            const requiredStar = wrapper.find('.vs-required-star');
            expect(requiredStar.exists()).toBe(true);
            expect(requiredStar.text()).toBe('*');
            expect(requiredStar.classes()).toContain('vs-cs-red');
        });

        it('disabled prop이 true이면 라벨, 필수 표시, 메시지 영역에 disabled 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                props: {
                    label: 'some label',
                    required: true,
                    disabled: true,
                    messages: [{ state: 'error', text: '에러 메시지' }],
                },
            });

            // then
            const label = wrapper.find('.vs-label');
            const messages = wrapper.find('.vs-messages');

            expect(label.classes()).toContain('vs-disabled');
            expect(messages.classes()).toContain('vs-disabled');
        });

        it('noMessages prop이 true이고 messages 슬롯이 없으면 메시지 영역이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                props: {
                    messages: [{ state: 'error', text: '에러 메시지' }],
                    noMessages: true,
                },
            });

            // then
            const messages = wrapper.find('.vs-messages');
            expect(messages.exists()).toBe(false);
        });
    });

    describe('label', () => {
        it('label prop이 주어지면 라벨이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                props: {
                    label: 'some label',
                },
            });

            // then
            const label = wrapper.find('.vs-label span');
            expect(label.exists()).toBe(true);
            expect(label.text()).toBe('some label');
        });

        it('label prop이 없으면 라벨 영역이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {});

            // then
            const label = wrapper.find('.vs-label');
            expect(label.exists()).toBe(false);
        });

        it('label slot이 있으면 라벨 영역이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                slots: {
                    label: '<span class="custom-label">커스텀 라벨</span>',
                },
            });

            // then
            const label = wrapper.find('.vs-label');
            expect(label.exists()).toBe(true);
            expect(label.html()).toContain('커스텀 라벨');
        });

        it('noLabel prop이 true이면 label이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                props: {
                    label: 'some label',
                    noLabel: true,
                },
            });

            // then
            const label = wrapper.find('.vs-label');
            expect(label.exists()).toBe(false);
        });

        it('noLabel prop이 true이면 label 슬롯이 있어도 라벨 영역이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                props: {
                    noLabel: true,
                },
                slots: {
                    label: '<span class="custom-label">커스텀 라벨</span>',
                },
            });

            // then
            const label = wrapper.find('.vs-label');
            expect(label.exists()).toBe(false);
        });
    });

    describe('groupLabel', () => {
        it('groupLabel이 false이면 div 구조로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                props: {
                    label: 'some label',
                    groupLabel: false,
                },
            });

            // then
            const fieldset = wrapper.find('fieldset');
            const div = wrapper.find('div');
            const legend = wrapper.find('legend');
            const labelDiv = wrapper.find('.vs-label');

            expect(fieldset.exists()).toBe(false);
            expect(div.exists()).toBe(true);
            expect(legend.exists()).toBe(false);
            expect(labelDiv.exists()).toBe(true);
        });

        it('groupLabel이 true이면 fieldset/legend 구조로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                props: {
                    label: '개인정보',
                    groupLabel: true,
                },
            });

            // then
            const fieldset = wrapper.find('fieldset');
            const legend = wrapper.find('legend');

            expect(fieldset.exists()).toBe(true);
            expect(legend.exists()).toBe(true);
            expect(legend.classes()).toContain('vs-label');
        });
    });

    describe('메시지 기능', () => {
        it('messages 배열이 비어있으면 메시지 영역이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                props: {
                    messages: [],
                },
            });

            // then
            const messages = wrapper.find('.vs-messages');
            expect(messages.exists()).toBe(false);
        });

        it('messages 배열에 메시지가 있으면 메시지 영역이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInputWrapper, {
                props: {
                    messages: [
                        { state: 'error', text: '에러 메시지' },
                        { state: 'success', text: '성공 메시지' },
                    ],
                },
            });

            // then
            const messages = wrapper.find('.vs-messages');
            expect(messages.exists()).toBe(true);

            const messageComponents = wrapper.findAllComponents({ name: 'VsMessage' });
            expect(messageComponents).toHaveLength(2);
        });
    });

    describe('shake 애니메이션', () => {
        it('shake prop이 true로 변경되면 shake-horizontal 클래스가 적용되어야 한다', async () => {
            // given
            const wrapper = mount(VsInputWrapper, {
                props: {
                    shake: false,
                },
            });

            // when
            await wrapper.setProps({ shake: true });
            await wrapper.vm.$nextTick();

            // then
            const inputWrapper = wrapper.find('.vs-input-wrapper');
            expect(inputWrapper.classes()).toContain('shake-horizontal');
        });

        it('shake 애니메이션이 600ms 후에 자동으로 해제되어야 한다', async () => {
            // given
            vi.useFakeTimers();
            const wrapper = mount(VsInputWrapper, {
                props: {
                    shake: false,
                },
            });

            // when
            await wrapper.setProps({ shake: true });
            await wrapper.vm.$nextTick();

            const inputWrapper = wrapper.find('.vs-input-wrapper');
            expect(inputWrapper.classes()).toContain('shake-horizontal');

            // 600ms 후
            vi.advanceTimersByTime(600);
            await wrapper.vm.$nextTick();

            // then
            expect(inputWrapper.classes()).not.toContain('shake-horizontal');

            vi.useRealTimers();
        });
    });
});
