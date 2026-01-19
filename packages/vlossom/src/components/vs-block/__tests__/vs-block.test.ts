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

    describe('복합 styleSet 조합', () => {
        it('styleSet과 props가 동시에 주어지면 props가 우선되어야 한다', () => {
            // given, when
            const wrapper = mount(VsBlock, {
                props: {
                    height: '500px',
                    styleSet: {
                        component: {
                            height: '300px',
                            backgroundColor: '#ff0000',
                        },
                    },
                },
            });

            // then
            // props(additionalStyleSet)가 styleSet보다 우선되므로 height는 '500px'
            expect(wrapper.vm.componentStyleSet.component?.height).toBe('500px');
            // styleSet의 다른 값은 그대로 유지
            expect(wrapper.vm.componentStyleSet.component?.backgroundColor).toBe('#ff0000');
        });
    });
});
