<template>
    <div ref="nodeRef" :class="['vs-modal-node', colorSchemeClass]">
        <vs-dimmed
            v-if="dimmed"
            :model-value="dimmed"
            :style-set="componentStyleSet.$dimmed"
            @click.prevent.stop="onClickDimmed"
        />
        <vs-focus-trap :disabled="!focusLock" ref="focusTrapRef">
            <div
                ref="wrapRef"
                class="vs-modal-wrap"
                role="dialog"
                :aria-label="optionMessages.VS_ARIA_MODAL_LABEL"
                :aria-modal="true"
                :style="[componentInlineStyle, dragStyle]"
            >
                <div
                    v-if="draggable"
                    :class="['vs-modal-drag-handle', { 'vs-dragging': isDragging }]"
                    aria-hidden="true"
                    @pointerdown="onDragStart"
                    @pointermove="onDragMove"
                    @pointerup="onDragEnd"
                    @pointercancel="onDragEnd"
                >
                    <GripHorizontalIcon />
                </div>
                <div class="vs-modal-content" :style="componentStyleSet.$content">
                    <slot />
                </div>
            </div>
        </vs-focus-trap>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, toRefs, type ComputedRef, type PropType } from 'vue';
import { MODAL_BACK, OVERLAY_CLOSE, SIZES, VsComponent, type Size, type SizeProp } from '@/declaration';
import { useColorScheme, useMessages, useOverlayCallback, useScrollLock, useStyleSet } from '@/composables';
import { computed, defineComponent, onMounted, onUnmounted, ref, toRefs, type ComputedRef, type PropType } from 'vue';
import { OVERLAY_CLOSE, SIZES, VsComponent, type Size, type SizeProp } from '@/declaration';
import {
    useColorScheme,
    useDraggable,
    useMessages,
    useOverlayCallback,
    useScrollLock,
    useStyleSet,
} from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { getOverlayProps } from '@/props';
import { useModalHistoryStore } from '@/stores';
import { objectUtil, stringUtil } from '@/utils';
import type { VsModalNodeStyleSet } from './types';

import { GripHorizontalIcon } from '@lucide/vue';
import VsDimmed from '@/components/vs-dimmed/VsDimmed.vue';
import VsFocusTrap from '@/components/vs-focus-trap/VsFocusTrap.vue';

