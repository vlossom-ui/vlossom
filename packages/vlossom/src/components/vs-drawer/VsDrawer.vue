<template>
    <Transition name="drawer" :duration="ANIMATION_DURATION">
        <div
            v-show="isOpen"
            ref="drawerRef"
            :class="['vs-drawer', colorSchemeClass, { 'vs-drawer-dimmed': dimmed, 'vs-drawer-resizing': isResizing }]"
            :style="{ ...styleSetVariables, ...componentInlineStyle }"
        >
            <vs-dimmed
                v-if="dimmed"
                :style-set="componentStyleSet.$dimmed"
                :model-value="isDimmed"
                @click.prevent.stop="onClickDimmed"
            />
            <vs-focus-trap ref="focusTrapRef" :disabled="!focusLock">
                <div ref="contentRef" :class="['vs-drawer-content', `vs-drawer-${placement}`]" :style="layoutStyles">
                    <vs-inner-scroll
                        :color-scheme="computedColorScheme"
                        :style-set="{
                            $header: componentStyleSet.$header,
                            $content: componentStyleSet.$content,
                            $footer: componentStyleSet.$footer,
                        }"
                        :hide-scroll
                    >
                        <template #header>
                            <slot name="header" />
                        </template>
                        <slot />
                        <template #footer>
                            <slot name="footer" />
                        </template>
                    </vs-inner-scroll>
                    <div
                        v-if="resizable"
                        class="vs-drawer-resize-handle"
                        role="separator"
                        :aria-orientation="isHorizontal ? 'vertical' : 'horizontal'"
                        @pointerdown="onResizeStart"
                        @pointermove="onResizeMove"
                        @lostpointercapture="onResizeEnd"
                    />
                </div>
            </vs-focus-trap>
        </div>
    </Transition>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    inject,
    onBeforeMount,
    toRefs,
    useTemplateRef,
    watch,
    watchEffect,
    type ComputedRef,
    type PropType,
    type TemplateRef,
} from 'vue';
import {
    LAYOUT_STORE_KEY,
    ANIMATION_DURATION,
    OVERLAY_CLOSE,
    OVERLAY_OPEN,
    VsComponent,
    type DrawerPlacement,
    type PushContainer,
    type FocusableRef,
    type SizeProp,
    SIZES,
    type Size,
} from '@/declaration';
import {
    useColorScheme,
    useLayoutChild,
    useOverlayCallback,
    useResizable,
    useStyleSet,
    type ResizeEdge,
} from '@/composables';
import { getColorSchemeProps, getLayoutProps, getStyleSetProps, getOverlayProps } from '@/props';
import { LayoutStore } from '@/stores';
import { objectUtil, stringUtil } from '@/utils';
import type { VsDrawerStyleSet } from './types';

import VsDimmed from '@/components/vs-dimmed/VsDimmed.vue';
import VsFocusTrap from '@/components/vs-focus-trap/VsFocusTrap.vue';
import VsInnerScroll from '@/components/vs-inner-scroll/VsInnerScroll.vue';

const componentName = VsComponent.VsDrawer;
const RESIZE_EDGE: Record<DrawerPlacement, ResizeEdge> = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top',
};

