import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsBlock from '@/components/vs-block/VsBlock.vue';

describe('VsBlock', () => {
    describe('기본 렌더링', () => {
        it('기본 상태에서 올바르게 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock);

            // then
            expect(wrapper.find('.vs-block').exists()).toBe(true);
            expect(wrapper.find('.vs-block-content').exists()).toBe(true);
        });

        it('vs-responsive 컴포넌트를 사용해야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock);

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.exists()).toBe(true);
            expect(responsive.classes()).toContain('vs-block');
        });

        it('기본 콘텐츠가 vs-block-content 내부에 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                slots: {
                    default: '<p class="test-content">테스트 콘텐츠</p>',
                },
            });

            // then
            const content = wrapper.find('.vs-block-content');
            expect(content.exists()).toBe(true);
            expect(content.find('.test-content').exists()).toBe(true);
            expect(content.find('.test-content').text()).toBe('테스트 콘텐츠');
        });
    });

    describe('슬롯', () => {
        it('title 슬롯이 없으면 vs-block-title이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                slots: {
                    default: '기본 콘텐츠',
                },
            });

            // then
            expect(wrapper.find('.vs-block-title').exists()).toBe(false);
        });

        it('title 슬롯이 있으면 vs-block-title이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                slots: {
                    title: '<h2 class="test-title">블록 제목</h2>',
                    default: '기본 콘텐츠',
                },
            });

            // then
            const title = wrapper.find('.vs-block-title');
            expect(title.exists()).toBe(true);
            expect(title.find('.test-title').exists()).toBe(true);
            expect(title.find('.test-title').text()).toBe('블록 제목');
        });

        it('title과 default 슬롯이 올바른 순서로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                slots: {
                    title: '제목',
                    default: '내용',
                },
            });

            // then
            const block = wrapper.find('.vs-block');
            const children = block.element.children;
            expect(children[0].classList.contains('vs-block-title')).toBe(true);
            expect(children[1].classList.contains('vs-block-content')).toBe(true);
        });
    });

    describe('colorScheme prop', () => {
        it('colorScheme이 주어지면 해당 색상 테마 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    colorScheme: 'blue',
                },
            });

            // then
            const block = wrapper.find('.vs-block');
            expect(block.classes()).toContain('vs-color-scheme-blue');
        });

        it('colorScheme이 주어지지 않으면 기본 색상 테마 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock);

            // then
            const block = wrapper.find('.vs-block');
            expect(block.classes()).toContain('vs-color-scheme-default');
        });

        it('다양한 colorScheme 값이 올바르게 적용되어야 한다', () => {
            const colorSchemes = ['red', 'blue', 'green', 'yellow', 'purple'] as const;

            colorSchemes.forEach((colorScheme) => {
                // given, when
                const wrapper = mount(VsBlock, {
                    props: { colorScheme },
                });

                // then
                const block = wrapper.find('.vs-block');
                expect(block.classes()).toContain(`vs-color-scheme-${colorScheme}`);
            });
        });
    });

    describe('styleSet prop', () => {
        it('styleSet 객체가 주어지면 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    styleSet: {
                        backgroundColor: '#f0f0f0',
                        border: '2px solid #000',
                        borderRadius: '8px',
                        padding: '20px',
                        fontColor: '#333',
                        fontSize: '16px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style['--vs-block-backgroundColor']).toBe('#f0f0f0');
            expect(style['--vs-block-border']).toBe('2px solid #000');
            expect(style['--vs-block-borderRadius']).toBe('8px');
            expect(style['--vs-block-padding']).toBe('20px');
            expect(style['--vs-block-fontColor']).toBe('#333');
            expect(style['--vs-block-fontSize']).toBe('16px');
            expect(style['--vs-block-boxShadow']).toBe('0 2px 4px rgba(0,0,0,0.1)');
        });

        it('styleSet의 title 속성이 주어지면 title 관련 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    styleSet: {
                        title: {
                            backgroundColor: '#007bff',
                            fontColor: '#fff',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            padding: '15px',
                            bottomBorder: '1px solid #ccc',
                        },
                    },
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style['--vs-block-title-backgroundColor']).toBe('#007bff');
            expect(style['--vs-block-title-fontColor']).toBe('#fff');
            expect(style['--vs-block-title-fontSize']).toBe('18px');
            expect(style['--vs-block-title-fontWeight']).toBe('bold');
            expect(style['--vs-block-title-padding']).toBe('15px');
            expect(style['--vs-block-title-bottomBorder']).toBe('1px solid #ccc');
        });

        it('styleSet이 문자열로 주어지면 해당 스타일셋이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    styleSet: 'customStyleSet',
                },
            });

            // then
            // 문자열 styleSet은 useStyleSet에서 처리되므로 컴포넌트가 정상 렌더링되는지 확인
            expect(wrapper.find('.vs-block').exists()).toBe(true);
        });
    });

    describe('반응형 props (grid, width)', () => {
        it('grid prop이 문자열로 주어지면 VsResponsive에 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    grid: '6',
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('grid')).toBe('6');
        });

        it('grid prop이 숫자로 주어지면 VsResponsive에 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    grid: 8,
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('grid')).toBe(8);
        });

        it('grid prop이 Breakpoints 객체로 주어지면 VsResponsive에 전달되어야 한다', () => {
            // given
            const gridBreakpoints = { xs: 12, sm: 6, md: 4, lg: 3 };

            // when
            const wrapper = mount(VsBlock, {
                props: {
                    grid: gridBreakpoints,
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('grid')).toEqual(gridBreakpoints);
        });

        it('width prop이 문자열로 주어지면 VsResponsive에 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    width: '500px',
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('width')).toBe('500px');
        });

        it('width prop이 숫자로 주어지면 VsResponsive에 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    width: 400,
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('width')).toBe(400);
        });

        it('width prop이 Breakpoints 객체로 주어지면 VsResponsive에 전달되어야 한다', () => {
            // given
            const widthBreakpoints = { xs: '100%', sm: '80%', md: '60%', lg: '40%' };

            // when
            const wrapper = mount(VsBlock, {
                props: {
                    width: widthBreakpoints,
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('width')).toEqual(widthBreakpoints);
        });

        it('grid와 width가 동시에 주어지면 둘 다 VsResponsive에 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    grid: '4',
                    width: '300px',
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('grid')).toBe('4');
            expect(responsive.props('width')).toBe('300px');
        });
    });

    describe('통합 테스트', () => {
        it('모든 props와 슬롯이 함께 사용될 때 올바르게 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    colorScheme: 'blue',
                    grid: { xs: 12, md: 6 },
                    width: '100%',
                    styleSet: {
                        backgroundColor: '#e3f2fd',
                        padding: '24px',
                        title: {
                            fontColor: '#1976d2',
                            fontSize: '20px',
                        },
                    },
                },
                slots: {
                    title: '<h2>통합 테스트 제목</h2>',
                    default: '<p>통합 테스트 내용</p>',
                },
            });

            // then
            const block = wrapper.find('.vs-block');

            // 기본 구조 확인
            expect(block.exists()).toBe(true);
            expect(wrapper.find('.vs-block-title').exists()).toBe(true);
            expect(wrapper.find('.vs-block-content').exists()).toBe(true);

            // colorScheme 확인
            expect(block.classes()).toContain('vs-color-scheme-blue');

            // styleSet CSS 변수 확인
            const style = wrapper.vm.styleSetVariables;
            expect(style['--vs-block-backgroundColor']).toBe('#e3f2fd');
            expect(style['--vs-block-padding']).toBe('24px');
            expect(style['--vs-block-title-fontColor']).toBe('#1976d2');
            expect(style['--vs-block-title-fontSize']).toBe('20px');

            // 반응형 props 확인
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('grid')).toEqual({ xs: 12, md: 6 });
            expect(responsive.props('width')).toBe('100%');

            // 슬롯 내용 확인
            expect(wrapper.find('.vs-block-title h2').text()).toBe('통합 테스트 제목');
            expect(wrapper.find('.vs-block-content p').text()).toBe('통합 테스트 내용');
        });
    });
});
