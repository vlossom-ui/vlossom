import { computed, inject, provide, type Ref } from 'vue';
import { LAYOUT_PROVIDED_KEY } from '@/declaration';

export function useLayoutChild(layoutProp: Ref<boolean>) {
    const hasLayoutAncestor = inject<boolean>(LAYOUT_PROVIDED_KEY, false);

    // barrier: prevent layout context from leaking to descendants
    provide(LAYOUT_PROVIDED_KEY, false);

    const isLayoutChild = computed(() => layoutProp.value && hasLayoutAncestor);

    return { isLayoutChild };
}
