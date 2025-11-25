import { h, type Component, type VNode } from 'vue';
import type { PropsOf, VsComponent } from '@/declaration';
import { VsButton, VsRender } from '@/components';

type VsButtonVNodeEventHandler = (() => void) | (() => Promise<void>) | null;

export const vnodeUtils = {
    createVsButton(args: {
        props: PropsOf<VsComponent.VsButton>;
        content: string | Component;
        onClickEvent: VsButtonVNodeEventHandler;
    }): VNode {
        const { props, content, onClickEvent } = args;

        function onClick(event: Event) {
            event.preventDefault();
            onClickEvent?.();
        }

        return h(
            VsButton,
            {
                ...props,
                onClick,
            },
            { default: () => h(VsRender, { content }) },
        );
    },
};
