import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsSkeleton from '../VsSkeleton.vue';

describe('VsSkeleton', () => {
    it('text contents를 slot에 넣을 수 있어야 한다', () => {
        // given & when
        const text = 'Something is loading...';
        const skeleton = mount(VsSkeleton, {
            slots: {
                default: text,
            },
        });

        // then
        expect(skeleton.html()).toContain(text);
    });

    describe('컴퍼넌트의 크기', () => {
        it('styleSet을 통해 커스텀 크기를 설정할 수 있어야 한다', () => {
            // given
            const customStyleSet = {
                width: '150px',
                height: '75px',
            };

            // when
            const skeleton = mount(VsSkeleton, {
                props: {
                    styleSet: customStyleSet,
                },
                attachTo: document.body,
            });
            const element = skeleton.element as HTMLElement;
            const style = element.getAttribute('style');

            // then
            expect(style).toContain(`--vs-skeleton-width: ${customStyleSet.width}`);
            expect(style).toContain(`--vs-skeleton-height: ${customStyleSet.height}`);
        });

        it('styleSet을 지정하지 않은 경우, CSS 기본값 100%가 적용되어야 한다', () => {
            // given
            const ParentComponent = {
                template: `
                    <div style="width: 200px; height: 100px;">
                        <vs-skeleton />
                    </div>
                `,
                components: { VsSkeleton },
            };

            // when
            const wrapper = mount(ParentComponent, {
                attachTo: document.body,
            });
            const skeleton = wrapper.findComponent(VsSkeleton);
            const skeletonElement = skeleton.element as HTMLElement;

            // then
            const inlineStyle = skeletonElement.getAttribute('style') || '';
            expect(wrapper.find('div').element).toContain(skeletonElement);
            expect(inlineStyle).not.toContain('--vs-skeleton-width');
            expect(inlineStyle).not.toContain('--vs-skeleton-height');
            expect(skeleton.classes()).toContain('vs-skeleton');
        });
    });
});
