<template>
    <tr :class="['vs-table-body-row', classObj, stateClasses]" :style="rowStyle">
        <vs-table-drag-cell :cells :rowIdx />
        <vs-table-checkbox-cell :cells :rowIdx @select-row="selectRow">
            <template #select="slotData">
                <slot name="select" v-bind="slotData" />
            </template>
        </vs-table-checkbox-cell>
        <template v-for="(cell, index) in cells" :key="cell.id">
            <td
                class="vs-table-td"
                :id="cell.id"
                :style="getCellStyle(index)"
                :data-label="getHeaderLabel(cell.colIdx, cell.colKey)"
                @click.prevent.stop="clickCell(cell, $event)"
            >
                <vs-skeleton v-if="loading" :style-set="skeletonStyleSet" />
                <template v-else>
                    <slot
                        :name="findMatchingSlotName(cell)"
                        :item="cell.item"
                        :value="cell.value"
                        :colIdx="cell.colIdx"
                        :rowIdx="cell.rowIdx"
                    >
                        <span class="w-full">
                            {{ cell.value }}
                        </span>
                    </slot>
                </template>
            </td>
        </template>
        <vs-table-expand-cell v-if="showExpand" :cells :rowIdx @expand-row="expandRow" />
        <td v-if="showExpand" class="vs-table-td vs-table-expanded-row">
            <vs-table-expanded-panel :cells :rowIdx>
                <template #expand="slotData">
                    <slot name="expand" v-bind="slotData" />
                </template>
            </vs-table-expanded-panel>
        </td>
    </tr>
</template>

<script lang="ts">
import { defineComponent, inject, computed, type ComputedRef, type PropType, toRefs, type CSSProperties } from 'vue';
import { stringUtil } from '@/utils';
import { useStateClass } from '@/composables';
import type { UIState } from '@/declaration';
import type { VsSkeletonStyleSet } from './../vs-skeleton/types';
import { TABLE_STYLE_SET_TOKEN, type VsTableBodyCell, type VsTableStyleSet, type VsTableColumnDef } from './types';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';
import { getRowItem } from './models/table-model';

import VsSkeleton from '@/components/vs-skeleton/VsSkeleton.vue';
import VsTableDragCell from './VsTableDragCell.vue';
import VsTableExpandCell from './VsTableExpandCell.vue';
import VsTableExpandedPanel from './VsTableExpandedPanel.vue';
import VsTableCheckboxCell from './VsTableCheckboxCell.vue';

