import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import VsAccordion from './../VsAccordion.vue';

describe('VsAccordion', () => {
    let wrapper: any;
    let defaultOptions: any;

    beforeEach(() => {
        wrapper = null;
        defaultOptions = {
            slots: {
                title: '아코디언 제목',
                default: '아코디언 내용',
            },
        };
    });

    describe('기본 렌더링', () => {
        it('vs-accordion과 vs-accordion-title 요소로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, defaultOptions);

            // then
            expect(wrapper.find('.vs-accordion').exists()).toBe(true);
            expect(wrapper.find('.vs-accordion-title').exists()).toBe(true);
            expect(wrapper.findComponent({ name: 'VsExpandable' }).exists()).toBe(true);
        });

        it('기본값으로 닫힌 상태로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, defaultOptions);

            // then
            expect(wrapper.vm.isOpen).toBe(false);
            expect(wrapper.classes()).not.toContain('vs-accordion-open');
        });
    });

    describe('disabled prop', () => {
        function mountWithDisabled(disabled: boolean) {
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { disabled },
            });
        }

        it('disabled가 false일 때 vs-focus-visible 클래스가 적용되어야 한다', () => {
            // given, when
            mountWithDisabled(false);

            // then
            expect(wrapper.classes()).toContain('vs-focus-visible');
            expect(wrapper.classes()).not.toContain('vs-disabled');
            expect(wrapper.attributes('tabindex')).toBe('0');
        });

        it('disabled가 true일 때 vs-disabled 클래스가 적용되고 tabindex가 -1이어야 한다', () => {
            // given, when
            mountWithDisabled(true);

            // then
            expect(wrapper.classes()).toContain('vs-disabled');
            expect(wrapper.classes()).not.toContain('vs-focus-visible');
            expect(wrapper.attributes('tabindex')).toBe('-1');
        });

        it('disabled 상태에서 클릭 이벤트가 무시되어야 한다', async () => {
            // given
            mountWithDisabled(true);
            const initialState = wrapper.vm.isOpen;

            // when
            await wrapper.find('.vs-accordion-title').trigger('click');

            // then
            expect(wrapper.vm.isOpen).toBe(initialState);
            expect(wrapper.emitted()).not.toHaveProperty('toggle');
        });

        it('disabled 상태에서 키보드 이벤트가 무시되어야 한다', async () => {
            // given
            mountWithDisabled(true);
            const initialState = wrapper.vm.isOpen;

            // when
            await wrapper.find('.vs-accordion').trigger('keydown.enter');
            await wrapper.find('.vs-accordion').trigger('keydown.space');

            // then
            expect(wrapper.vm.isOpen).toBe(initialState);
            expect(wrapper.emitted()).not.toHaveProperty('toggle');
        });
    });

    describe('open prop', () => {
        it('open prop이 true일 때 열린 상태로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { open: true },
            });

            // then
            expect(wrapper.vm.isOpen).toBe(true);
            expect(wrapper.classes()).toContain('vs-accordion-open');
        });

        it('open prop이 false일 때 닫힌 상태로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { open: false },
            });

            // then
            expect(wrapper.vm.isOpen).toBe(false);
            expect(wrapper.classes()).not.toContain('vs-accordion-open');
        });
    });

    describe('primary prop', () => {
        it('primary가 true일 때 vs-primary 클래스가 적용되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { primary: true },
            });

            // then
            expect(wrapper.classes()).toContain('vs-primary');
        });

        it('primary가 false일 때 vs-primary 클래스가 적용되지 않아야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { primary: false },
            });

            // then
            expect(wrapper.classes()).not.toContain('vs-primary');
        });
    });

    describe('modelValue prop (v-model)', () => {
        it('modelValue가 true일 때 열린 상태로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { modelValue: true },
            });

            // then
            expect(wrapper.vm.isOpen).toBe(true);
            expect(wrapper.classes()).toContain('vs-accordion-open');
        });

        it('modelValue가 false일 때 닫힌 상태로 렌더링되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { modelValue: false },
            });

            // then
            expect(wrapper.vm.isOpen).toBe(false);
            expect(wrapper.classes()).not.toContain('vs-accordion-open');
        });

        it('modelValue가 변경되면 컴포넌트 상태가 업데이트되어야 한다', async () => {
            // given
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { modelValue: false },
            });

            // when
            await wrapper.setProps({ modelValue: true });

            // then
            expect(wrapper.vm.isOpen).toBe(true);
            expect(wrapper.classes()).toContain('vs-accordion-open');
        });

        it('open과 modelValue가 모두 주어진 경우 modelValue가 우선되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: {
                    open: false,
                    modelValue: true,
                },
            });

            // then
            expect(wrapper.vm.isOpen).toBe(true);
            expect(wrapper.classes()).toContain('vs-accordion-open');
        });
    });

    describe('클릭 인터랙션', () => {
        function setupClickTest(initialValue = false) {
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { modelValue: initialValue },
            });
        }

        it('제목을 클릭하면 아코디언이 토글되어야 한다', async () => {
            // given
            setupClickTest(false);

            // when
            await wrapper.find('.vs-accordion-title').trigger('click');

            // then
            expect(wrapper.vm.isOpen).toBe(true);
            expect(wrapper.classes()).toContain('vs-accordion-open');
        });

        it('클릭 시 update:modelValue 이벤트가 emit되어야 한다', async () => {
            // given
            setupClickTest(false);

            // when
            await wrapper.find('.vs-accordion-title').trigger('click');

            // then
            const emitted = wrapper.emitted('update:modelValue');
            expect(emitted).toBeDefined();
            expect(emitted[0]).toEqual([true]);
        });

        it('클릭 시 toggle 이벤트가 emit되어야 한다', async () => {
            // given
            setupClickTest(false);

            // when
            await wrapper.find('.vs-accordion-title').trigger('click');

            // then
            const emitted = wrapper.emitted('toggle');
            expect(emitted).toBeDefined();
            expect(emitted[0]).toEqual([true]);
        });

        it('연속 클릭 시 상태가 올바르게 토글되어야 한다', async () => {
            // given
            setupClickTest(false);
            const titleElement = wrapper.find('.vs-accordion-title');

            // when & then
            await titleElement.trigger('click');
            expect(wrapper.vm.isOpen).toBe(true);

            await titleElement.trigger('click');
            expect(wrapper.vm.isOpen).toBe(false);

            await titleElement.trigger('click');
            expect(wrapper.vm.isOpen).toBe(true);
        });
    });

    describe('키보드 인터랙션', () => {
        function setupKeyboardTest(initialValue = false) {
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { modelValue: initialValue },
            });
        }

        it('Enter 키를 누르면 아코디언이 토글되어야 한다', async () => {
            // given
            setupKeyboardTest(false);

            // when
            await wrapper.find('.vs-accordion').trigger('keydown.enter');

            // then
            expect(wrapper.vm.isOpen).toBe(true);
            expect(wrapper.classes()).toContain('vs-accordion-open');
        });

        it('Space 키를 누르면 아코디언이 토글되어야 한다', async () => {
            // given
            setupKeyboardTest(false);

            // when
            await wrapper.find('.vs-accordion').trigger('keydown.space');

            // then
            expect(wrapper.vm.isOpen).toBe(true);
            expect(wrapper.classes()).toContain('vs-accordion-open');
        });

        it('Enter 키 입력 시 update:modelValue 이벤트가 emit되어야 한다', async () => {
            // given
            setupKeyboardTest(false);

            // when
            await wrapper.find('.vs-accordion').trigger('keydown.enter');

            // then
            const emitted = wrapper.emitted('update:modelValue');
            expect(emitted).toBeDefined();
            expect(emitted[0]).toEqual([true]);
        });

        it('Space 키 입력 시 toggle 이벤트가 emit되어야 한다', async () => {
            // given
            setupKeyboardTest(true);

            // when
            await wrapper.find('.vs-accordion').trigger('keydown.space');

            // then
            const emitted = wrapper.emitted('toggle');
            expect(emitted).toBeDefined();
            expect(emitted[0]).toEqual([false]);
        });

        it('다른 키 입력 시에는 토글되지 않아야 한다', async () => {
            // given
            setupKeyboardTest(false);
            const initialState = wrapper.vm.isOpen;

            // when
            await wrapper.find('.vs-accordion').trigger('keydown.tab');
            await wrapper.find('.vs-accordion').trigger('keydown.escape');
            await wrapper.find('.vs-accordion').trigger('keydown.arrow-down');

            // then
            expect(wrapper.vm.isOpen).toBe(initialState);
            expect(wrapper.emitted()).not.toHaveProperty('toggle');
        });
    });

    describe('styleSet', () => {
        it('styleSet 객체가 주어지면 스타일이 적용되어야 한다', () => {
            // given, when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: {
                    styleSet: {
                        variables: {
                            arrowColor: '#e91e63',
                            arrowSize: '12px',
                            arrowSpacing: '1.5rem',
                            border: '2px solid #333',
                        },
                        component: {
                            width: '500px',
                            borderRadius: '12px',
                        },
                        title: {
                            backgroundColor: '#f5f5f5',
                            padding: '1rem 1.5rem',
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-accordion-arrowColor': '#e91e63',
                '--vs-accordion-arrowSize': '12px',
                '--vs-accordion-arrowSpacing': '1.5rem',
                '--vs-accordion-border': '2px solid #333',
            });
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                width: '500px',
                borderRadius: '12px',
            });
            expect(wrapper.vm.componentStyleSet.title).toEqual({
                backgroundColor: '#f5f5f5',
                padding: '1rem 1.5rem',
            });
        });
    });

    describe('styleSet 하위 속성 전달', () => {
        it('title styleSet이 vs-accordion-title 요소에 적용되어야 한다', () => {
            // given
            const titleStyleSet = {
                backgroundColor: '#f0f0f0',
                padding: '1rem',
                fontWeight: 'bold',
            };

            // when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: {
                    styleSet: {
                        title: titleStyleSet,
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.title).toEqual(titleStyleSet);
            const titleElement = wrapper.find('.vs-accordion-title');
            expect(titleElement.attributes('style')).toContain('background-color: rgb(240, 240, 240)');
        });

        it('expand styleSet이 vs-expandable 컴포넌트에 전달되어야 한다', () => {
            // given
            const expandStyleSet = {
                component: {
                    backgroundColor: '#fafafa',
                    padding: '1rem',
                },
            };

            // when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: {
                    styleSet: {
                        expand: expandStyleSet,
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.expand).toEqual(expandStyleSet);
            const vsExpandable = wrapper.findComponent({ name: 'VsExpandable' });
            expect(vsExpandable.exists()).toBe(true);
            expect(vsExpandable.props('styleSet')).toEqual(expandStyleSet);
        });

        it('모든 styleSet 하위 속성이 함께 전달되어야 한다', () => {
            // given
            const fullStyleSet = {
                variables: {
                    arrowColor: '#2196f3',
                    border: '1px solid #ccc',
                },
                title: {
                    backgroundColor: '#e3f2fd',
                    padding: '1rem',
                },
                expand: {
                    component: {
                        backgroundColor: '#ffffff',
                        padding: '1.5rem',
                    },
                },
            };

            // when
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: {
                    styleSet: fullStyleSet,
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.title).toEqual(fullStyleSet.title);
            expect(wrapper.vm.componentStyleSet.expand).toEqual(fullStyleSet.expand);
            const vsExpandable = wrapper.findComponent({ name: 'VsExpandable' });
            expect(vsExpandable.props('styleSet')).toEqual(fullStyleSet.expand);
        });
    });

    describe('상태 관리', () => {
        it('isOpen 상태가 변경되면 VsExpandable 컴포넌트에 올바르게 전달되어야 한다', async () => {
            // given
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { modelValue: false },
            });

            // when
            await wrapper.find('.vs-accordion-title').trigger('click');

            // then
            const expandableComponent = wrapper.findComponent({ name: 'VsExpandable' });
            expect(expandableComponent.props('open')).toBe(true);
        });

        it('상태 변경 시 vs-accordion-open 클래스가 올바르게 적용/제거되어야 한다', async () => {
            // given
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { modelValue: false },
            });

            // when & then
            expect(wrapper.classes()).not.toContain('vs-accordion-open');

            await wrapper.find('.vs-accordion-title').trigger('click');
            expect(wrapper.classes()).toContain('vs-accordion-open');

            await wrapper.find('.vs-accordion-title').trigger('click');
            expect(wrapper.classes()).not.toContain('vs-accordion-open');
        });

        it('modelValue prop 변경 시 내부 상태가 즉시 동기화되어야 한다', async () => {
            // given
            wrapper = mount(VsAccordion, {
                ...defaultOptions,
                props: { modelValue: false },
            });

            // when & then
            await wrapper.setProps({ modelValue: true });
            expect(wrapper.vm.isOpen).toBe(true);

            await wrapper.setProps({ modelValue: false });
            expect(wrapper.vm.isOpen).toBe(false);
        });
    });
});
