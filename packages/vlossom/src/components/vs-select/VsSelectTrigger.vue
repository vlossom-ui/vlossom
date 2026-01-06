<template>
    <div ref="triggerRef" :class="['vs-select-trigger', stateClasses]" @click="$emit('click')">
        <div class="vs-select-value">
            <template v-if="isEmpty">
                <span class="vs-select-placeholder">{{ placeholder }}</span>
            </template>
            <template v-else-if="multiple">
                <template v-if="collapseChips && selectedOptions.length > 1">
                    <vs-chip small :closable="closableChips" primary @close="$emit('deselect', selectedOptions[0].id)">
                        {{ selectedOptions[0].label }}
                    </vs-chip>
                    <span class="vs-select-collapsed-count">+{{ selectedOptions.length - 1 }}</span>
                </template>
                <template v-else>
                    <vs-chip
                        v-for="chip in selectedOptions"
                        :key="chip.id"
                        :closable="closableChips"
                        small
                        primary
                        @close="$emit('deselect', chip.id)"
                    >
                        {{ chip.label }}
                    </vs-chip>
                </template>
            </template>
            <template v-else>
                {{ displayLabel }}
            </template>
        </div>
        <div :class="['vs-select-icon', { 'vs-select-icon-open': isOpen }]">
            <vs-render :content="selectIcons.arrowDown" />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, useTemplateRef, type PropType, type TemplateRef } from 'vue';
import type { OptionItem, UIState } from '@/declaration';
import { useStateClass } from '@/composables';
import { selectIcons } from './icons';

import VsChip from '@/components/vs-chip/VsChip.vue';
import VsRender from '@/components/vs-render/VsRender.vue';

export default defineComponent({
    name: 'VsSelectTrigger',
    components: { VsChip, VsRender },
    props: {
        collapseChips: { type: Boolean, default: false },
        closableChips: { type: Boolean, default: false },
        isEmpty: { type: Boolean, default: false },
        isOpen: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        placeholder: { type: String, default: '' },
        selectedOptions: {
            type: Array as PropType<OptionItem[]>,
            default: () => [],
        },
        state: { type: String as PropType<UIState>, default: 'idle' },
    },
    emits: ['click', 'deselect'],
    setup(props) {
        const { isEmpty, selectedOptions, state } = toRefs(props);

        const triggerRef: TemplateRef<HTMLElement> = useTemplateRef('triggerRef');

        const { stateClasses } = useStateClass(state);

        const displayLabel = computed(() => {
            if (isEmpty.value) {
                return '';
            }

            return selectedOptions.value[0]?.label ?? '';
        });

        function focus() {
            triggerRef.value?.focus();
        }

        function blur() {
            triggerRef.value?.blur();
        }

        return {
            triggerRef,
            selectIcons,
            stateClasses,
            displayLabel,
            focus,
            blur,
        };
    },
});
</script>
