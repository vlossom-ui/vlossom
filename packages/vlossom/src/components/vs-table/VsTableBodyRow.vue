<template>
    <tr :class="stateClasses" :style="rowStyle">
        <vs-table-drag-cell :cells :rowIdx />
        <vs-table-checkbox-cell :cells :rowIdx @select-row="selectRow">
            <template #select="{ cells, rowIdx }">
                <slot name="select" :cells :rowIdx />
            </template>
        </vs-table-checkbox-cell>
        <template v-for="(cell, index) in cells" :key="cell.id">
            <td
                :id="cell.id"
                :style="getCellStyle(index)"
                :data-label="getHeaderLabel(cell.colIdx, cell.colKey)"
                @click.prevent.stop="clickCell(cell, $event)"
            >
                <vs-skeleton v-if="loading" :style-set="skeletonStyleSet" />
                <template v-else>
                    <slot :name="findMatchingSlotName(cell)" :item="cell.item">
                        <span class="w-full">
                            {{ cell.value }}
                        </span>
                    </slot>
                </template>
            </td>
        </template>
        <vs-table-expand-cell :cells :rowIdx @expand-row="expandRow" />
        <td v-if="anyExpandable" class="vs-table-expanded-row">
            <vs-table-expanded-panel :cells :rowIdx>
                <template #expand="{ cells, rowIdx }">
                    <slot name="expand" :cells :rowIdx />
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
import type { VsSkeletonStyleSet } from '../vs-skeleton/types';
import { TABLE_STYLE_SET_TOKEN, type BodyCell, type VsTableStyleSet, getRowItem } from './types';
import { TABLE_COMPOSABLE_TOKEN, type TableComposable } from './composables/table-composable';

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
            type: Array as PropType<BodyCell[]>,
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

        const cellStyle = computed<CSSProperties | undefined>(() => tableStyleSet?.value?.cell);
        const gridStyle = computed<CSSProperties | undefined>(() => {
            const cols: string[] = [];
            if (draggable?.value) {
                cols.push('auto');
            }
            if (anySelectable.value) {
                cols.push('auto');
            }
            props.cells.forEach(() => {
                cols.push('1fr');
            });
            if (anyExpandable.value) {
                cols.push('auto');
            }
            return {
                gridTemplateColumns: cols.join(' '),
            };
        });
        const rowStyle = computed<CSSProperties | undefined>(() => {
            const selectedStyleSet = tableStyleSet?.value?.selectedRow ?? {
                backgroundColor: 'var(--vs-area-bg-active)',
                color: 'var(--vs-font-color)',
            };
            return {
                ...tableStyleSet?.value?.row,
                ...(isSelected.value ? selectedStyleSet : {}),
                ...gridStyle.value,
            };
        });
        const skeletonStyleSet = computed<VsSkeletonStyleSet>(() => ({
            component: {
                height: '100%',
                minHeight: dense?.value
                    ? 'calc(var(--vs-default-comp-height-sm))'
                    : 'calc(var(--vs-default-comp-height-md))',
            },
        }));

        function getCellStyle(index: number): CSSProperties {
            return {
                ...cellStyle.value,
                width: columns.value?.[index]?.width,
                maxWidth: columns.value?.[index]?.maxWidth,
                minWidth: columns.value?.[index]?.minWidth,
                textAlign: columns.value?.[index]?.align,
            };
        }

        function findMatchingSlotName(cell: BodyCell): string {
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

        function clickCell(cell: BodyCell, event: MouseEvent): void {
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

        function selectRow(row: BodyCell[], event: MouseEvent): void {
            emit('select-row', row, event);
        }

        function expandRow(row: BodyCell[], event: MouseEvent): void {
            emit('expand-row', row, event);
        }

        return {
            anyExpandable,
            draggable,
            loading,
            rowStyle,
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
