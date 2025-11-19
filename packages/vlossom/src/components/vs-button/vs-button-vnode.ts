import { h, type Component, type ExtractPropTypes, type VNode, type Ref, ref, isRef } from 'vue';
import { VsButton, VsRender } from '@/components';

type Handler = (() => void) | null;

export function createVsButton(args: {
    props: Partial<ExtractPropTypes<typeof VsButton>>;
    content: string | Component;
    templateRef: string;
}): [VNode, Ref<Handler> | Handler] {
    const { props, content, templateRef } = args;
    const onClickHandler: Ref<Handler> | Handler = ref(null);

    function onClick(event: Event) {
        event.preventDefault();

        if (isRef(onClickHandler)) {
            onClickHandler.value?.();
            return;
        }
        onClickHandler?.();
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
        onClickHandler,
    ];
}
