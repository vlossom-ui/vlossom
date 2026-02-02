import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsBar from './../VsBar.vue';

describe('VsBar', () => {
    describe('props', () => {
        it('primary prop이 true이면 vs-primary 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBar, {
                props: {
                    primary: true,
                },
            });

            // then
            expect(wrapper.classes()).toContain('vs-primary');
        });
    });
});
