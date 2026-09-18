<template>
    <thead class="vs-table-thead">
        <tr v-if="columns.length" class="vs-table-header-row" :style="headerStyle">
            <th v-if="showDrag" :class="['vs-table-th', TABLE_DRAG_HANDLE_CLASS]" :style="cellStyle">
                <GripVerticalIcon />
            </th>

            <th
                v-if="showSelect"
                class="vs-table-th"
                :style="cellStyle"
                @click.stop="toggleSelectAll(!selectedAll, $event)"
            >
                <slot name="select" :item="null" :value="selectedAll || selectedPartial" :rowIdx="0">
                    <vs-checkbox
                        :color-scheme
                        :disabled="loading"
                        :size
                        :style-set="checkboxStyleSet"
                        :model-value="selectedAll"
                        :indeterminate="selectedPartial"
                        @toggle="toggleSelectAll"
                    />
                </slot>
            </th>

            <th v-for="(column, colIdx) in columns" :key="column.key" class="vs-table-th" :style="getCellStyle(column)">
                <slot :name="getSlotName(column.key, colIdx)" :item="column" :value="column.label" :colIdx :rowIdx="0">
                    <div>
                        {{ column.label }}
                        <component
                            :is="getSortIcon(column)"
                            v-if="column.sortable"
                            class="vs-table-sort-icon"
                            @click.stop="$emit('sort', column.key)"
                        />
                    </div>
                </slot>
            </th>

            <th v-if="showExpand" class="vs-table-th vs-table-expand-handle" :style="cellStyle" />
        </tr>
    </thead>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    toRefs,
    type Component,
    type ComputedRef,
    type CSSProperties,
    type PropType,
} from 'vue';
import { objectUtil } from '@/utils';
import type { ColorScheme, Size } from '@/declaration';
import { VsTable2SortType, type VsTable2ColumnDef, type VsTable2Sort, type VsTable2StyleSet } from './types';
import { JUSTIFY_CONTENTS, TABLE_DRAG_HANDLE_CLASS } from './constants';

import type { VsCheckboxStyleSet } from '@/components/vs-checkbox/types';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, GripVerticalIcon } from '@lucide/vue';
import VsCheckbox from '@/components/vs-checkbox/VsCheckbox.vue';

export default defineComponent({
    components: { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, GripVerticalIcon, VsCheckbox },
    props: {
        columns: { type: Array as PropType<VsTable2ColumnDef[]>, default: () => [] },
        sort: { type: Object as PropType<VsTable2Sort>, default: () => ({ key: '', type: VsTable2SortType.NONE }) },
        colorScheme: { type: String as PropType<ColorScheme> },
        styleSet: { type: Object as PropType<VsTable2StyleSet>, default: () => ({}) },
        size: { type: String as PropType<Size>, default: 'md' },
        loading: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
        selectedAll: { type: Boolean, default: false },
        selectedPartial: { type: Boolean, default: false },
        showDrag: { type: Boolean, default: false },
        showSelect: { type: Boolean, default: false },
        showExpand: { type: Boolean, default: false },
    },
    emits: ['sort', 'select-all'],
    setup(props, { emit, slots }) {
        const { sort, styleSet, primary } = toRefs(props);

        const cellStyle = computed<CSSProperties | undefined>(() => styleSet.value.$cell);
        const headerStyle = computed<CSSProperties>(() => {
            const { $selected, ...baseRow } = styleSet.value.$row ?? {};
            return objectUtil.assign(baseRow, styleSet.value.$header ?? {});
        });
        const checkboxStyleSet: ComputedRef<VsCheckboxStyleSet> = computed(() => {
            if (!primary.value) {
                return {};
            }
            return {
                $checkboxColor: 'var(--vs-cs-bg-area)',
                $checkboxCheckedColor: 'var(--vs-cs-font-colored)',
            };
        });

        function getCellStyle(column: VsTable2ColumnDef): CSSProperties {
            const align = column.headerAlign;
            return {
                ...cellStyle.value,
                textAlign: align,
                justifyContent: align ? JUSTIFY_CONTENTS[align] : undefined,
            };
        }

        function getSlotName(colKey: string, colIdx: number): string {
            const candidates = [
                `header-${colKey}`,
                `header-col${colIdx}-row0`,
                'header-row0',
                `header-col${colIdx}`,
                'header',
            ];
            return candidates.find((name) => name in slots) || '';
        }

        function getSortIcon(column: VsTable2ColumnDef): Component {
            if (column.key !== sort.value.key) {
                return ArrowUpDownIcon;
            }
            if (sort.value.type === VsTable2SortType.ASCEND) {
                return ArrowUpIcon;
            }
            if (sort.value.type === VsTable2SortType.DESCEND) {
                return ArrowDownIcon;
            }
            return ArrowUpDownIcon;
        }

        function toggleSelectAll(selected: boolean, event: MouseEvent): void {
            emit('select-all', selected, event);
        }

        return {
            TABLE_DRAG_HANDLE_CLASS,
            cellStyle,
            headerStyle,
            checkboxStyleSet,
            getCellStyle,
            getSlotName,
            getSortIcon,
            toggleSelectAll,
        };
    },
});
</script>
