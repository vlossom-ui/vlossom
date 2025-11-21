import { h, type Component, type ExtractPropTypes, type VNode } from 'vue';
import { VsButton, VsRender } from '@/components';

type VsButtonVNodeProps = Partial<ExtractPropTypes<typeof VsButton>>;
type VsButtonVNodeEventHandler = (() => void) | (() => Promise<void>) | null;

export const vnodeUtils = {
    createVsButton(args: {
        props: VsButtonVNodeProps;
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
