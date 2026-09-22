import { describe, it, expect, vi } from 'vitest';
import { computed, nextTick, ref, type Ref } from 'vue';
import type { VsSearchInputRef } from '@/components/vs-search-input/types';
import { VsTable2SortType, type VsTable2ColumnDef, type VsTable2Item, type VsTable2ItemKey } from './../types';
import { getCellValue, useTableColumnComposable } from './../composables/table-column-composable';
import { useTableDragComposable } from './../composables/table-drag-composable';
import { useTableExpandComposable } from './../composables/table-expand-composable';
import { useTableItemKeyComposable } from './../composables/table-item-key-composable';
import { useTablePaginationComposable } from './../composables/table-pagination-composable';
import { useTableSearchComposable } from './../composables/table-search-composable';
import { useTableSelectionComposable } from './../composables/table-selection-composable';
import { useTableSortComposable } from './../composables/table-sort-composable';

const alice = { id: '1', name: 'Alice', age: 24 };
const bob = { id: '2', name: 'Bob', age: 30 };

// VsSearchInput.match()에 필터를 위임하므로, 검색어를 들고 있는 최소 구현으로 대신한다
function createSearchInputRef(searchText = '') {
    const text = ref(searchText);
    const searchInput = {
        get searchText() {
            return text.value;
        },
        match: (target: string) => !text.value || target.toLowerCase().includes(text.value.toLowerCase()),
    };
    return { searchInputRef: ref(searchInput) as unknown as Ref<VsSearchInputRef | null>, text };
}

describe('useTableItemKeyComposable', () => {
    it('itemKey가 문자열이면 해당 필드 값을 key로 쓴다', () => {
        const { getItemKey } = useTableItemKeyComposable(ref('id') as Ref<VsTable2ItemKey>);

        expect(getItemKey(alice)).toBe('1');
    });

    it('itemKey가 함수면 함수 결과를 key로 쓴다', () => {
        const { getItemKey } = useTableItemKeyComposable(
            ref((item: VsTable2Item) => `row-${item.id}`) as Ref<VsTable2ItemKey>,
        );

        expect(getItemKey(alice)).toBe('row-1');
    });

    it('itemKey가 없으면 같은 아이템 객체에 같은 key를 유지한다', () => {
        const { getItemKey } = useTableItemKeyComposable(ref(undefined));

        expect(getItemKey(alice)).toBe(getItemKey(alice));
        expect(getItemKey(alice)).not.toBe(getItemKey({ ...alice }));
    });

    it('itemKey 필드 값이 비어 있으면 객체 기준 key로 대체한다', () => {
        const { getItemKey } = useTableItemKeyComposable(ref('missing') as Ref<VsTable2ItemKey>);
        const item = { name: 'Alice' };

        expect(getItemKey(item)).toBe(getItemKey(item));
        expect(getItemKey(item)).toBeTypeOf('string');
    });

    it('itemKey 필드 값이 string | number가 아니면 객체 기준 key로 대체한다', () => {
        const { getItemKey } = useTableItemKeyComposable(ref('meta') as Ref<VsTable2ItemKey>);
        const item = { meta: { id: '1' } };

        expect(getItemKey(item)).toBe(getItemKey(item));
        expect(getItemKey(item)).toBeTypeOf('string');
    });

    it('itemKey 함수 결과가 string | number가 아니면 객체 기준 key로 대체한다', () => {
        const { getItemKey } = useTableItemKeyComposable(
            ref((item: VsTable2Item) => item.meta) as unknown as Ref<VsTable2ItemKey>,
        );
        const item = { meta: { id: '1' } };

        expect(getItemKey(item)).toBe(getItemKey(item));
        expect(getItemKey(item)).toBeTypeOf('string');
    });
});

