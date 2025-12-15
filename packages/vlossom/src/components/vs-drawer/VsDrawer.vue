<template>
    <Transition name="drawer" :duration="ANIMATION_DURATION">
        <div
            v-show="isOpen"
            ref="drawerRef"
            :class="['vs-drawer', colorSchemeClass, { 'vs-drawer-dimmed': dimmed }]"
            :style="styleSetVariables"
        >
            <vs-dimmed
                v-if="dimmed"
                :model-value="isDimmed"
                :style-set="dimmedStyleSet"
                @click.prevent.stop="onClickDimmed"
            />
            <vs-focus-trap
                ref="focusTrapRef"
                :disabled="!focusLock"
                :class="['vs-drawer-content', `vs-drawer-${placement}`]"
            >
                <vs-inner-scroll :hide-scroll>
                    <template #header>
                        <slot name="header" />
                    </template>
                    <slot />
                    <template #footer>
                        <slot name="footer" />
                    </template>
                </vs-inner-scroll>
            </vs-focus-trap>
        </div>
    </Transition>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    getCurrentInstance,
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
    type Focusable,
    type SizeProp,
    SIZES,
    type Size,
} from '@/declaration';
import { useColorScheme, useOverlayCallback, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps, getOverlayProps } from '@/props';
import { LayoutStore } from '@/stores';
import { objectUtil, stringUtil } from '@/utils';
import type { VsDrawerStyleSet } from './types';

import VsDimmed from '@/components/vs-dimmed/VsDimmed.vue';
import VsFocusTrap from '@/components/vs-focus-trap/VsFocusTrap.vue';
import VsInnerScroll from '@/components/vs-inner-scroll/VsInnerScroll.vue';

const componentName = VsComponent.VsDrawer;
export default defineComponent({
    name: componentName,
    components: { VsDimmed, VsFocusTrap, VsInnerScroll },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsDrawerStyleSet>(),
        ...getOverlayProps(),
        fixed: { type: Boolean, default: false },
        layoutResponsive: { type: Boolean, default: false },
        open: { type: Boolean, default: false },
        placement: {
            type: String as PropType<DrawerPlacement>,
            default: 'left',
        },
        size: { type: [String, Number] as PropType<SizeProp> },

        // v-model
        modelValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'open', 'close', 'click-dimmed'],
    setup(props, { emit }) {
        const {
            colorScheme,
            styleSet,
            id,
            callbacks,
            dimClose,
            dimmed,
            escClose,
            focusLock,
            fixed,
            open: initialOpen,
            modelValue,
            layoutResponsive,
            placement,
            size,
        } = toRefs(props);

        const drawerRef: TemplateRef<HTMLElement> = useTemplateRef('drawerRef');
        const focusTrapRef: TemplateRef<Focusable> = useTemplateRef('focusTrapRef');
        const DRAWER_SIZE: Record<Size, string> = {
            xs: '12%',
            sm: '20%',
            md: '40%',
            lg: '60%',
            xl: '80%',
        };

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
        const drawerSize = computed(() => {
            if (!size.value) {
                return DRAWER_SIZE.sm;
            }
            if (SIZES.includes(size.value as Size)) {
                return DRAWER_SIZE[size.value as Size];
            }
            return stringUtil.toStringSize(size.value);
        });

        const additionalStyleSet: ComputedRef<Partial<VsDrawerStyleSet>> = computed(() => {
            return objectUtil.shake({
                position: fixed.value ? 'fixed' : undefined,
                size: drawerSize.value,
            });
        });

        const { styleSetVariables, componentStyleSet } = useStyleSet<VsDrawerStyleSet>(
            componentName,
            styleSet,
            additionalStyleSet,
        );

        const dimmedStyleSet = computed(() => {
            return componentStyleSet.value.dimmed;
        });

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
                        unmountOverlay();
                    }
                },
            };
        });

        const { isMounted: isOpen, mountOverlay, unmountOverlay } = useOverlayCallback(id, computedCallbacks);

        function onClickDimmed() {
            emit('click-dimmed');
            if (dimClose.value) {
                unmountOverlay();
            }
        }

        // only for vs-layout children
        const isLayoutChild = computed(() => getCurrentInstance()?.parent?.type.name === VsComponent.VsLayout);

        const layoutStore = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());
        watchEffect(() => {
            if (!isLayoutChild.value) {
                return;
            }
            layoutStore.setDrawer({
                isOpen: isOpen.value,
                placement: placement.value,
                size: drawerSize.value || DRAWER_SIZE.sm,
                responsive: layoutResponsive.value,
            });
        });

        onBeforeMount(() => {
            if (initialOpen.value || modelValue.value) {
                mountOverlay();
            }
        });

        watch(isOpen, (o) => {
            if (o) {
                mountOverlay();
            } else {
                unmountOverlay();
            }

            emit('update:modelValue', o);
            emit(o ? 'open' : 'close');
        });

        watch(modelValue, (o) => {
            isOpen.value = o;
        });

        return {
            drawerRef,
            focusTrapRef,
            colorSchemeClass,
            styleSetVariables,
            isOpen,
            ANIMATION_DURATION,
            onClickDimmed,
            dimmedStyleSet,
            isDimmed,
            focusLock,
        };
    },
});
</script>

<style src="./VsDrawer.css" />
