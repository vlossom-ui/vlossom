import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import VsAccordion from './../VsAccordion.vue';

describe('VsAccordion', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = null;
    });

    describe('기본 렌더링', () => {
        it('vs-responsive와 details 요소로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                slots: {
                    title: '아코디언 제목',
                    default: '아코디언 내용',
                },
            });

            // then
            expect(wrapper.find('.vs-accordion').exists()).toBe(true);
            expect(wrapper.find('details').exists()).toBe(true);
            expect(wrapper.find('summary').exists()).toBe(true);
            expect(wrapper.find('.vs-accordion-content').exists()).toBe(true);
        });

        it('title 슬롯과 default 슬롯이 올바르게 렌더링되어야 한다', () => {
            // given
            const titleText = '테스트 아코디언 제목';
            const contentText = '테스트 아코디언 내용';

            // when
            wrapper = mount(VsAccordion, {
                slots: {
                    title: titleText,
                    default: contentText,
                },
            });

            // then
            expect(wrapper.find('.vs-accordion-summary').text()).toBe(titleText);
            expect(wrapper.find('.vs-accordion-content').text()).toBe(contentText);
        });
    });

    describe('open prop', () => {
        it('open prop이 true일 때 아코디언이 열린 상태로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                props: {
                    open: true,
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // then
            expect(wrapper.vm.isOpen).toBe(true);
            expect(wrapper.find('details').attributes('open')).toBeDefined();
        });

        it('open prop이 false일 때 아코디언이 닫힌 상태로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                props: {
                    open: false,
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // then
            expect(wrapper.vm.isOpen).toBe(false);
            expect(wrapper.find('details').attributes('open')).toBeUndefined();
        });
    });

    describe('modelValue prop (v-model)', () => {
        it('modelValue가 true일 때 아코디언이 열린 상태로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                props: {
                    modelValue: true,
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // then
            expect(wrapper.vm.isOpen).toBe(true);
            expect(wrapper.find('details').attributes('open')).toBeDefined();
        });

        it('modelValue가 false일 때 아코디언이 닫힌 상태로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                props: {
                    modelValue: false,
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // then
            expect(wrapper.vm.isOpen).toBe(false);
            expect(wrapper.find('details').attributes('open')).toBeUndefined();
        });

        it('modelValue가 변경되면 아코디언 상태가 업데이트되어야 한다', async () => {
            // given
            wrapper = mount(VsAccordion, {
                props: {
                    modelValue: false,
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // when
            await wrapper.setProps({ modelValue: true });

            // then
            expect(wrapper.vm.isOpen).toBe(true);
            expect(wrapper.find('details').attributes('open')).toBeDefined();
        });
    });

    describe('toggle 이벤트', () => {
        it('아코디언을 클릭하면 toggle 이벤트가 발생해야 한다', async () => {
            // given
            wrapper = mount(VsAccordion, {
                props: {
                    modelValue: false,
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // when
            await wrapper.find('details').trigger('toggle');

            // then
            const emitted = wrapper.emitted();
            expect(emitted).toHaveProperty('update:modelValue');
            expect(emitted).toHaveProperty('toggle');
        });

        it('아코디언 상태가 변경되면 update:modelValue 이벤트를 올바른 값으로 emit해야 한다', async () => {
            // given
            wrapper = mount(VsAccordion, {
                props: {
                    modelValue: false,
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            const detailsElement = wrapper.find('details').element as HTMLDetailsElement;
            detailsElement.open = true;

            // when
            await wrapper.find('details').trigger('toggle');

            // then
            const emitted = wrapper.emitted('update:modelValue');
            expect(emitted).toHaveLength(1);
            expect(emitted[0]).toEqual([true]);
        });

        it('아코디언 상태가 변경되면 toggle 이벤트를 올바른 값으로 emit해야 한다', async () => {
            // given
            wrapper = mount(VsAccordion, {
                props: {
                    modelValue: false,
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            const detailsElement = wrapper.find('details').element as HTMLDetailsElement;
            detailsElement.open = true;

            // when
            await wrapper.find('details').trigger('toggle');

            // then
            const emitted = wrapper.emitted('toggle');
            expect(emitted).toHaveLength(1);
            expect(emitted[0]).toEqual([true]);
        });
    });

    describe('colorScheme prop', () => {
        it('colorScheme prop이 주어지면 해당 클래스가 적용되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                props: {
                    colorScheme: 'blue',
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // then
            expect(wrapper.find('.vs-accordion-details').classes()).toContain('vs-color-scheme-blue');
        });

        it('다양한 colorScheme이 올바르게 적용되어야 한다', () => {
            const colorSchemes = ['red', 'blue', 'green', 'purple', 'orange'] as const;

            colorSchemes.forEach((scheme) => {
                // given, when
                wrapper = mount(VsAccordion, {
                    props: {
                        colorScheme: scheme,
                    },
                    slots: {
                        title: '제목',
                        default: '내용',
                    },
                });

                // then
                expect(wrapper.find('.vs-accordion-details').classes()).toContain(`vs-color-scheme-${scheme}`);
            });
        });
    });

    describe('styleSet prop', () => {
        it('styleSet prop이 주어지면 스타일이 적용되어야 한다', () => {
            // given
            const testStyleSet = {
                backgroundColor: '#ff0000',
                border: '2px solid #ff0000',
            };

            // when
            wrapper = mount(VsAccordion, {
                props: {
                    styleSet: testStyleSet,
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet).toEqual(testStyleSet);
        });
    });

    describe('responsive props', () => {
        it('width prop이 주어지면 vs-responsive 컴포넌트에 전달되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                props: {
                    width: '300px',
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // then
            const responsiveComponent = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsiveComponent.props('width')).toBe('300px');
        });

        it('grid prop이 주어지면 vs-responsive 컴포넌트에 전달되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                props: {
                    grid: { md: 6, lg: 4 },
                },
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // then
            const responsiveComponent = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsiveComponent.props('grid')).toEqual({ md: 6, lg: 4 });
        });
    });
});
