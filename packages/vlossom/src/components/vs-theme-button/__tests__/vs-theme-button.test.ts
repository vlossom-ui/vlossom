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
});
