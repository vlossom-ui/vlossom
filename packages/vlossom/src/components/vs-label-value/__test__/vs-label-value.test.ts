import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import VsLabelValue from './../VsLabelValue.vue';

describe('vs-label-value', () => {
    it('slot으로 label을 설정할 수 있다', () => {
        // given, when
        const wrapper = mount(VsLabelValue, {
            slots: {
                label: 'MyLabel',
            },
        });

        // then
        expect(wrapper.find('.vs-label').exists()).toBe(true);
        expect(wrapper.html()).toContain('MyLabel');
    });

    it('default slot으로 value를 설정할 수 있다', () => {
        // given, when
        const wrapper = mount(VsLabelValue, {
            slots: {
                default: 'MyValue',
            },
        });

        // then
        expect(wrapper.find('.vs-value').exists()).toBe(true);
        expect(wrapper.html()).toContain('MyValue');
    });
});
