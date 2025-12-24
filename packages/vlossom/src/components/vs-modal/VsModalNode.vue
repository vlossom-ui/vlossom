<template>
    <div :class="['vs-modal-node', colorSchemeClass]" :style="styleSetVariables">
        <vs-dimmed
            v-if="dimmed"
            :model-value="dimmed"
            :style-set="componentStyleSet.dimmed"
            @click.prevent.stop="onClickDimmed"
        />
        <vs-focus-trap :disabled="!focusLock" ref="focusTrapRef">
            <div class="vs-modal-wrap" role="dialog" aria-label="Modal" :aria-modal="true">
                <slot />
            </div>
        </vs-focus-trap>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, toRefs, type PropType } from 'vue';
import { OVERLAY_CLOSE, SIZES, VsComponent, type Size, type SizeProp } from '@/declaration';
import { useColorScheme, useOverlayCallback, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { getOverlayProps } from '@/props';
import { stringUtil } from '@/utils';
import type { VsModalNodeStyleSet } from './types';

import VsDimmed from '@/components/vs-dimmed/VsDimmed.vue';
import VsFocusTrap from '@/components/vs-focus-trap/VsFocusTrap.vue';

const componentName = VsComponent.VsModalNode;
export default defineComponent({
    name: componentName,
    components: { VsDimmed, VsFocusTrap },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsModalNodeStyleSet>(),
        ...getOverlayProps(),
        container: { type: String, default: 'body' },
        escClose: { type: Boolean, default: true },
        dimClose: { type: Boolean, default: true },
        size: {
            type: [String, Number, Object] as PropType<SizeProp | { width?: SizeProp; height?: SizeProp }>,
        },
    },
    emits: ['close', 'click-dimmed'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, dimClose, size, id, escClose, callbacks, focusLock } = toRefs(props);

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

        function isSize(value: SizeProp): value is Size {
            return SIZES.includes(value as Size);
        }

        const additionalStyleSet = computed(() => {
            if (!size.value) {
                return {};
            }

            const result: Record<string, string> = {};
            const width = (typeof size.value === 'object' ? size.value.width : size.value) ?? 'md';
            const height = (typeof size.value === 'object' ? size.value.height : size.value) ?? 'md';
            if (isSize(width)) {
                result['width'] = modalWidthSize[width];
            } else {
                result['width'] = stringUtil.toStringSize(width);
            }

            if (isSize(height)) {
                result['height'] = modalHeightSize[height];
            } else {
                result['height'] = stringUtil.toStringSize(height);
            }

            return result;
        });

        const { styleSetVariables, componentStyleSet } = useStyleSet<VsModalNodeStyleSet>(
            componentName,
            styleSet,
            additionalStyleSet,
        );

        function openModalNode() {
            activate();
        }

        function closeModalNode() {
            deactivate();
        }

        const computedCallbacks = computed(() => {
            return {
                ...callbacks.value,
                [OVERLAY_CLOSE]: () => {
                    callbacks.value?.[OVERLAY_CLOSE]?.();
                    emit('close');

                    closeModalNode();
                },
                ['key-Escape']: (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();

                    callbacks.value?.['key-Escape']?.(event);

                    if (escClose.value) {
                        closeModalNode();
                    }
                },
            };
        });

        const { activate, deactivate } = useOverlayCallback(computedId, computedCallbacks);

        function onClickDimmed() {
            emit('click-dimmed');

            if (dimClose.value) {
                closeModalNode();
            }
        }

        onMounted(openModalNode);

        return {
            colorSchemeClass,
            styleSetVariables,
            componentStyleSet,
            focusLock,
            onClickDimmed,
        };
    },
});
</script>

<style src="./VsModalNode.css" />
