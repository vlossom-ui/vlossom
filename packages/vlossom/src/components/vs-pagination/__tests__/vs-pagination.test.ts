import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsPagination from './../VsPagination.vue';

describe('VsPagination', () => {
    describe('기본 렌더링', () => {
        it('vs-pagination 컨테이너가 렌더링되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                },
            });

            // then
            expect(wrapper.find('.vs-pagination').exists()).toBe(true);
        });

        it('기본적으로 이전/다음 버튼이 렌더링되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                },
            });

            // then
            const edgeButtons = wrapper.findAll('.vs-pagination-control-button');
            expect(edgeButtons.length).toBe(2); // prev, next 2개
        });

        it('페이지 버튼들이 렌더링되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                },
            });

            // then
            expect(wrapper.find('.vs-page-buttons').exists()).toBe(true);
            const pageButtons = wrapper.findAll('.vs-page-button');
            expect(pageButtons.length).toBe(5);
        });
    });

    describe('length prop', () => {
        it('length에 따라 올바른 개수의 페이지 버튼이 렌더링되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 3,
                },
            });

            // then
            const pageButtons = wrapper.findAll('.vs-page-button');
            expect(pageButtons.length).toBe(3);
        });

        it('length가 showingLength보다 작으면 length만큼만 표시되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    showingLength: 10,
                },
            });

            // then
            const pageButtons = wrapper.findAll('.vs-page-button');
            expect(pageButtons.length).toBe(5);
        });

        it('length가 showingLength보다 크면 showingLength만큼만 표시되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 20,
                    showingLength: 5,
                },
            });

            // then
            const pageButtons = wrapper.findAll('.vs-page-button');
            expect(pageButtons.length).toBe(5);
        });
    });

    describe('edgeButtons prop', () => {
        it('edgeButtons가 false이면 처음/마지막 버튼이 없어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    edgeButtons: false,
                },
            });

            // then
            const edgeButtons = wrapper.findAll('.vs-pagination-control-button');
            // prev, next만 있어야 함 (first, last 없음)
            expect(edgeButtons.length).toBe(2);
        });

        it('edgeButtons가 true이면 처음/마지막 버튼이 렌더링되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    edgeButtons: true,
                },
            });

            // then
            const edgeButtons = wrapper.findAll('.vs-pagination-control-button');
            // first, prev, next, last 4개
            expect(edgeButtons.length).toBe(4);
        });
    });

    describe('modelValue prop', () => {
        it('기본값은 0이어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                },
            });

            // then
            expect(wrapper.vm.selectedIndex).toBe(0);
        });

        it('modelValue prop을 통해 초기 페이지를 설정할 수 있어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    modelValue: 2,
                },
            });

            // then
            expect(wrapper.vm.selectedIndex).toBe(2);
        });
    });

    describe('disabled prop', () => {
        it('disabled가 true이면 vs-disabled 클래스가 적용되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    disabled: true,
                },
            });

            // then
            expect(wrapper.find('.vs-pagination').classes()).toContain('vs-disabled');
        });

        it('disabled가 true이면 모든 페이지 버튼이 비활성화되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    disabled: true,
                },
            });

            // then
            const pageButtons = wrapper.findAll('.vs-page-button');
            pageButtons.forEach((btn) => {
                expect(btn.attributes('disabled')).toBeDefined();
            });
        });
    });

    describe('페이지 변경', () => {
        it('페이지 버튼 클릭 시 update:modelValue 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    modelValue: 0,
                },
            });

            // when
            const pageButtons = wrapper.findAll('.vs-page-button');
            await pageButtons[2].trigger('click'); // 3번째 페이지 클릭

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')![0]).toEqual([2]);
        });

        it('페이지 버튼 클릭 시 change 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    modelValue: 0,
                },
            });

            // when
            const pageButtons = wrapper.findAll('.vs-page-button');
            await pageButtons[2].trigger('click');

            // then
            expect(wrapper.emitted('change')).toBeTruthy();
            expect(wrapper.emitted('change')![0]).toEqual([2]);
        });
    });

    describe('네비게이션 버튼', () => {
        it('이전 버튼 클릭 시 이전 페이지로 이동해야 한다', async () => {
            // given
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    modelValue: 2,
                },
            });

            // when
            const edgeButtons = wrapper.findAll('.vs-pagination-control-button');
            const prevButton = edgeButtons[0]; // 첫 번째가 prev 버튼
            await prevButton.trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')![0]).toEqual([1]);
        });

        it('다음 버튼 클릭 시 다음 페이지로 이동해야 한다', async () => {
            // given
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    modelValue: 2,
                },
            });

            // when
            const edgeButtons = wrapper.findAll('.vs-pagination-control-button');
            const nextButton = edgeButtons[1]; // 두 번째가 next 버튼
            await nextButton.trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')![0]).toEqual([3]);
        });

        it('처음 버튼 클릭 시 첫 페이지로 이동해야 한다', async () => {
            // given
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    modelValue: 3,
                    edgeButtons: true,
                },
            });

            // when
            const edgeButtons = wrapper.findAll('.vs-pagination-control-button');
            const firstButton = edgeButtons[0];
            await firstButton.trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')![0]).toEqual([0]);
        });

        it('마지막 버튼 클릭 시 마지막 페이지로 이동해야 한다', async () => {
            // given
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    modelValue: 1,
                    edgeButtons: true,
                },
            });

            // when
            const edgeButtons = wrapper.findAll('.vs-pagination-control-button');
            const lastButton = edgeButtons[3]; // first, prev, next, last
            await lastButton.trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')![0]).toEqual([4]);
        });
    });

    describe('스타일 props', () => {
        it('colorScheme이 주어지면 해당 colorScheme 클래스가 적용되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    colorScheme: 'blue',
                },
            });

            // then
            expect(wrapper.vm.computedColorScheme).toBe('blue');
            expect(wrapper.vm.colorSchemeClass).toBe('vs-color-scheme-blue');
        });

        it('styleSet 객체가 주어지면 CSS 변수가 설정되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 5,
                    styleSet: {
                        variables: {
                            gap: '2rem',
                        },
                        pageButton: {
                            component: {
                                borderRadius: '50%',
                            },
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.variables?.gap).toBe('2rem');
            expect(wrapper.vm.componentStyleSet.pageButton?.component?.borderRadius).toBe('50%');
            expect(wrapper.vm.componentStyleSet.controlButton?.component?.padding).toBe('0.4rem');
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-pagination-gap': '2rem',
            });
        });
    });

    describe('pages 계산', () => {
        it('선택된 페이지를 중심으로 페이지 버튼이 표시되어야 한다', async () => {
            // given
            const wrapper = mount(VsPagination, {
                props: {
                    length: 20,
                    showingLength: 5,
                    modelValue: 10,
                },
            });

            // when
            const pages = wrapper.vm.pages;

            // then
            expect(pages).toContain(11); // 0-based로 10이지만 UI는 1-based로 11
            expect(pages.length).toBe(5);
        });

        it('첫 페이지 근처에서는 1부터 시작하는 페이지가 표시되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 20,
                    showingLength: 5,
                    modelValue: 0,
                },
            });

            // then
            const pages = wrapper.vm.pages;
            expect(pages[0]).toBe(1);
            expect(pages.length).toBe(5);
        });

        it('마지막 페이지 근처에서는 끝까지 표시되어야 한다', () => {
            // given & when
            const wrapper = mount(VsPagination, {
                props: {
                    length: 20,
                    showingLength: 5,
                    modelValue: 19,
                },
            });

            // then
            const pages = wrapper.vm.pages;
            expect(pages[pages.length - 1]).toBe(20);
            expect(pages.length).toBe(5);
        });
    });
});
