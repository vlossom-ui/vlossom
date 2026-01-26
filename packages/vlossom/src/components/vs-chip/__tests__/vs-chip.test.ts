import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsChip from './../VsChip.vue';

describe('VsChip', () => {
    describe('props', () => {
        it('closable prop이 true이면 close 버튼이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsChip, {
                props: {
                    closable: true,
                },
            });

            // then
            const closeButton = wrapper.find('.vs-chip-close-button');
            expect(closeButton.exists()).toBe(true);
        });

        it('size prop이 주어지면 해당 size 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsChip, {
                props: {
                    size: 'xs',
                },
            });

            // then
            expect(wrapper.vm.classObj['vs-xs']).toBe(true);
        });

        it('primary prop이 true이면 vs-primary 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsChip, {
                props: {
                    primary: true,
                },
            });

            // then
            expect(wrapper.vm.classObj['vs-primary']).toBe(true);
        });

        it('colorScheme이 주어지면 해당 colorScheme 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsChip, {
                props: {
                    colorScheme: 'green',
                },
            });

            // then
            expect(wrapper.vm.colorSchemeClass).toBe('vs-color-scheme-green');
        });

        it('styleSet 객체가 주어지면 CSS 변수와 컴포넌트 스타일이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsChip, {
                props: {
                    styleSet: {
                        variables: {
                            height: '50px',
                        },
                        component: {
                            backgroundColor: '#ff0000',
                            width: '200px',
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-chip-height': '50px',
            });
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                backgroundColor: '#ff0000',
                width: '200px',
            });
        });
    });

    describe('events', () => {
        it('close 버튼을 클릭하면 close 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsChip, {
                props: {
                    closable: true,
                },
            });

            // when
            const closeButton = wrapper.find('.vs-chip-close-button');
            await closeButton.trigger('click');

            // then
            expect(wrapper.emitted('close')).toBeTruthy();
            expect(wrapper.emitted('close')).toHaveLength(1);
        });
    });

    describe('styleSet 하위 속성 전달', () => {
        it('icon styleSet이 적용되어야 한다', () => {
            // given
            const iconStyle = {
                marginRight: '0.5rem',
                color: '#2196f3',
            };

            // when
            const wrapper = mount(VsChip, {
                props: {
                    styleSet: {
                        icon: iconStyle,
                    },
                },
                slots: {
                    icon: '<span>icon</span>',
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.icon).toEqual(iconStyle);
        });

        it('closeButton styleSet이 적용되어야 한다', () => {
            // given
            const closeButtonStyle = {
                marginLeft: '0.5rem',
                color: '#f44336',
            };

            // when
            const wrapper = mount(VsChip, {
                props: {
                    closable: true,
                    styleSet: {
                        closeButton: closeButtonStyle,
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.closeButton).toEqual(closeButtonStyle);
        });

        it('모든 styleSet 하위 속성이 함께 전달되어야 한다', () => {
            // given
            const fullStyleSet = {
                variables: {
                    height: '2rem',
                },
                component: {
                    backgroundColor: '#e3f2fd',
                    borderRadius: '16px',
                },
                icon: {
                    marginRight: '0.5rem',
                },
                closeButton: {
                    marginLeft: '0.5rem',
                },
            };

            // when
            const wrapper = mount(VsChip, {
                props: {
                    closable: true,
                    styleSet: fullStyleSet,
                },
                slots: {
                    icon: '<span>icon</span>',
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables['--vs-chip-height']).toBe('2rem');
            expect(wrapper.vm.componentStyleSet.component).toEqual(fullStyleSet.component);
            expect(wrapper.vm.componentStyleSet.icon).toEqual(fullStyleSet.icon);
            expect(wrapper.vm.componentStyleSet.closeButton).toEqual(fullStyleSet.closeButton);
        });
    });
});
