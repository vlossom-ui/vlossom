import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsSkeleton from '../VsSkeleton.vue';

describe('VsSkeleton', () => {
    describe('style-set', () => {
        it('styleSet을 통해 커스텀 크기를 설정할 수 있어야 한다', () => {
            // given
            const customStyleSet = {
                width: '150px',
                height: '75px',
            };

            // when
            const wrapper = mount(VsSkeleton, {
                props: {
                    styleSet: customStyleSet,
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-skeleton-width': '150px',
                '--vs-skeleton-height': '75px',
            });
        });
    });
});
