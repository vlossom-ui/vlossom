import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { computed, defineComponent, nextTick, onBeforeUpdate, reactive, ref, shallowRef } from 'vue';
import VsTableBodyRow from './../VsTableBodyRow.vue';
import { TABLE_COMPOSABLE_TOKEN } from './../composables/table-composable';
import {
    TABLE_COLOR_SCHEME_TOKEN,
    TABLE_SIZE_TOKEN,
    TABLE_STYLE_SET_TOKEN,
    type VsTableItem,
    type VsTableRow,
} from './../types';

function createRow(item: VsTableItem, rowIdx: number): VsTableRow {
    return {
        key: item.id,
        item,
        cells: [
            {
                tag: 'td',
                id: `cell-${item.id}`,
                value: item.name,
                item,
                colKey: 'name',
                colIdx: 0,
                rowIdx,
            },
        ],
    };
}

describe('VsTableBodyRow 업데이트 격리', () => {
    it('한 행을 선택해도 다른 행은 다시 렌더되지 않는다', async () => {
        const items = [
            { id: '1', name: 'Alice' },
            { id: '2', name: 'Bob' },
        ];
        const selectedSet = reactive(new Set<VsTableItem>());
        const updateCount: Record<string, number> = { '1': 0, '2': 0 };

        const table = {
            anyExpandable: computed(() => false),
            anySelectable: computed(() => true),
            headerCells: shallowRef([]),
            loading: ref(false),
            draggable: ref(false),
            primary: ref(false),
            isItemSelected: (item: VsTableItem) => selectedSet.has(item),
            toggleSelect: (item: VsTableItem) => selectedSet.add(item),
            toggleSelectAll: () => undefined,
            selectedAll: computed(() => false),
            selectedPartial: computed(() => false),
            selectable: computed(() => () => true),
            state: computed(() => () => 'idle'),
            items: ref(items),
            columns: computed(() => [{ key: 'name', label: 'name' }]),
        };

        // extends는 setup을 상속하지 않으므로 원본 setup을 직접 호출한다.
        const CountingRow = defineComponent({
            name: 'CountingRow',
            extends: VsTableBodyRow,
            setup(props: { row: VsTableRow; rowIdx: number }, ctx) {
                onBeforeUpdate(() => {
                    updateCount[props.row.key] += 1;
                });
                return VsTableBodyRow.setup!(props as never, ctx);
            },
        });

        const mountRow = (row: VsTableRow, rowIdx: number) =>
            mount(CountingRow, {
                props: { row, rowIdx },
                global: {
                    provide: {
                        [TABLE_COMPOSABLE_TOKEN]: table,
                        [TABLE_STYLE_SET_TOKEN]: computed(() => ({})),
                        [TABLE_COLOR_SCHEME_TOKEN]: computed(() => undefined),
                        [TABLE_SIZE_TOKEN]: ref('md'),
                    },
                    stubs: {
                        'vs-checkbox': true,
                        'vs-skeleton': true,
                    },
                },
            });

        const first = mountRow(createRow(items[0], 0), 0);
        const second = mountRow(createRow(items[1], 1), 1);

        selectedSet.add(items[0]);
        await nextTick();

        expect(first.classes()).toContain('vs-selected');
        expect(second.classes()).not.toContain('vs-selected');
        expect(updateCount['1']).toBe(1);
        expect(updateCount['2']).toBe(0);
    });
});
