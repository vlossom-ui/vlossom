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
            const pageElement = wrapper.find('.vs-page');
            const style = pageElement.attributes('style');
            expect(style).toContain('--vs-page-padding: 2rem');
            expect(style).toContain('--vs-page-fontColor: #f0f0f0');
            expect(style).toContain('--vs-page-fontWeight: 500');
            expect(style).toContain('--vs-page-lineHeight: 1.5');
            expect(style).toContain('--vs-page-whiteSpace: nowrap');
            expect(style).toContain('--vs-page-fontSize: 1.2rem');
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
            const pageElement = wrapper.find('.vs-page');
            const style = pageElement.attributes('style');
            expect(style).toContain('--vs-page-title-padding: 0 0 1.2rem 0');
            expect(style).toContain('--vs-page-title-fontColor: #333333');
            expect(style).toContain('--vs-page-title-fontSize: 2rem');
            expect(style).toContain('--vs-page-title-fontWeight: bold');
            expect(style).toContain('--vs-page-title-lineHeight: 1.5');
            expect(style).toContain('--vs-page-title-whiteSpace: nowrap');
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
            const pageElement = wrapper.find('.vs-page');
            const style = pageElement.attributes('style');
            expect(style).toContain('--vs-page-description-padding: 0 0 1.2rem 0');
            expect(style).toContain('--vs-page-description-fontColor: #666666');
            expect(style).toContain('--vs-page-description-fontWeight: 300');
            expect(style).toContain('--vs-page-description-fontSize: 1.1rem');
            expect(style).toContain('--vs-page-description-lineHeight: 1.5');
            expect(style).toContain('--vs-page-description-whiteSpace: nowrap');
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
            const pageElement = wrapper.find('.vs-page');
            const style = pageElement.attributes('style');
            expect(style).toContain('--vs-page-padding: 1rem');
            expect(style).toContain('--vs-page-fontColor: #ffffff');
            expect(style).toContain('--vs-page-fontWeight: 400');
            expect(style).toContain('--vs-page-lineHeight: 1.6');
            expect(style).toContain('--vs-page-whiteSpace: nowrap');
            expect(style).toContain('--vs-page-title-fontColor: #000000');
            expect(style).toContain('--vs-page-title-padding: 0 0 1.2rem 0');
            expect(style).toContain('--vs-page-title-fontSize: 2.5rem');
            expect(style).toContain('--vs-page-title-fontWeight: 700');
            expect(style).toContain('--vs-page-title-lineHeight: 1.2');
            expect(style).toContain('--vs-page-title-whiteSpace: nowrap');
            expect(style).toContain('--vs-page-description-fontColor: #777777');
            expect(style).toContain('--vs-page-description-fontWeight: 300');
            expect(style).toContain('--vs-page-description-fontSize: 1rem');
            expect(style).toContain('--vs-page-description-padding: 0 0 1.2rem 0');
            expect(style).toContain('--vs-page-description-lineHeight: 1.5');
            expect(style).toContain('--vs-page-description-whiteSpace: pre-wrap');
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

            const style = wrapper.find('.vs-page').attributes('style');
            expect(style).toContain('--vs-page-padding: 2rem');
            expect(style).toContain('--vs-page-title-fontSize: 3rem');
            expect(style).toContain('--vs-page-description-fontColor: #888888');
        });
    });
});
