import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

import VsButton from '@/components/vs-button/VsButton.vue';
import { createVsButton } from './create-vs-button-vnode';

type Handler = (() => void) | null;

function mountCreateVsButton(args: Parameters<typeof createVsButton>[0]): {
    wrapper: ReturnType<typeof mount>;
    handlers: Handler[];
} {
    let handlers: Handler[] = [];
    const Host = defineComponent({
        name: 'VsButtonVNodeHost',
        setup() {
            return () => {
                const [vnode, ref] = createVsButton(args);
                handlers = ref as Handler[];
                return vnode;
            };
        },
    });

    const wrapper = mount(Host);

    return { wrapper, handlers };
}

describe('createVsButton', () => {
    it('전달된 props가 VsButton에 반영되어야 한다', () => {
        const { wrapper } = mountCreateVsButton({
            props: {
                primary: true,
                type: 'submit',
            },
            content: '확인',
            templateRef: 'primaryButton',
        });

        const buttonComponent = wrapper.findComponent(VsButton);
        expect(buttonComponent.exists()).toBe(true);

        const button = wrapper.find('button');
        expect(button.attributes('type')).toBe('submit');
        expect(button.classes()).toContain('vs-button');
        expect(button.classes()).toContain('vs-primary');

        wrapper.unmount();
    });

    it('circle prop이 true이면 vs-circle 클래스가 적용되어야 한다', () => {
        const { wrapper } = mountCreateVsButton({
            props: {
                circle: true,
            },
            content: '원형',
            templateRef: 'circleButton',
        });

        const button = wrapper.find('button');
        expect(button.classes()).toContain('vs-circle');

        wrapper.unmount();
    });

    it('ghost prop이 true이면 vs-ghost 클래스가 적용되어야 한다', () => {
        const { wrapper } = mountCreateVsButton({
            props: {
                ghost: true,
            },
            content: '고스트',
            templateRef: 'ghostButton',
        });

        const button = wrapper.find('button');
        expect(button.classes()).toContain('vs-ghost');

        wrapper.unmount();
    });

    it('large prop이 true이면 vs-large 클래스가 적용되어야 한다', () => {
        const { wrapper } = mountCreateVsButton({
            props: {
                large: true,
            },
            content: '대형',
            templateRef: 'largeButton',
        });

        const button = wrapper.find('button');
        expect(button.classes()).toContain('vs-large');

        wrapper.unmount();
    });

    it('outline prop이 true이면 vs-outline 클래스가 적용되어야 한다', () => {
        const { wrapper } = mountCreateVsButton({
            props: {
                outline: true,
            },
            content: '윤곽',
            templateRef: 'outlineButton',
        });

        const button = wrapper.find('button');
        expect(button.classes()).toContain('vs-outline');

        wrapper.unmount();
    });

    it('responsive prop이 true이면 vs-responsive 클래스가 적용되어야 한다', () => {
        const { wrapper } = mountCreateVsButton({
            props: {
                responsive: true,
            },
            content: '반응형',
            templateRef: 'responsiveButton',
        });

        const button = wrapper.find('button');
        expect(button.classes()).toContain('vs-responsive');

        wrapper.unmount();
    });

    it('문자열 content가 VsRender를 통해 렌더링되어야 한다', () => {
        const buttonText = '버튼 텍스트';
        const { wrapper } = mountCreateVsButton({
            props: {},
            content: buttonText,
            templateRef: 'textButton',
        });

        const content = wrapper.find('.vs-button-content');
        expect(content.text()).toBe(buttonText);

        wrapper.unmount();
    });

    it('컴포넌트 content도 정상적으로 렌더링되어야 한다', () => {
        const CustomContent = defineComponent({
            name: 'CustomContent',
            setup() {
                return () => h('span', { class: 'custom-content' }, '커스텀');
            },
        });

        const { wrapper } = mountCreateVsButton({
            props: {},
            content: CustomContent,
            templateRef: 'componentButton',
        });

        expect(wrapper.find('.custom-content').exists()).toBe(true);

        wrapper.unmount();
    });

    it('반환된 핸들러 ref에 함수를 할당하면 클릭 시 호출되어야 한다', async () => {
        const { wrapper, handlers } = mountCreateVsButton({
            props: {},
            content: '클릭',
            templateRef: 'clickButton',
        });

        const clickSpy = vi.fn();
        handlers.push(clickSpy);

        await wrapper.find('button').trigger('click');

        expect(clickSpy).toHaveBeenCalledTimes(1);

        wrapper.unmount();
    });

    it('disabled prop이 true이면 VsButton 동작이 유지되어야 한다', () => {
        const { wrapper } = mountCreateVsButton({
            props: {
                disabled: true,
            },
            content: '비활성',
            templateRef: 'disabledButton',
        });

        const button = wrapper.find('button');
        expect(button.attributes('disabled')).toBeDefined();
        expect(button.attributes('tabindex')).toBe('-1');
        expect(button.classes()).toContain('vs-disabled');

        wrapper.unmount();
    });
});