export default defineComponent({
    components: {
        VsSkeleton,
        VsTableDragCell,
        VsTableExpandCell,
        VsTableExpandedPanel,
        VsTableCheckboxCell,
    },
    props: {
        cells: {
            type: Array as PropType<VsTableBodyCell[]>,
            required: true,
        },
        rowIdx: {
            type: Number,
            required: true,
        },
    },
    emits: ['click-cell', 'select-row', 'expand-row'],
    setup(props, { emit, slots }) {
        const { cells, rowIdx: rowIndex } = toRefs(props);
        const {
            anyExpandable,
            anySelectable,
            draggable,
            headerCells,
            loading,
            selectedItems,
            state: stateFn,
            items,
            columns,
            dense,
        } = inject<TableComposable>(TABLE_COMPOSABLE_TOKEN)!;
        const tableStyleSet = inject<ComputedRef<VsTableStyleSet>>(TABLE_STYLE_SET_TOKEN);
        const state = computed<UIState>(() => {
            return stateFn.value(getRowItem(cells.value), rowIndex.value, items?.value);
        });
        const { stateClasses } = useStateClass(state);

        const isSelected = computed(() => {
            if (!anySelectable.value) {
                return false;
            }
            return selectedItems.value.includes(getRowItem(props.cells));
        });
        const showExpand = computed(() =>  anyExpandable.value && !!slots.expand);

        const classObj = computed(() => ({
            'vs-selected': isSelected.value,
        }));

        const cellStyle = computed<CSSProperties | undefined>(() => tableStyleSet?.value?.cell);
        const gridStyle = computed<CSSProperties | undefined>(() => {
            const cols: string[] = [];
            if (draggable?.value) {
                cols.push('auto');
            }
            if (anySelectable.value) {
                cols.push('auto');
            }
            props.cells.forEach((_, index) => {
                cols.push(getGridColumnWidth(columns.value?.[index]));
            });
            if (anyExpandable.value) {
                cols.push('auto');
            }
            return {
                gridTemplateColumns: cols.join(' '),
            };
        });
        const rowStyle = computed<CSSProperties | undefined>(() => {
            if (isSelected.value) {
                return {
                    ...tableStyleSet?.value?.row,
                    ...tableStyleSet?.value?.selectedRow,
                    ...gridStyle.value,
                };
            }
            return {
                ...tableStyleSet?.value?.row,
                ...gridStyle.value,
            };
        });
        const skeletonStyleSet = computed<VsSkeletonStyleSet>(() => ({
            component: {
                height: '100%',
                minHeight: dense?.value ? 'calc(var(--vs-comp-height-sm))' : 'calc(var(--vs-comp-height-md))',
            },
        }));

        function getGridColumnWidth(column?: VsTableColumnDef): string {
            if (!column) {
                return '1fr';
            }
            const { width, minWidth, maxWidth } = column;
            if (width) {
                return stringUtil.toStringSize(width);
            }
            const min = minWidth ? stringUtil.toStringSize(minWidth) : null;
            const max = maxWidth ? stringUtil.toStringSize(maxWidth) : null;
            if (min && max) {
                return `minmax(${min}, ${max})`;
            }
            if (min) {
                return `minmax(${min}, 1fr)`;
            }
            if (max) {
                return `minmax(auto, ${max})`;
            }
            return '1fr';
        }

        function getCellStyle(index: number): CSSProperties {
            const { align, verticalAlign } = columns.value?.[index] ?? {};
            const justifyContentMap: Record<string, string> = {
                left: 'flex-start',
                center: 'center',
                right: 'flex-end',
            };
            const alignItemsMap: Record<string, string> = {
                top: 'flex-start',
                middle: 'center',
                bottom: 'flex-end',
            };

            return {
                ...cellStyle.value,
                textAlign: align,
                justifyContent: align ? justifyContentMap[align] : undefined,
                alignItems: verticalAlign ? alignItemsMap[verticalAlign] : undefined,
            };
        }

        function findMatchingSlotName(cell: VsTableBodyCell): string {
            const { id, colIdx, rowIdx, colKey } = cell;

            const candidatePriority = [
                `body-${id}`,
                `body-${stringUtil.kebabCase(colKey)}`,
                `body-col${colIdx}-row${rowIdx}`,
                `body-row${rowIdx}`,
                `body-col${colIdx}`,
                'body',
            ].filter((name) => name in slots);

            return candidatePriority[0] || '';
        }

        function clickCell(cell: VsTableBodyCell, event: MouseEvent): void {
            emit('click-cell', { ...cell }, event);
        }

        function getHeaderLabel(colIdx: number, fallback: string): string {
            if (loading?.value) {
                return '';
            }
            const header = headerCells.value?.[colIdx];
            if (!header) {
                return fallback;
            }
            return String(header.value ?? fallback);
        }

        function selectRow(row: VsTableBodyCell[], event: MouseEvent): void {
            emit('select-row', row, event);
        }

        function expandRow(row: VsTableBodyCell[], event: MouseEvent): void {
            emit('expand-row', row, event);
        }

        return {
            anyExpandable,
            draggable,
            loading,
            classObj,
            rowStyle,
            showExpand,
            skeletonStyleSet,
            getCellStyle,
            stateClasses,
            clickCell,
            findMatchingSlotName,
            selectRow,
            expandRow,
            getHeaderLabel,
        };
    },
});
</script>
