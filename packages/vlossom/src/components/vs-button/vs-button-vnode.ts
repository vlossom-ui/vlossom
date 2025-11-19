import { h, type Component, type ExtractPropTypes, type VNode, type Ref, isRef } from 'vue';
import { VsButton, VsRender } from '@/components';

type Handler = (() => void) | (() => Promise<void>) | null;

export function createVsButton(args: {
    props: Partial<ExtractPropTypes<typeof VsButton>>;
    content: string | Component;
    templateRef: string;
}): [VNode, (Ref<Handler> | Handler)[]] {
    const { props, content, templateRef } = args;
    const handlers: (Ref<Handler> | Handler)[] = [];

    function onClick(event: Event) {
        event.preventDefault();

        handlers.forEach((handler) => {
            if (isRef(handler)) {
                handler.value?.();
            } else {
                handler?.();
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
}