describe('useTableColumnComposable', () => {
    const handleColumns = { drag: ref(false), select: ref(false), expand: ref(false) };

    it('문자열 컬럼을 ColumnDef로 변환한다', () => {
        const { columns } = useTableColumnComposable(ref(['name', 'age']), ref([]), handleColumns);

        expect(columns.value).toEqual([
            { key: 'name', label: 'name' },
            { key: 'age', label: 'age' },
        ]);
    });

    it('컬럼 정의가 없으면 첫 아이템의 키로 컬럼을 만든다', () => {
        const { columns } = useTableColumnComposable(ref([]), ref([alice]), handleColumns);

        expect(columns.value.map((column) => column.key)).toEqual(['id', 'name', 'age']);
    });

    it('width / minWidth / maxWidth를 grid 트랙으로 변환한다', () => {
        const columnDefs: VsTable2ColumnDef[] = [
            { key: 'a', label: 'a', width: 120 },
            { key: 'b', label: 'b', minWidth: '5rem' },
            { key: 'c', label: 'c', maxWidth: '10rem' },
            { key: 'd', label: 'd', minWidth: '5rem', maxWidth: '10rem' },
            { key: 'e', label: 'e' },
        ];
        const { gridTemplateColumns } = useTableColumnComposable(ref(columnDefs), ref([]), handleColumns);

        expect(gridTemplateColumns.value).toBe(
            '120px minmax(5rem, 1fr) minmax(auto, 10rem) minmax(5rem, 10rem) minmax(max-content, 1fr)',
        );
    });

    it('drag / select / expand 트랙을 필요한 경우에만 추가한다', () => {
        const { gridTemplateColumns } = useTableColumnComposable(ref(['name']), ref([]), {
            drag: ref(true),
            select: ref(true),
            expand: ref(true),
        });

        expect(gridTemplateColumns.value).toBe('auto auto minmax(max-content, 1fr) auto');
    });
});

describe('getCellValue', () => {
    it('중첩 경로 키를 읽는다', () => {
        expect(getCellValue({ metadata: { email: 'a@b.c' } }, { key: 'metadata.email', label: 'Email' })).toBe('a@b.c');
    });

    it('transform이 있으면 변환 결과를 반환한다', () => {
        const column: VsTable2ColumnDef = {
            key: 'age',
            label: 'Age',
            transform: (value, item) => `${item.name} ${value}세`,
        };

        expect(getCellValue(alice, column)).toBe('Alice 24세');
    });
});

