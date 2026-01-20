import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import VsDivider from './../VsDivider.vue';

describe('vs-divider', () => {
    describe('horizontal / vertical', () => {
        it('vertical props를 설정하지 않으면 vs-horizontal class를 가진다', () => {
            // given
            const wrapper = mount(VsDivider);

            // then
            expect(wrapper.props('vertical')).toBe(false);
            expect(wrapper.classes('vs-vertical')).toBe(false);
        });

        it('vertical props를 true로 설정하면 vs-vertical class를 가진다', () => {
            // given
            const wrapper = mount(VsDivider, {
                props: {
                    vertical: true,
                },
            });

            // then
            expect(wrapper.props('vertical')).toBe(true);
            expect(wrapper.classes('vs-vertical')).toBe(true);
        });
    });

    describe('responsive', () => {
        it('vertical과 responsive props를 설정하면 각각의 class를 가진다.', () => {
            //given
            const wrapper = mount(VsDivider, {
                props: {
                    vertical: true,
                    responsive: true,
                },
            });

            //then
            expect(wrapper.classes('vs-vertical')).toBe(true);
            expect(wrapper.classes('vs-divider-responsive')).toBe(true);
        });
    });

    describe('styleSet', () => {
        it('styleSet 객체가 주어지면 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsDivider, {
                props: {
                    styleSet: {
                        variables: {
                            border: '2px solid red',
                            horizontal: {
                                width: '50%',
                                margin: '2rem 0',
                            },
                        },
                        component: {
                            opacity: 0.8,
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-divider-border': '2px solid red',
                '--vs-divider-horizontal-width': '50%',
                '--vs-divider-horizontal-margin': '2rem 0',
            });
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                opacity: 0.8,
            });
        });
    });
});
