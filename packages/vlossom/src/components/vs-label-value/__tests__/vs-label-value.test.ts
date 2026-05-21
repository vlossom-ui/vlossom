import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import VsLabelValue from './../VsLabelValue.vue';

describe('vs-label-value', () => {
    it('slot으로 label을 설정할 수 있다', () => {
        const wrapper = mount(VsLabelValue, {
            slots: {
                label: 'MyLabel',
            },
        });

        expect(wrapper.find('.vs-label').exists()).toBe(true);
        expect(wrapper.html()).toContain('MyLabel');
    });

    it('default slot으로 value를 설정할 수 있다', () => {
        const wrapper = mount(VsLabelValue, {
            slots: {
                default: 'MyValue',
            },
        });

        expect(wrapper.find('.vs-value').exists()).toBe(true);
        expect(wrapper.html()).toContain('MyValue');
    });

    describe('size', () => {
        it('size prop의 기본값은 "md"이며 vs-md 클래스가 적용된다', () => {
            const wrapper = mount(VsLabelValue);

            expect(wrapper.find('.vs-label-value').classes()).toContain('vs-md');
        });

        it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('size="%s"이면 vs-%s 클래스가 적용된다', (size) => {
            const wrapper = mount(VsLabelValue, { props: { size } });

            expect(wrapper.find('.vs-label-value').classes()).toContain(`vs-${size}`);
        });
    });
});
