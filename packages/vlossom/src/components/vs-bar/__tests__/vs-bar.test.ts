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

    describe('복합 styleSet 조합', () => {
        it('styleSet과 props가 동시에 주어지면 props가 우선되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBar, {
                props: {
                    position: 'fixed',
                    styleSet: {
                        component: {
                            position: 'absolute',
                            backgroundColor: '#ff0000',
                        },
                    },
                },
            });

            // then
            // props(additionalStyleSet)가 styleSet보다 우선되므로 position은 'fixed'
            expect(wrapper.vm.componentStyleSet.component?.position).toBe('fixed');
            // styleSet의 다른 값은 그대로 유지
            expect(wrapper.vm.componentStyleSet.component?.backgroundColor).toBe('#ff0000');
        });
    });
});
