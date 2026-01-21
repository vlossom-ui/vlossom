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

    describe('styleSet', () => {
        it('styleSet이 적용되어야 한다', () => {
            const wrapper = mount(VsLabelValue, {
                props: {
                    styleSet: {
                        variables: {
                            border: '2px solid #e91e63',
                            label: {
                                backgroundColor: '#f5f5f5',
                                fontWeight: 600,
                            },
                        },
                    },
                },
            });

            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-label-value-border': '2px solid #e91e63',
                '--vs-label-value-label-backgroundColor': '#f5f5f5',
                '--vs-label-value-label-fontWeight': 600,
            });
        });
    });
});
