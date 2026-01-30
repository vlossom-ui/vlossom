import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsPage from './../VsPage.vue';

describe('VsPage', () => {
    describe('기본 렌더링', () => {
        it('title 슬롯이 없으면 vs-page-title 요소가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsPage);

            // then
            expect(wrapper.find('.vs-page-title').exists()).toBe(false);
        });

        it('description 슬롯이 없으면 vs-page-description 요소가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsPage);

            // then
            expect(wrapper.find('.vs-page-description').exists()).toBe(false);
        });
    });

    describe('styleSet', () => {
        it('styleSet이 적용되어야 한다', () => {
            const wrapper = mount(VsPage, {
                props: {
                    styleSet: {
                        variables: {
                            padding: '3rem 4rem',
                            title: {
                                padding: '0 0 1.5rem 0',
                            },
                            description: {
                                padding: '0 0 2rem 0',
                            },
                        },
                        component: {
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                        },
                    },
                },
            });

            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-page-padding': '3rem 4rem',
                '--vs-page-title-padding': '0 0 1.5rem 0',
                '--vs-page-description-padding': '0 0 2rem 0',
            });
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
            });
        });
    });
});
