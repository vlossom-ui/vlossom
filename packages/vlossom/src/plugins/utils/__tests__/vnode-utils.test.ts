import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

import VsButton from '@/components/vs-button/VsButton.vue';
import { vnodeUtils } from './../vnode-utils';

describe('vnodeUtils', () => {
    describe('createVsButton', () => {
        const createVsButton = vnodeUtils.createVsButton;

        it('전달된 props가 VsButton에 반영되어야 한다', () => {
            const vsButtonVNode = createVsButton({
                props: {
                    primary: true,
                    type: 'submit',
                },
                content: '확인',
                onClickEvent: () => {},
            });
            const vsButton = mount(vsButtonVNode);

            const buttonComponent = vsButton.findComponent(VsButton);
            expect(buttonComponent.exists()).toBe(true);

            const button = vsButton.find('button');
            expect(button.attributes('type')).toBe('submit');
            expect(button.classes()).toContain('vs-button');
            expect(button.classes()).toContain('vs-primary');

            vsButton.unmount();
        });

        it('circle prop이 true이면 vs-circle 클래스가 적용되어야 한다', () => {
            const vsButtonVNode = createVsButton({
                props: {
                    circle: true,
                },
                content: '원형',
                onClickEvent: () => {},
            });
            const vsButton = mount(vsButtonVNode);

            const button = vsButton.find('button');
            expect(button.classes()).toContain('vs-circle');

            vsButton.unmount();
        });

        it('ghost prop이 true이면 vs-ghost 클래스가 적용되어야 한다', () => {
            const vsButtonVNode = createVsButton({
                props: {
                    ghost: true,
                },
                content: '고스트',
                onClickEvent: () => {},
            });
            const vsButton = mount(vsButtonVNode);

            const button = vsButton.find('button');
            expect(button.classes()).toContain('vs-ghost');

            vsButton.unmount();
        });

        it('size prop이 lg이면 해당 size에 맞는 CSS 변수가 설정되어야 한다', () => {
            const vsButtonVNode = createVsButton({
                props: {
                    size: 'lg',
                },
                content: '대형',
                onClickEvent: () => {},
            });
            const vsButton = mount(vsButtonVNode);

            const button = vsButton.find('button');
            expect(button.classes()).toContain('vs-lg');

            vsButton.unmount();
        });

        it('outline prop이 true이면 vs-outline 클래스가 적용되어야 한다', () => {
            const vsButtonVNode = createVsButton({
                props: {
                    outline: true,
                },
                content: '윤곽',
                onClickEvent: () => {},
            });
            const vsButton = mount(vsButtonVNode);

            const button = vsButton.find('button');
            expect(button.classes()).toContain('vs-outline');

            vsButton.unmount();
        });

        it('responsive prop이 true이면 vs-responsive 클래스가 적용되어야 한다', () => {
            const vsButtonVNode = createVsButton({
                props: {
                    responsive: true,
                },
                content: '반응형',
                onClickEvent: () => {},
            });
            const vsButton = mount(vsButtonVNode);

            const button = vsButton.find('button');
            expect(button.classes()).toContain('vs-responsive');

            vsButton.unmount();
        });

        it('문자열 content가 VsRender를 통해 렌더링되어야 한다', () => {
            const buttonText = '버튼 텍스트';
            const vsButtonVNode = createVsButton({
                props: {},
                content: buttonText,
                onClickEvent: () => {},
            });
            const vsButton = mount(vsButtonVNode);

            const content = vsButton.find('.vs-button-content');
            expect(content.text()).toBe(buttonText);

            vsButton.unmount();
        });

        it('컴포넌트 content도 정상적으로 렌더링되어야 한다', () => {
            const CustomContent = defineComponent({
                name: 'CustomContent',
                setup() {
                    return () => h('span', { class: 'custom-content' }, '커스텀');
                },
            });

            const vsButtonVNode = createVsButton({
                props: {},
                content: CustomContent,
                onClickEvent: () => {},
            });
            const vsButton = mount(vsButtonVNode);

            expect(vsButton.find('.custom-content').exists()).toBe(true);

            vsButton.unmount();
        });

        it('disabled prop이 true이면 VsButton 동작이 유지되어야 한다', () => {
            const vsButtonVNode = createVsButton({
                props: {
                    disabled: true,
                },
                content: '비활성',
                onClickEvent: () => {},
            });
            const vsButton = mount(vsButtonVNode);

            const button = vsButton.find('button');
            expect(button.attributes('disabled')).toBeDefined();
            expect(button.attributes('tabindex')).toBe('-1');
            expect(button.classes()).toContain('vs-disabled');

            vsButton.unmount();
        });

        it('onClickEvent가 전달되면 클릭 시 해당 함수가 호출되어야 한다', async () => {
            const onClickEvent = vi.fn();
            const vsButtonVNode = createVsButton({
                props: {},
                content: '클릭',
                onClickEvent,
            });
            const vsButton = mount(vsButtonVNode);

            const button = vsButton.find('button');
            await button.trigger('click');

            expect(onClickEvent).toHaveBeenCalledTimes(1);

            vsButton.unmount();
        });
    });
});
