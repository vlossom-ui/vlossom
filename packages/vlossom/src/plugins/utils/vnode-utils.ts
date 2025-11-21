import { h, type Component, type ExtractPropTypes, type VNode } from 'vue';
import { VsButton, VsRender } from '@/components';

type Handler = (() => void) | (() => Promise<void>) | null;

export const vnodeUtils = {
    createVsButton(args: {
        props: Partial<ExtractPropTypes<typeof VsButton>>;
        content: string | Component;
        templateRef: string;
    }): [VNode, Handler[]] {
        const { props, content, templateRef } = args;
        const handlers: Handler[] = [];

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
