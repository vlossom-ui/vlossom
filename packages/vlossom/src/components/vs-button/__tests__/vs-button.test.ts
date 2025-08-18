import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsButton from './../VsButton.vue';

describe('VsButton', () => {
    describe('props', () => {
        it('type prop이 주어지면 해당 type 속성이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    type: 'submit',
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.attributes('type')).toBe('submit');
        });

        it('disabled prop이 true이면 disabled 속성과 vs-disabled 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    disabled: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.attributes('disabled')).toBeDefined();
            expect(button.classes()).toContain('vs-disabled');
        });

        it('loading prop이 true이면 loading 관련 요소들이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    loading: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.classes()).toContain('vs-loading');
            expect(wrapper.find('.vs-button-loading').exists()).toBe(true);
            expect(wrapper.find('.vs-button-content').exists()).toBe(true);
        });

        it('circle prop이 true이면 vs-circle 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    circle: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.classes()).toContain('vs-circle');
        });

        it('ghost prop이 true이면 vs-ghost 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    ghost: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.classes()).toContain('vs-ghost');
        });

        it('large prop이 true이면 vs-large 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    large: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.classes()).toContain('vs-large');
        });

        it('outline prop이 true이면 vs-outline 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    outline: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.classes()).toContain('vs-outline');
        });

        it('primary prop이 true이면 vs-primary 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    primary: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.classes()).toContain('vs-primary');
        });

        it('responsive prop이 true이면 vs-responsive 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    responsive: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.classes()).toContain('vs-responsive');
        });

        it('small prop이 true이면 vs-small 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    small: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.classes()).toContain('vs-small');
        });

        it('colorScheme이 주어지면 해당 colorScheme 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    colorScheme: 'green',
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.classes()).toContain('vs-color-scheme-green');
        });

        it('styleSet 객체가 주어지면 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    styleSet: {
                        backgroundColor: '#ff0000',
                        width: '200px',
                        height: '50px',
                    },
                },
            });

            // then
            const button = wrapper.find('button');
            const style = button.attributes('style');
            expect(style).toContain('--vs-button-backgroundColor: #ff0000');
            expect(style).toContain('--vs-button-width: 200px');
            expect(style).toContain('--vs-button-height: 50px');
        });

        it('styleSet에 loading 스타일이 주어지면 loading 컴포넌트에 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    loading: true,
                    styleSet: {
                        loading: {
                            color: '#ffffff',
                            barWidth: '10px',
                        },
                    },
                },
            });

            // then
            const loadingComponent = wrapper.findComponent({ name: 'VsLoading' });
            expect(loadingComponent.props('styleSet')).toEqual({ color: '#ffffff', barWidth: '10px' });
        });
    });

    describe('tabindex', () => {
        it('정상 상태일 때 tabindex가 0이어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton);

            // then
            const button = wrapper.find('button');
            expect(button.attributes('tabindex')).toBe('0');
        });

        it('disabled 상태일 때 tabindex가 -1이어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    disabled: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.attributes('tabindex')).toBe('-1');
        });

        it('loading 상태일 때 tabindex가 -1이어야 한다', () => {
            // given, when
            const wrapper = mount(VsButton, {
                props: {
                    loading: true,
                },
            });

            // then
            const button = wrapper.find('button');
            expect(button.attributes('tabindex')).toBe('-1');
        });
    });
});
