import { h, type Component, type ExtractPropTypes, type VNode } from 'vue';
import { VsButton, VsRender } from '@/components';

type VsButtonVNodeProps = Partial<ExtractPropTypes<typeof VsButton>>;
type VsButtonVNodeEventHandler = (() => void) | (() => Promise<void>) | null;

export const vnodeUtils = {
    createVsButton(args: {
        props: VsButtonVNodeProps;
        content: string | Component;
        templateRef: string;
    }): [VNode, VsButtonVNodeEventHandler[]] {
        const { props, content, templateRef } = args;
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
                    ref: templateRef,
                    onClick,
                },
                { default: () => h(VsRender, { content }) },
            ),
            handlers,
        ];
    },
};
