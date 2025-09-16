import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsPage from './../VsPage.vue';

describe('VsPage', () => {
    describe('기본 렌더링', () => {
        it('vs-page 클래스를 가진 div로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsPage);

            // then
            expect(wrapper.find('.vs-page').exists()).toBe(true);
            expect(wrapper.find('.vs-page-content').exists()).toBe(true);
        });

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

    describe('슬롯', () => {
        it('title 슬롯이 제공되면 vs-page-title 요소가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsPage, {
                slots: {
                    title: '페이지 제목',
                },
            });

            // then
            expect(wrapper.find('.vs-page-title').exists()).toBe(true);
            expect(wrapper.find('.vs-page-title').text()).toBe('페이지 제목');
        });

        it('description 슬롯이 제공되면 vs-page-description 요소가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsPage, {
                slots: {
                    description: '페이지 설명',
                },
            });

            // then
            expect(wrapper.find('.vs-page-description').exists()).toBe(true);
            expect(wrapper.find('.vs-page-description').text()).toBe('페이지 설명');
        });

        it('default 슬롯 내용이 vs-page-content에 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsPage, {
                slots: {
                    default: '<div class="test-content">페이지 내용</div>',
                },
            });

            // then
            expect(wrapper.find('.vs-page-content').exists()).toBe(true);
            expect(wrapper.find('.vs-page-content .test-content').text()).toBe('페이지 내용');
        });

        it('모든 슬롯이 제공되면 올바른 순서로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsPage, {
                slots: {
                    title: '제목',
                    description: '설명',
                    default: '내용',
                },
            });

            // then
            const pageElement = wrapper.find('.vs-page');
            const children = pageElement.element.children;

            expect(children[0].classList.contains('vs-page-title')).toBe(true);
            expect(children[1].classList.contains('vs-page-description')).toBe(true);
            expect(children[2].classList.contains('vs-page-content')).toBe(true);
        });
    });

    describe('styleSet', () => {
        it('styleSet이 제공되면 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsPage, {
                props: {
                    styleSet: {
                        padding: '2rem',
                        fontColor: '#f0f0f0',
                        fontSize: '1.2rem',
                        fontWeight: '500',
                        lineHeight: '1.5',
                        whiteSpace: 'nowrap',
                    },
                },
            });

            // then
            const styleVariables = wrapper.vm.styleSetVariables;
            expect(styleVariables['--vs-page-padding']).toBe('2rem');
            expect(styleVariables['--vs-page-fontColor']).toBe('#f0f0f0');
            expect(styleVariables['--vs-page-fontWeight']).toBe('500');
            expect(styleVariables['--vs-page-lineHeight']).toBe('1.5');
            expect(styleVariables['--vs-page-whiteSpace']).toBe('nowrap');
            expect(styleVariables['--vs-page-fontSize']).toBe('1.2rem');
        });

        it('styleSet의 title 스타일이 제공되면 해당 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsPage, {
                props: {
                    styleSet: {
                        title: {
                            padding: '0 0 1.2rem 0',
                            fontColor: '#333333',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            lineHeight: '1.5',
                            whiteSpace: 'nowrap',
                        },
                    },
                },
            });

            // then
            const styleVariables = wrapper.vm.styleSetVariables;
            expect(styleVariables['--vs-page-title-padding']).toBe('0 0 1.2rem 0');
            expect(styleVariables['--vs-page-title-fontColor']).toBe('#333333');
            expect(styleVariables['--vs-page-title-fontSize']).toBe('2rem');
            expect(styleVariables['--vs-page-title-fontWeight']).toBe('bold');
            expect(styleVariables['--vs-page-title-lineHeight']).toBe('1.5');
            expect(styleVariables['--vs-page-title-whiteSpace']).toBe('nowrap');
        });

        it('styleSet의 description 스타일이 제공되면 해당 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsPage, {
                props: {
                    styleSet: {
                        description: {
                            padding: '0 0 1.2rem 0',
                            fontColor: '#666666',
                            fontSize: '1.1rem',
                            fontWeight: '300',
                            lineHeight: '1.5',
                            whiteSpace: 'nowrap',
                        },
                    },
                },
            });

            // then
            const styleVariables = wrapper.vm.styleSetVariables;
            expect(styleVariables['--vs-page-description-padding']).toBe('0 0 1.2rem 0');
            expect(styleVariables['--vs-page-description-fontColor']).toBe('#666666');
            expect(styleVariables['--vs-page-description-fontWeight']).toBe('300');
            expect(styleVariables['--vs-page-description-fontSize']).toBe('1.1rem');
            expect(styleVariables['--vs-page-description-lineHeight']).toBe('1.5');
            expect(styleVariables['--vs-page-description-whiteSpace']).toBe('nowrap');
        });

        it('복합적인 styleSet이 제공되면 모든 CSS 변수가 올바르게 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsPage, {
                props: {
                    styleSet: {
                        padding: '1rem',
                        fontColor: '#ffffff',
                        fontSize: '1.2rem',
                        fontWeight: '400',
                        lineHeight: '1.6',
                        whiteSpace: 'nowrap',
                        title: {
                            padding: '0 0 1.2rem 0',
                            fontColor: '#000000',
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            lineHeight: '1.2',
                            whiteSpace: 'nowrap',
                        },
                        description: {
                            padding: '0 0 1.2rem 0',
                            fontColor: '#777777',
                            fontSize: '1rem',
                            fontWeight: '300',
                            lineHeight: '1.5',
                            whiteSpace: 'pre-wrap',
                        },
                    },
                },
            });

            // then
            const styleVariables = wrapper.vm.styleSetVariables;
            expect(styleVariables['--vs-page-padding']).toBe('1rem');
            expect(styleVariables['--vs-page-fontColor']).toBe('#ffffff');
            expect(styleVariables['--vs-page-fontWeight']).toBe('400');
            expect(styleVariables['--vs-page-lineHeight']).toBe('1.6');
            expect(styleVariables['--vs-page-whiteSpace']).toBe('nowrap');
            expect(styleVariables['--vs-page-title-fontColor']).toBe('#000000');
            expect(styleVariables['--vs-page-title-padding']).toBe('0 0 1.2rem 0');
            expect(styleVariables['--vs-page-title-fontSize']).toBe('2.5rem');
            expect(styleVariables['--vs-page-title-fontWeight']).toBe('700');
            expect(styleVariables['--vs-page-title-lineHeight']).toBe('1.2');
            expect(styleVariables['--vs-page-title-whiteSpace']).toBe('nowrap');
            expect(styleVariables['--vs-page-description-fontColor']).toBe('#777777');
            expect(styleVariables['--vs-page-description-fontWeight']).toBe('300');
            expect(styleVariables['--vs-page-description-fontSize']).toBe('1rem');
            expect(styleVariables['--vs-page-description-padding']).toBe('0 0 1.2rem 0');
            expect(styleVariables['--vs-page-description-lineHeight']).toBe('1.5');
            expect(styleVariables['--vs-page-description-whiteSpace']).toBe('pre-wrap');
        });
    });

    describe('통합 테스트', () => {
        it('모든 슬롯과 스타일이 함께 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsPage, {
                props: {
                    styleSet: {
                        padding: '2rem',
                        title: { fontSize: '3rem' },
                        description: { fontColor: '#888888' },
                    },
                },
                slots: {
                    title: '<h1>메인 제목</h1>',
                    description: '<p>상세 설명</p>',
                    default: '<main>주요 내용</main>',
                },
            });

            // then
            expect(wrapper.find('.vs-page-title h1').text()).toBe('메인 제목');
            expect(wrapper.find('.vs-page-description p').text()).toBe('상세 설명');
            expect(wrapper.find('.vs-page-content main').text()).toBe('주요 내용');

            const styleVariables = wrapper.vm.styleSetVariables;
            expect(styleVariables['--vs-page-padding']).toBe('2rem');
            expect(styleVariables['--vs-page-title-fontSize']).toBe('3rem');
            expect(styleVariables['--vs-page-description-fontColor']).toBe('#888888');
        });
    });
});
