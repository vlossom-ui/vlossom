import { h, type Component, type ExtractPropTypes, type VNode } from 'vue';
import { VsButton, VsRender } from '@/components';

type VsButtonVNodeProps = Partial<ExtractPropTypes<typeof VsButton>>;
type VsButtonVNodeEventHandler = (() => void) | (() => Promise<void>) | null;

export const vnodeUtils = {
    createVsButton(args: {
        props: VsButtonVNodeProps;
        content: string | Component;
    }): [VNode, VsButtonVNodeEventHandler[]] {
        const { props, content } = args;
        const handlers: VsButtonVNodeEventHandler[] = [];

        function onClick(event: Event) {
            event.preventDefault();

            handlers.forEach((handler) => {
                if (handler) {
                    handler();
                }
            });
        }

        return [
            h(
                VsButton,
                {
                    ...props,
                    onClick,
                },
                { default: () => h(VsRender, { content }) },
            ),
            handlers,
        ];
    },
};