describe('useTableSearchComposable', () => {
    const columns = computed<VsTable2ColumnDef[]>(() => [
        { key: 'name', label: '이름' },
        { key: 'age', label: '나이', transform: (value) => `${value}세` },
        { key: 'memo', label: '메모', skipSearch: true },
    ]);
    const items = ref<VsTable2Item[]>([
        { ...alice, memo: 'hidden', tags: 'vip' },
        { ...bob, memo: 'shown', tags: 'normal' },
    ]);

    it('검색어가 없으면 모든 아이템을 그대로 반환한다', () => {
        const { searchInputRef } = createSearchInputRef();
        const { searchedItems } = useTableSearchComposable(searchInputRef, ref(true), columns, items);

        expect(searchedItems.value).toBe(items.value);
    });

    it('검색어와 일치하는 아이템만 남긴다', () => {
        const { searchInputRef, text } = createSearchInputRef();
        const { searchedItems } = useTableSearchComposable(searchInputRef, ref(true), columns, items);

        text.value = 'bob';

        expect(searchedItems.value.map((item) => item.name)).toEqual(['Bob']);
    });

    it('transform이 적용된 렌더 값으로 검색한다', () => {
        const { searchInputRef, text } = createSearchInputRef();
        const { searchedItems } = useTableSearchComposable(searchInputRef, ref(true), columns, items);

        text.value = '24세';

        expect(searchedItems.value.map((item) => item.name)).toEqual(['Alice']);
    });

    it('skipSearch 컬럼의 값으로는 검색되지 않는다', () => {
        const { searchInputRef, text } = createSearchInputRef();
        const { searchedItems } = useTableSearchComposable(searchInputRef, ref(true), columns, items);

        text.value = 'hidden';

        expect(searchedItems.value).toEqual([]);
    });

    it('컬럼으로 정의되지 않은 필드는 검색 대상이 아니다', () => {
        const { searchInputRef, text } = createSearchInputRef();
        const { searchedItems } = useTableSearchComposable(searchInputRef, ref(true), columns, items);

        text.value = 'vip';

        expect(searchedItems.value).toEqual([]);
    });

    it('extraKeys에 지정한 필드는 검색 대상에 포함된다', () => {
        const { searchInputRef, text } = createSearchInputRef();
        const { searchedItems } = useTableSearchComposable(
            searchInputRef,
            ref({ extraKeys: ['tags'] }),
            columns,
            items,
        );

        text.value = 'vip';

        expect(searchedItems.value.map((item) => item.name)).toEqual(['Alice']);
    });

    it('skipSearch 컬럼의 하위 경로는 extraKeys로도 되살아나지 않는다', () => {
        const { searchInputRef, text } = createSearchInputRef();
        const nestedColumns = computed<VsTable2ColumnDef[]>(() => [
            { key: 'name', label: '이름' },
            { key: 'secret', label: '비밀', skipSearch: true },
        ]);
        const nestedItems = ref<VsTable2Item[]>([{ name: 'Alice', secret: { code: 'classified' } }]);
        const { searchedItems } = useTableSearchComposable(
            searchInputRef,
            ref({ extraKeys: ['secret.code'] }),
            nestedColumns,
            nestedItems,
        );

        text.value = 'classified';

        expect(searchedItems.value).toEqual([]);
    });

    it('객체 · 클래스 인스턴스 · Date는 내부 값까지 펼쳐 검색한다', () => {
        class Profile {
            constructor(public nickname: string) {}
        }
        const { searchInputRef, text } = createSearchInputRef();
        const objectColumns = computed<VsTable2ColumnDef[]>(() => [
            { key: 'profile', label: 'P' },
            { key: 'joinedAt', label: 'D' },
        ]);
        const objectItems = ref<VsTable2Item[]>([
            { profile: new Profile('ally'), joinedAt: new Date('2024-01-02T03:04:05.000Z') },
        ]);
        const { searchedItems } = useTableSearchComposable(searchInputRef, ref(true), objectColumns, objectItems);

        text.value = 'ally';
        expect(searchedItems.value).toHaveLength(1);

        text.value = '2024-01-02';
        expect(searchedItems.value).toHaveLength(1);
    });

    it('순환 참조가 있어도 검색이 동작하고 함수 값은 제외한다', () => {
        const circular: Record<string, unknown> = { name: 'Alice' };
        circular.self = circular;

        const { searchInputRef, text } = createSearchInputRef();
        const circularColumns = computed<VsTable2ColumnDef[]>(() => [
            { key: 'circular', label: 'C' },
            { key: 'run', label: 'R' },
        ]);
        const circularItems = ref<VsTable2Item[]>([{ circular, run: () => 'secret' }]);
        const { searchedItems } = useTableSearchComposable(searchInputRef, ref(true), circularColumns, circularItems);

        text.value = 'Alice';
        expect(searchedItems.value).toHaveLength(1);

        text.value = 'secret';
        expect(searchedItems.value).toEqual([]);
    });

    it('extraKeys를 제외한 옵션만 검색 입력에 전달한다', () => {
        const { searchInputRef } = createSearchInputRef();
        const { searchOptions } = useTableSearchComposable(
            searchInputRef,
            ref({ extraKeys: ['tags'], placeholder: 'find' }),
            columns,
            items,
        );

        expect(searchOptions.value).toEqual({ useCaseSensitive: true, useRegex: true, placeholder: 'find' });
    });
});

describe('useTableSortComposable', () => {
    const columns = computed<VsTable2ColumnDef[]>(() => [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: '이름', sortable: true, sortBy: 'age' },
    ]);
    const items = computed<VsTable2Item[]>(() => [bob, alice]);

    it('정렬 전에는 원본 순서를 유지한다', () => {
        const { sortedItems } = useTableSortComposable(columns, items);

        expect(sortedItems.value).toBe(items.value);
    });

    it('오름차순 → 내림차순 → 해제 순으로 순환한다', () => {
        const { sort, sortedItems, updateSort } = useTableSortComposable(columns, items);

        updateSort('id');
        expect(sort.value.type).toBe(VsTable2SortType.ASCEND);
        expect(sortedItems.value.map((item) => item.name)).toEqual(['Alice', 'Bob']);

        updateSort('id');
        expect(sort.value.type).toBe(VsTable2SortType.DESCEND);
        expect(sortedItems.value.map((item) => item.name)).toEqual(['Bob', 'Alice']);

        updateSort('id');
        expect(sort.value.type).toBe(VsTable2SortType.NONE);
        expect(sortedItems.value.map((item) => item.name)).toEqual(['Bob', 'Alice']);
    });

    it('다른 컬럼을 누르면 그 컬럼 기준 오름차순으로 시작한다', () => {
        const { sort, sortedItems, updateSort } = useTableSortComposable(columns, items);

        updateSort('id');
        updateSort('name');

        expect(sort.value).toEqual({ key: 'name', type: VsTable2SortType.ASCEND });
        // name 컬럼은 sortBy로 age를 쓴다
        expect(sortedItems.value.map((item) => item.age)).toEqual([24, 30]);
    });

    it('정의되지 않은 컬럼 키는 무시한다', () => {
        const { sort, updateSort } = useTableSortComposable(columns, items);

        updateSort('unknown');

        expect(sort.value).toEqual({ key: '', type: VsTable2SortType.NONE });
    });
});

