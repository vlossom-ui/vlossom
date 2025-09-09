import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import VsThemeButton from '../VsThemeButton.vue';
import { createVlossom } from '@/framework';

describe('vs-theme-button', () => {
    beforeEach(() => {
        createVlossom({ components: {} });
    });

    it('vs-theme-button should render', () => {
        // given & when
        const wrapper = mount(VsThemeButton);

        // then
        expect(wrapper.exists()).toBe(true);
    });
});