export default defineComponent({
    name: componentName,
    components: { VsDimmed, VsFocusTrap, VsInnerScroll },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsDrawerStyleSet>(),
        ...getOverlayProps(),
        ...getLayoutProps(),
        open: { type: Boolean, default: false },
        position: { type: String as PropType<'absolute' | 'fixed'> },
        pushContainer: { type: [Boolean, String] as PropType<PushContainer>, default: false },
        placement: {
            type: String as PropType<DrawerPlacement>,
            default: 'left',
        },
        size: { type: [String, Number] as PropType<SizeProp> },
        resizable: { type: Boolean, default: false },
        minSize: { type: [String, Number] as PropType<SizeProp> },
        maxSize: { type: [String, Number] as PropType<SizeProp> },

        // v-model
        modelValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'update:size', 'open', 'close', 'click-dimmed'],
    setup(props, { emit }) {
        const {
            colorScheme,
            styleSet,
            id,
            callbacks,
            dimClose,
            dimmed,
            escClose,
            open: initialOpen,
            position,
            layout,
            pushContainer,
            modelValue,
            placement,
            size,
            minSize,
            maxSize,
        } = toRefs(props);

        const innerId = stringUtil.createID();
        const computedId = computed(() => id.value || innerId);
        const drawerRef: TemplateRef<HTMLElement> = useTemplateRef('drawerRef');
        const focusTrapRef: TemplateRef<FocusableRef> = useTemplateRef('focusTrapRef');
        const contentRef: TemplateRef<HTMLElement> = useTemplateRef('contentRef');
        const DRAWER_SIZE: Record<Size, string> = {
            xs: '12%',
            sm: '20%',
            md: '40%',
            lg: '60%',
            xl: '80%',
        };

        const { colorSchemeClass, computedColorScheme } = useColorScheme(componentName, colorScheme);
        function toCssSize(value: SizeProp) {
            if (SIZES.includes(value as Size)) {
                return DRAWER_SIZE[value as Size];
            }
            return stringUtil.toStringSize(value);
        }

        const isHorizontal = computed(() => placement.value === 'left' || placement.value === 'right');
        const { resizedSize, isResizing, onResizeStart, onResizeMove, onResizeEnd, resetSize } = useResizable(
            contentRef,
            {
                edge: computed(() => RESIZE_EDGE[placement.value]),
                minSize: computed(() => (minSize.value ? toCssSize(minSize.value) : undefined)),
                maxSize: computed(() => (maxSize.value ? toCssSize(maxSize.value) : undefined)),
                boundaryRef: drawerRef,
                onResize: (resized) => emit('update:size', resized),
            },
        );

        const drawerSize = computed(() => {
            if (resizedSize.value !== null) {
                return `${resizedSize.value}px`;
            }
            return size.value ? toCssSize(size.value) : DRAWER_SIZE.sm;
        });

        watch(size, resetSize);

        const baseStyleSet: ComputedRef<VsDrawerStyleSet> = computed(() => ({
            $header: { padding: 0 },
            $content: { padding: 0 },
            $footer: { padding: 0 },
        }));

        const additionalStyleSet: ComputedRef<Partial<VsDrawerStyleSet>> = computed(() => {
            return objectUtil.shake({
                $size: drawerSize.value,
                position: position.value || undefined,
            });
        });

        const { styleSetVariables, componentStyleSet, componentInlineStyle } = useStyleSet<VsDrawerStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        const isDimmed = computed(() => dimmed.value && isOpen.value);

        const computedCallbacks = computed(() => {
            return {
                ...callbacks.value,
                [OVERLAY_OPEN]: () => {
                    focusTrapRef.value?.focus();
                },
                [OVERLAY_CLOSE]: () => {
                    focusTrapRef.value?.blur();
                },
                ['key-Escape']: (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();

                    callbacks.value?.['key-Escape']?.(event);

                    if (escClose.value) {
                        closeDrawer();
                    }
                },
            };
        });

        const { isActivated: isOpen, activate, deactivate } = useOverlayCallback(computedId, computedCallbacks);

        function onClickDimmed() {
            emit('click-dimmed');
            if (dimClose.value) {
                closeDrawer();
            }
        }

        function openDrawer() {
            activate();
        }

        function closeDrawer() {
            deactivate();
        }

        const { isLayoutChild } = useLayoutChild(layout);

        const layoutStore = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());
        watchEffect(() => {
            if (!isLayoutChild.value) {
                return;
            }
            layoutStore.setDrawer({
                isOpen: isOpen.value,
                placement: placement.value,
                size: drawerSize.value || DRAWER_SIZE.sm,
                pushContainer: pushContainer.value,
                resizing: isResizing.value,
            });
        });

        const layoutStyles = computed(() => {
            if (!isLayoutChild.value) {
                return {};
            }

            const NEEDS_OFFSET_POSITIONS = ['absolute', 'fixed', 'sticky'];
            const style: { [key: string]: string } = {};
            const { position: headerPosition, height: headerHeight } = layoutStore.header.value;
            const { position: footerPosition, height: footerHeight } = layoutStore.footer.value;

            if (placement.value === 'top' && NEEDS_OFFSET_POSITIONS.includes(headerPosition) && headerHeight) {
                style.top = headerHeight;
            }

            if (placement.value === 'bottom' && NEEDS_OFFSET_POSITIONS.includes(footerPosition) && footerHeight) {
                style.bottom = footerHeight;
            }

            if (placement.value === 'left' || placement.value === 'right') {
                if (NEEDS_OFFSET_POSITIONS.includes(headerPosition) && headerHeight) {
                    style.paddingTop = headerHeight;
                }
                if (NEEDS_OFFSET_POSITIONS.includes(footerPosition) && footerHeight) {
                    style.paddingBottom = footerHeight;
                }
            }

            return style;
        });

        onBeforeMount(() => {
            if (initialOpen.value || modelValue.value) {
                openDrawer();
            }
        });

        watch(isOpen, (o) => {
            emit('update:modelValue', o);
            emit(o ? 'open' : 'close');
        });

        watch(modelValue, (o) => {
            if (o) {
                openDrawer();
            } else {
                closeDrawer();
            }
        });

        return {
            drawerRef,
            focusTrapRef,
            colorSchemeClass,
            computedColorScheme,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,
            isOpen,
            ANIMATION_DURATION,
            onClickDimmed,
            isDimmed,
            openDrawer,
            closeDrawer,
            layoutStyles,
            isHorizontal,
            isResizing,
            onResizeStart,
            onResizeMove,
            onResizeEnd,
        };
    },
});
</script>

<style src="./VsDrawer.css" />