describe('useTableDragComposable', () => {
    it('드래그한 순서를 화면 순서로 유지한다', () => {
        const items = ref<VsTable2Item[]>([alice, bob]);
        const sortedItems = computed(() => items.value);
        const { viewItems, setDragOrder } = useTableDragComposable(sortedItems, items);

        setDragOrder([bob, alice], 0);

        expect(viewItems.value).toEqual([bob, alice]);
    });

    it('페이지 시작 위치부터 그 페이지 자리 안에서만 순서를 바꾼다', () => {
        const items = ref<VsTable2Item[]>([{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }]);
        const sortedItems = computed(() => items.value);
        const { viewItems, setDragOrder } = useTableDragComposable(sortedItems, items);

        setDragOrder([items.value[3], items.value[2]], 2);

        expect(viewItems.value.map((item) => item.id)).toEqual(['1', '2', '4', '3']);
    });

    it('아이템이 바뀌면 드래그 순서를 버린다', async () => {
        const items = ref<VsTable2Item[]>([alice, bob]);
        const sortedItems = computed(() => items.value);
        const { viewItems, setDragOrder } = useTableDragComposable(sortedItems, items);

        setDragOrder([bob, alice], 0);
        expect(viewItems.value).toEqual([bob, alice]);

        items.value = [alice, bob];
        await nextTick();

        expect(viewItems.value).toEqual([alice, bob]);
    });
});

describe('useTableSelectionComposable', () => {
    const getItemKey = (item: VsTable2Item) => item.id;

    it('selectable이 false면 선택 가능한 행이 없다', () => {
        const { anySelectable } = useTableSelectionComposable(ref(false), ref([]), ref([alice, bob]), getItemKey);

        expect(anySelectable.value).toBe(false);
    });

    it('아이템을 선택하고 해제한다', () => {
        const { selectedItems, isSelected, selectItem } = useTableSelectionComposable(
            ref(true),
            ref([]),
            ref([alice, bob]),
            getItemKey,
        );

        expect(selectItem(alice, 0, true)).toBe(true);
        expect(selectedItems.value).toEqual([alice]);
        expect(isSelected(alice)).toBe(true);

        selectItem(alice, 0, false);
        expect(selectedItems.value).toEqual([]);
    });

    it('selectable 조건을 만족하지 않으면 선택하지 않는다', () => {
        const selectable = (item: VsTable2Item) => item.name === 'Bob';
        const { selectedItems, selectItem } = useTableSelectionComposable(
            ref(selectable),
            ref([]),
            ref([alice, bob]),
            getItemKey,
        );

        expect(selectItem(alice, 0, true)).toBe(false);
        expect(selectedItems.value).toEqual([]);
    });

    it('전체 선택은 선택 가능한 아이템만 담는다', () => {
        const selectable = (item: VsTable2Item) => item.name !== 'Bob';
        const { selectedItems, selectedAll, selectedPartial, selectAll } = useTableSelectionComposable(
            ref(selectable),
            ref([]),
            ref([alice, bob]),
            getItemKey,
        );

        selectAll(true);

        expect(selectedItems.value).toEqual([alice]);
        expect(selectedAll.value).toBe(true);
        expect(selectedPartial.value).toBe(false);

        selectAll(false);
        expect(selectedItems.value).toEqual([]);
    });

    it('선택 아이템이 일부면 partial 상태가 된다', () => {
        const { selectedPartial, selectItem } = useTableSelectionComposable(
            ref(true),
            ref([]),
            ref([alice, bob]),
            getItemKey,
        );

        selectItem(alice, 0, true);

        expect(selectedPartial.value).toBe(true);
    });

    it('selectedItems prop이 바뀌면 내부 상태를 맞춘다', async () => {
        const rawSelectedItems = ref<VsTable2Item[]>([]);
        const { selectedItems } = useTableSelectionComposable(
            ref(true),
            rawSelectedItems,
            ref([alice, bob]),
            getItemKey,
        );

        rawSelectedItems.value = [bob];
        await nextTick();

        expect(selectedItems.value).toEqual([bob]);
    });
});