const componentName = VsComponent.VsModalNode;
export default defineComponent({
    name: componentName,
    components: { GripHorizontalIcon, VsDimmed, VsFocusTrap },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsModalNodeStyleSet>(),
        ...getOverlayProps(),
        beforeClose: {
            type: Function as PropType<() => Promise<boolean> | boolean>,
            default: undefined,
        },
        backClose: { type: Boolean, default: false },
        container: { type: String, default: 'body' },
        escClose: { type: Boolean, default: false },
        dimClose: { type: Boolean, default: false },
        draggable: { type: Boolean, default: false },
        scrollLock: { type: [Boolean, String] as PropType<boolean | string>, default: false },
        size: {
            type: [String, Number, Object] as PropType<SizeProp | { width?: SizeProp; height?: SizeProp }>,
        },
    },
    emits: ['close', 'click-dimmed'],
    setup(props, { emit }) {
        const {
            backClose,
            beforeClose,
            colorScheme,
            styleSet,
            dimClose,
            size,
            id,
            escClose,
            callbacks,
            focusLock,
            container,
            scrollLock,
        } = toRefs(props);

        const { optionMessages } = useMessages();
        const modalHistoryStore = useModalHistoryStore();

        const innerId = stringUtil.createID();
        const computedId = computed(() => id.value || innerId);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const modalWidthSize: Record<Size, string> = {
            xs: '20%',
            sm: '30%',
            md: '45%',
            lg: '70%',
            xl: '90%',
        };

        const modalHeightSize: Record<Size, string> = {
            xs: '20%',
            sm: '30%',
            md: '50%',
            lg: '66%',
            xl: '80%',
        };

        const INTRINSIC_WIDTHS = ['auto', 'fit-content', 'max-content', 'min-content'];

        function isSize(value: SizeProp): value is Size {
            return SIZES.includes(value as Size);
        }

        const baseStyleSet: ComputedRef<VsModalNodeStyleSet> = computed(() => ({}));

        const additionalStyleSet: ComputedRef<Partial<VsModalNodeStyleSet>> = computed(() => {
            if (!size.value) {
                return {};
            }

            const result: Record<string, string> = {};
            const width = (typeof size.value === 'object' ? size.value.width : size.value) ?? 'md';
            const height = typeof size.value === 'object' ? size.value.height : undefined;

            if (isSize(width)) {
                result['width'] = modalWidthSize[width];
            } else {
                result['width'] = stringUtil.toStringSize(width);
            }

            if (height !== undefined) {
                result['height'] = isSize(height) ? modalHeightSize[height] : stringUtil.toStringSize(height);
            }

            // 콘텐츠로 너비가 정해지는 모달에 inline-size containment를 걸면 너비가 0으로 무너진다.
            if (INTRINSIC_WIDTHS.includes(result['width'])) {
                return objectUtil.shake(result);
            }

            return { ...objectUtil.shake(result), $content: { containerType: 'inline-size' } };
        });

        const { componentStyleSet, componentInlineStyle } = useStyleSet<VsModalNodeStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        const nodeRef = ref<HTMLElement | null>(null);
        const wrapRef = ref<HTMLElement | null>(null);
        const { dragStyle, isDragging, onDragStart, onDragMove, onDragEnd } = useDraggable(wrapRef, nodeRef);

        function resolveScrollLockTarget(): string | null {
            if (!scrollLock.value) {
                return null;
            }
            return typeof scrollLock.value === 'string' ? scrollLock.value : container.value;
        }
        const scrollLockTarget = resolveScrollLockTarget();
        const scrollLockApi = scrollLockTarget ? useScrollLock(scrollLockTarget) : null;

        function openModalNode() {
            activate();
            scrollLockApi?.lock();
            if (backClose.value) {
                modalHistoryStore.push(computedId.value);
            }
        }

        function closeModalNode() {
            deactivate();
        }

        async function runBeforeClose(): Promise<boolean> {
            const fn = beforeClose.value;
            if (!fn) {
                return true;
            }
            const result = await fn();
            return result !== false;
        }

        async function tryCloseModalNode(): Promise<boolean> {
            const canClose = await runBeforeClose();
            if (canClose) {
                closeModalNode();
            }
            return canClose;
        }

        const computedCallbacks = computed(() => {
            return {
                ...callbacks.value,
                [OVERLAY_CLOSE]: () => {
                    callbacks.value?.[OVERLAY_CLOSE]?.();
                    emit('close');

                    closeModalNode();
                    modalHistoryStore.release(computedId.value);
                },
                [MODAL_BACK]: tryCloseModalNode,
                ['key-Escape']: async (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();

                    callbacks.value?.['key-Escape']?.(event);

                    if (escClose.value) {
                        await tryCloseModalNode();
                    }
                },
            };
        });

        const { activate, deactivate } = useOverlayCallback(computedId, computedCallbacks);

        async function onClickDimmed() {
            emit('click-dimmed');

            if (dimClose.value) {
                await tryCloseModalNode();
            }
        }

        onMounted(openModalNode);
        onUnmounted(() => {
            scrollLockApi?.unlock();
        });

        return {
            optionMessages,
            colorSchemeClass,
            componentStyleSet,
            componentInlineStyle,
            focusLock,
            onClickDimmed,
            nodeRef,
            wrapRef,
            dragStyle,
            isDragging,
            onDragStart,
            onDragMove,
            onDragEnd,
        };
    },
});
</script>

<style src="./VsModalNode.css" />
