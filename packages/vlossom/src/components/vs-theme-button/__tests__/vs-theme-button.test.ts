import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import VsThemeButton from './../VsThemeButton.vue';
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

    describe('버튼 prop 전달', () => {
        it('size prop이 하위 버튼의 size 클래스로 전달되어야 한다', () => {
            // given & when
            const wrapper = mount(VsThemeButton, { props: { size: 'lg' } });

            // then
            expect(wrapper.find('.vs-theme-button').classes()).toContain('vs-lg');
        });

        it('ghost prop이 하위 버튼의 ghost 클래스로 전달되어야 한다', () => {
            // given & when
            const wrapper = mount(VsThemeButton, { props: { ghost: true } });

            // then
            expect(wrapper.find('.vs-theme-button').classes()).toContain('vs-ghost');
        });

        it('outline prop이 하위 버튼의 outline 클래스로 전달되어야 한다', () => {
            // given & when
            const wrapper = mount(VsThemeButton, { props: { outline: true } });

            // then
            expect(wrapper.find('.vs-theme-button').classes()).toContain('vs-outline');
        });
    });
});