describe('useTableExpandComposable', () => {
    const getItemKey = (item: VsTable2Item) => item.id;

    it('아이템을 펼치고 접는다', () => {
        const { isExpanded, expandItem } = useTableExpandComposable(ref(true), ref([alice, bob]), getItemKey);

        expect(expandItem(alice, 0, true)).toBe(true);
        expect(isExpanded(alice)).toBe(true);

        expandItem(alice, 0, false);
        expect(isExpanded(alice)).toBe(false);
    });

    it('expandable 조건을 만족하지 않으면 펼치지 않는다', () => {
        const expandable = (item: VsTable2Item) => item.name === 'Bob';
        const { isExpanded, expandItem } = useTableExpandComposable(ref(expandable), ref([alice, bob]), getItemKey);

        expect(expandItem(alice, 0, true)).toBe(false);
        expect(isExpanded(alice)).toBe(false);
    });

    it('아이템이 없으면 확장 가능한 행도 없다', () => {
        const { anyExpandable } = useTableExpandComposable(ref(true), ref([]), getItemKey);

        expect(anyExpandable.value).toBe(false);
    });
});

describe('useTablePaginationComposable', () => {
    it('기본 page size로 페이지 범위를 계산한다', () => {
        const { page, pageSize, totalPages, pageStartIndex, pageEndIndex } = useTablePaginationComposable(
            ref(true),
            ref(undefined),
            ref(undefined),
            ref(false),
            computed(() => 120),
        );

        expect(page.value).toBe(0);
        expect(pageSize.value).toBe(50);
        expect(totalPages.value).toBe(3);
        expect(pageStartIndex.value).toBe(0);
        expect(pageEndIndex.value).toBe(50);
    });

    it('page prop이 바인딩되어 있어도 setter가 update를 알린다', () => {
        const updatePage = vi.fn();
        const rawPage = ref<number | undefined>(0);
        const { page } = useTablePaginationComposable(
            ref(true),
            rawPage,
            ref(10),
            ref(false),
            computed(() => 120),
            { updatePage, updatePageSize: vi.fn() },
        );

        page.value = 2;

        expect(updatePage).toHaveBeenCalledWith(2);
        // prop이 갱신되기 전까지는 prop 값을 유지한다
        expect(page.value).toBe(0);

        rawPage.value = 2;
        expect(page.value).toBe(2);
    });

    it('page size를 바꾸면 첫 페이지로 되돌린다', () => {
        const updatePage = vi.fn();
        const updatePageSize = vi.fn();
        const { page, pageSize } = useTablePaginationComposable(
            ref(true),
            ref(undefined),
            ref(undefined),
            ref(false),
            computed(() => 120),
            { updatePage, updatePageSize },
        );

        page.value = 2;
        pageSize.value = 100;

        expect(updatePageSize).toHaveBeenCalledWith(100);
        expect(updatePage).toHaveBeenLastCalledWith(0);
        expect(page.value).toBe(0);
        expect(pageSize.value).toBe(100);
    });

    it('pageSizeOptions의 첫 값을 기본 page size로 쓴다', () => {
        const { pageSize } = useTablePaginationComposable(
            ref({ pageSizeOptions: [{ label: '5', value: 5 }] }),
            ref(undefined),
            ref(undefined),
            ref(false),
            computed(() => 12),
        );

        expect(pageSize.value).toBe(5);
    });

    it('pageSize가 Infinity면 한 페이지에 모두 담는다', () => {
        const { totalPages, pageStartIndex, pageEndIndex } = useTablePaginationComposable(
            ref(true),
            ref(undefined),
            ref(Infinity),
            ref(false),
            computed(() => 120),
        );

        expect(totalPages.value).toBe(1);
        expect(pageStartIndex.value).toBe(0);
        expect(pageEndIndex.value).toBe(120);
    });

    it('서버 모드에서는 totalItemCount로 페이지를 계산한다', () => {
        const { totalCount, totalPages, pageEndIndex } = useTablePaginationComposable(
            ref({ totalItemCount: 95 }),
            ref(1),
            ref(10),
            ref(true),
            computed(() => 10),
        );

        expect(totalCount.value).toBe(95);
        expect(totalPages.value).toBe(10);
        expect(pageEndIndex.value).toBe(20);
    });

    it('서버 모드에서 totalItemCount가 없으면 페이지가 0이다', () => {
        const { totalPages } = useTablePaginationComposable(
            ref(true),
            ref(undefined),
            ref(10),
            ref(true),
            computed(() => 10),
        );

        expect(totalPages.value).toBe(0);
    });
});
