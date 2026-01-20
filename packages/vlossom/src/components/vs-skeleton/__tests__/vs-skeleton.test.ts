import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsSkeleton from '../VsSkeleton.vue';

describe('VsSkeleton', () => {
    describe('styleSet', () => {
        it('styleSet 객체가 주어지면 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSkeleton, {
                props: {
                    styleSet: {
                        variables: {
                            backgroundColor: '#e0e0e0',
                            fontColor: '#999999',
                        },
                        component: {
                            width: '150px',
                            height: '75px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-skeleton-backgroundColor': '#e0e0e0',
                '--vs-skeleton-fontColor': '#999999',
            });
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                width: '150px',
                height: '75px',
                border: '1px solid #ccc',
                borderRadius: '8px',
            });
        });
    });
});
