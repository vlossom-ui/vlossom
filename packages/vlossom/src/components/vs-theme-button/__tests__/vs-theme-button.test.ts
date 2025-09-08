import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import VsThemeButton from '../VsThemeButton.vue';

describe('vs-theme-button', () => {
    it('vs-theme-button should render', () => {
        // given & when
        const wrapper = mount(VsThemeButton);

        // then
        expect(wrapper.exists()).toBe(true);
    });
});
