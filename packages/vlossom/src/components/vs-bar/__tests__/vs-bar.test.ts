import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsBar from './../VsBar.vue';

describe('VsBar', () => {
    describe('props', () => {
        it('primary prop이 true이면 vs-primary 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBar, {
                props: {
                    primary: true,
                },
            });

            // then
            expect(wrapper.classes()).toContain('vs-primary');
        });

        it('position prop이 absolute로 설정되면 해당 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBar, {
                props: {
                    position: 'absolute',
                },
            });

            // then
            const style = wrapper.attributes('style');
            expect(style).toContain('--vs-bar-position: absolute');
        });

        it('styleSet 객체가 주어지면 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBar, {
                props: {
                    styleSet: {
                        backgroundColor: '#ff0000',
                        height: '60px',
                        padding: '0 1rem',
                        zIndex: '1000',
                    },
                },
            });

            // then
            const style = wrapper.attributes('style');
            expect(style).toContain('--vs-bar-backgroundColor: #ff0000');
            expect(style).toContain('--vs-bar-height: 60px');
            expect(style).toContain('--vs-bar-padding: 0 1rem');
            expect(style).toContain('--vs-bar-zIndex: 1000');
        });
    });
});
