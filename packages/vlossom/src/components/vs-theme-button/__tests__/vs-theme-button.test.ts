import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import VsThemeButton from '../VsThemeButton.vue';
import { createVlossom } from '@/framework';
import { nextTick } from 'vue';

describe('vs-theme-button', () => {
    beforeEach(() => {
        createVlossom({ components: {}, theme: 'light' });
    });

    describe('테마 모드 전환 상태', () => {
        it('lightMode로 동작할 때 vs-theme-button의 light mode 아이콘이 활성화 되어야 한다', () => {
            // given
            const wrapper = mount(VsThemeButton);

            // then
            expect(wrapper.find('.vs-theme-icon.vs-theme-light').exists()).toBe(true);
            expect(wrapper.find('.vs-theme-icon.vs-theme-light').classes()).toContain('vs-on');
        });

        it('darkMode로 동작할 때 vs-theme-button의 dark mode 아이콘이 활성화 되어야 한다', async () => {
            // given & when
            const wrapper = mount(VsThemeButton);
            wrapper.vm.changeTheme(true);
            await nextTick();

            // then
            expect(wrapper.find('.vs-theme-icon.vs-theme-dark').exists()).toBe(true);
            expect(wrapper.find('.vs-theme-icon.vs-theme-dark').classes()).toContain('vs-on');
        });
    });

    describe('styleSet', () => {
        it('styleSet이 적용되어야 한다', () => {
            const wrapper = mount(VsThemeButton, {
                props: {
                    styleSet: {
                        variables: {
                            width: '3rem',
                            height: '3rem',
                            iconColor: '#ff0000',
                        },
                        component: {
                            backgroundColor: '#f5f5f5',
                            borderRadius: '0.5rem',
                        },
                    },
                },
            });

            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-theme-button-width': '3rem',
                '--vs-theme-button-height': '3rem',
                '--vs-theme-button-iconColor': '#ff0000',
            });
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                backgroundColor: '#f5f5f5',
                borderRadius: '0.5rem',
            });
        });
    });
});
