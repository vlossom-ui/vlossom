import { h, type Component, type VNode } from 'vue';
import type { PropsOf, VsComponent } from '@/declaration';
import { VsButton, VsRender } from '@/components';

type VsButtonVNodeEventHandler = (() => void) | (() => Promise<void>) | null;

export const vnodeUtils = {
    createVsButton(args: {
        props: PropsOf<VsComponent.VsButton>;
        content: string | Component;
        onClickEvent: VsButtonVNodeEventHandler;
        autofocus?: boolean;
    }): VNode {
        const { props, content, onClickEvent, autofocus = false } = args;

        function onClick(event: Event) {
            event.preventDefault();
            onClickEvent?.();
        }

        return h(
            VsButton,
            {
                ...props,
                onClick,
                autofocus: autofocus || undefined,
            },
            { default: () => h(VsRender, { content }) },
        );
    },
};
