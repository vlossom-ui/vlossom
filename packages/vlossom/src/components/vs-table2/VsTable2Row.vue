<template>
    <tr :class="['vs-table-body-row', { 'vs-selected': selected }, stateClasses]" :style="rowStyle">
        <td v-if="showDrag" :class="['vs-table-td', TABLE_DRAG_HANDLE_CLASS]" :style="cellStyle">
            <GripVerticalIcon />
        </td>

        <td v-if="showSelect" class="vs-table-td" :style="cellStyle" @click.stop="toggleSelect(!selected, $event)">
            <slot name="select" :item :value="selected" :rowIdx="index">
                <vs-checkbox
                    v-if="selectable"
                    :color-scheme
                    :disabled="loading"
                    :size
                    :model-value="selected"
                    @toggle="toggleSelect"
                />
            </slot>
        </td>

        <td
            v-for="(column, colIdx) in columns"
            :key="column.key"
            class="vs-table-td"
            :style="getCellStyle(column)"
            :data-label="loading ? '' : column.label"
            @click.stop="clickCell(column, colIdx, $event)"
        >
            <vs-skeleton v-if="loading" :color-scheme :style-set="{ height: '1lh' }" />
            <slot
                v-else
                :name="getSlotName(column.key, colIdx)"
                :item
                :value="getCellValue(item, column)"
                :colIdx
                :rowIdx="index"
            >
                <span class="w-full">{{ getCellValue(item, column) }}</span>
            </slot>
        </td>

        <template v-if="showExpand">
            <td class="vs-table-td vs-table-expand-handle" :style="cellStyle">
                <vs-button
                    v-if="expandable"
                    :color-scheme
                    :disabled="loading"
                    :style-set="expandButtonStyleSet"
                    :size
                    @click.prevent.stop="$emit('expand-row', item, index, !expanded, $event)"
                >
                    <ChevronDownIcon class="vs-table-expand-icon" :class="{ 'rotate-180': expanded }" />
                </vs-button>
            </td>
            <td class="vs-table-td vs-table-expanded-row">
                <vs-expandable :open="expanded" :size :style-set="expandedPanelStyleSet">
                    <slot name="expand" :item :value="expanded" :rowIdx="index" />
                </vs-expandable>
            </td>
        </template>
    </tr>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef, type CSSProperties, type PropType } from 'vue';
import { objectUtil } from '@/utils';
import { useStateClass } from '@/composables';
import type { ColorScheme, Size, UIState } from '@/declaration';
import type { VsTable2ColumnDef, VsTable2Item, VsTable2StyleSet } from './types';
import { ALIGN_ITEMS, JUSTIFY_CONTENTS, TABLE_DRAG_HANDLE_CLASS } from './constants';
import { getCellValue } from './composables/table-column-composable';

import type { VsButtonStyleSet } from '@/components/vs-button/types';
import type { VsExpandableStyleSet } from '@/components/vs-expandable/types';
import { ChevronDownIcon, GripVerticalIcon } from '@lucide/vue';
import VsButton from '@/components/vs-button/VsButton.vue';
import VsCheckbox from '@/components/vs-checkbox/VsCheckbox.vue';
import VsExpandable from '@/components/vs-expandable/VsExpandable.vue';
import VsSkeleton from '@/components/vs-skeleton/VsSkeleton.vue';

export default defineComponent({
    components: { ChevronDownIcon, GripVerticalIcon, VsButton, VsCheckbox, VsExpandable, VsSkeleton },
    props: {
        item: { type: null as unknown as PropType<VsTable2Item>, required: true },
        index: { type: Number, required: true },
        columns: { type: Array as PropType<VsTable2ColumnDef[]>, default: () => [] },
        colorScheme: { type: String as PropType<ColorScheme> },
        styleSet: { type: Object as PropType<VsTable2StyleSet>, default: () => ({}) },
        size: { type: String as PropType<Size>, default: 'md' },
        state: { type: String as PropType<UIState>, default: 'idle' },
        loading: { type: Boolean, default: false },
        selected: { type: Boolean, default: false },
        expanded: { type: Boolean, default: false },
        selectable: { type: Boolean, default: false },
        expandable: { type: Boolean, default: false },
        showDrag: { type: Boolean, default: false },
        showSelect: { type: Boolean, default: false },
        showExpand: { type: Boolean, default: false },
    },
    emits: ['click-cell', 'click-row', 'select-row', 'expand-row'],
    setup(props, { emit, slots }) {
        const { item, index, styleSet, state, selected } = toRefs(props);

        const { stateClasses } = useStateClass(state);

        const expandButtonStyleSet: ComputedRef<VsButtonStyleSet> = computed(() => ({
            $content: { padding: '0' },
            border: 'none',
            width: 'calc(var(--vs-size-height, var(--vs-comp-height-md)) * 0.75)',
            height: 'calc(var(--vs-size-height, var(--vs-comp-height-md)) * 0.75)',
            backgroundColor: 'var(--vs-cs-bg-colored)',
            color: 'var(--vs-cs-font-colored)',
        }));
        const expandedPanelStyleSet: ComputedRef<VsExpandableStyleSet> = computed(() => ({
            borderTop: '1px dashed var(--vs-cs-line)',
            backgroundColor: 'var(--vs-no-color)',
            boxShadow: 'inset 0 0 0.6rem 0 var(--vs-cs-shadow-color)',
        }));

        const cellStyle = computed<CSSProperties | undefined>(() => styleSet.value.$cell);
        const rowStyle = computed<CSSProperties>(() => {
            const { $selected = {}, ...baseRow } = styleSet.value.$row ?? {};
            return selected.value ? objectUtil.assign(baseRow, $selected) : baseRow;
        });

        function getCellStyle(column: VsTable2ColumnDef): CSSProperties {
            const { align, verticalAlign } = column;
            return {
                ...cellStyle.value,
                textAlign: align,
                justifyContent: align ? JUSTIFY_CONTENTS[align] : undefined,
                alignItems: verticalAlign ? ALIGN_ITEMS[verticalAlign] : undefined,
            };
        }

        function getSlotName(colKey: string, colIdx: number): string {
            const candidates = [
                `item-${colKey}`,
                `item-col${colIdx}-row${index.value}`,
                `item-row${index.value}`,
                `item-col${colIdx}`,
                'item',
            ];
            return candidates.find((name) => name in slots) || '';
        }

        function clickCell(column: VsTable2ColumnDef, colIdx: number, event: MouseEvent): void {
            emit(
                'click-cell',
                {
                    item: item.value,
                    value: getCellValue(item.value, column),
                    colKey: column.key,
                    rowIdx: index.value,
                    colIdx,
                },
                event,
            );
            emit('click-row', item.value, index.value, event);
        }

        function toggleSelect(nextSelected: boolean, event: MouseEvent): void {
            emit('select-row', item.value, index.value, nextSelected, event);
        }

        return {
            TABLE_DRAG_HANDLE_CLASS,
            getCellValue,
            stateClasses,
            expandButtonStyleSet,
            expandedPanelStyleSet,
            cellStyle,
            rowStyle,
            getCellStyle,
            getSlotName,
            clickCell,
            toggleSelect,
        };
    },
});
</script>
