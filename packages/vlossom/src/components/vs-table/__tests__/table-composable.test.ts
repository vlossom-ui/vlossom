import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick, reactive, ref, type Ref } from 'vue';
import { stringUtil } from '@/utils';
import type { VsSearchInputRef } from '@/components';

import { useTable } from './../composables/table-composable';
import {
    VsTableSortType,
    type VsTableColumnDef,
    type VsTableHeaderCell,
    type VsTableItem,
    type VsTablePaginationOptions,
    type VsTableSearchOptions,
} from './../types';
import { DEFAULT_PAGE_SIZE } from './../constants';

function setupUseTable(
    props: {
        columns: VsTableColumnDef[] | string[] | null;
        items: VsTableItem[];
        selectable?: ((item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean) | boolean;
        expandable?: ((item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean) | boolean;
        pagination?: boolean | VsTablePaginationOptions;
        search?: boolean | VsTableSearchOptions;
        page?: number;
        pageSize?: number;
        serverMode?: boolean;
    },
    options?: { searchInputRef?: Ref<VsSearchInputRef | null>; hasExpandSlot?: Ref<boolean> },
) {
    const reactiveProps = reactive(props);
    const searchInputRef = options?.searchInputRef ?? ref<VsSearchInputRef | null>(null);
    const hasExpandSlot = options?.hasExpandSlot ?? ref(false);
    const table = useTable('test-table-id', reactiveProps as any, { searchInputRef, hasExpandSlot } as any);
    table.initialize();
    return { table, reactiveProps, searchInputRef };
}

describe('useTable', () => {
    beforeEach(() => {
        let seq = 0;
        vi.spyOn(stringUtil, 'createID').mockImplementation(() => `id-${seq++}`);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('문자열 컬럼을 ColumnDef 배열로 변환한다', async () => {
        const { table } = setupUseTable({
            columns: ['name', 'age'],
            items: [{ id: '1', name: 'Alice', age: 24 }],
        });

        await nextTick();

        const columns = table.columns.value as VsTableColumnDef[] | null;
        expect(columns).toEqual([
            { key: 'name', label: 'name' },
            { key: 'age', label: 'age' },
        ]);
    });

    it('초기 마운트 시 헤더/바디 셀을 생성한다', async () => {
        const columns: VsTableColumnDef[] = [
            { key: 'name', label: '이름' },
            { key: 'age', label: '나이' },
        ];
        const items = [
            { id: '1', name: 'Alice', age: 24 },
            { id: '2', name: 'Bob', age: 30 },
        ];
        const { table } = setupUseTable({ columns, items });

        await nextTick();

        const headerCells = table.headerCells.value as VsTableHeaderCell[];
        const bodyRows = table.bodyRows.value;

        expect(headerCells.map((h) => h.value)).toEqual(['이름', '나이']);
        expect(bodyRows).toHaveLength(2);
        expect(bodyRows[0].cells.map((cell) => cell.value)).toEqual(['Alice', 24]);
    });

    it('컬럼과 아이템 변경을 감지해 셀을 재생성한다', async () => {
        const { table, reactiveProps } = setupUseTable({
            columns: ['name'],
            items: [{ id: '1', name: 'Alice' }],
        });

        await nextTick();

        reactiveProps.columns = ['title'];
        reactiveProps.items = [{ id: '99', title: '새 항목' }];
        await nextTick();

        const columns = table.columns.value as VsTableColumnDef[] | null;
        const bodyRows = table.bodyRows.value;

        expect(columns?.map((c) => c.key)).toEqual(['title']);
        expect(bodyRows[0].cells[0]).toMatchObject({ value: '새 항목', colKey: 'title' });
    });

    it('아이템을 맨 앞에 추가해 인덱스가 밀려도 기존 행의 key가 유지된다', async () => {
        const alice = { id: '1', name: 'Alice' };
        const bob = { id: '2', name: 'Bob' };
        const { table, reactiveProps } = setupUseTable({ columns: ['name'], items: [alice, bob] });

        await nextTick();

        const aliceKey = table.bodyRows.value[0].key;
        const bobKey = table.bodyRows.value[1].key;

        reactiveProps.items = [{ id: '3', name: 'Carol' }, alice, bob];
        await nextTick();

        expect(table.bodyRows.value.map((row) => row.item.name)).toEqual(['Carol', 'Alice', 'Bob']);
        expect(table.bodyRows.value[1].key).toBe(aliceKey);
        expect(table.bodyRows.value[2].key).toBe(bobKey);
        expect(table.bodyRows.value[0].key).not.toBe(aliceKey);
    });

    it('선택 가능한 행이 있을 때 전체 선택/해제를 토글한다', async () => {
        const { table } = setupUseTable({
            columns: ['name'],
            items: [
                { id: '1', name: 'Alice' },
                { id: '2', name: 'Bob' },
            ],
            selectable: () => true,
        });

        await nextTick();

        expect(table.anySelectable.value).toBe(true);
        expect(table.selectedAll.value).toBe(false);

        table.toggleSelectAll();
        await nextTick();

        expect(table.selectedItems.value.map((item) => item.id)).toEqual(['1', '2']);
        expect(table.selectedAll.value).toBe(true);

        table.toggleSelectAll();
        await nextTick();

        expect(table.selectedItems.value).toEqual([]);
        expect(table.selectedAll.value).toBe(false);
    });

    it('selectable이 false인 행은 전체 선택에서 제외하고 부분 선택 상태를 계산한다', async () => {
        const { table } = setupUseTable({
            columns: null,
            items: [
                { id: '1', name: 'Alice' },
                { id: '2', name: 'Bob' },
                { id: '3', name: 'Carol' },
            ],
            selectable: (item) => item.id !== '2',
        });

        await nextTick();

        table.toggleSelectAll();
        await nextTick();

        expect(table.selectedItems.value.map((item) => item.id)).toEqual(['1', '3']);
        expect(table.selectedAll.value).toBe(true);

        table.selectedItems.value = [table.items.value.find((item) => item.id === '1')!];
        await nextTick();

        expect(table.selectedPartial.value).toBe(true);
        expect(table.selectedAll.value).toBe(false);
    });

    describe('search', () => {
        function matchXYZ(searchInputRef: Ref<VsSearchInputRef | null>) {
            searchInputRef.value = {
                match: (value: string) => String(value).includes('XYZ'),
            } as any;
        }

        it('skipSearch가 지정된 컬럼은 검색 대상에서 제외된다', async () => {
            const { table, searchInputRef } = setupUseTable({
                columns: [
                    { key: 'id', label: 'ID', skipSearch: true },
                    { key: 'name', label: '이름' },
                ],
                items: [
                    { id: 'XYZ-1', name: 'Carol' },
                    { id: 'ABC-2', name: 'XYZ 사용자' },
                ],
            });
            await nextTick();

            matchXYZ(searchInputRef);
            await nextTick();

            const filteredNames = table.bodyRows.value.map((row) => row.cells[1].value);
            expect(filteredNames).toEqual(['XYZ 사용자']);
        });

        it('중첩 키 컬럼에 지정된 skipSearch도 검색 대상에서 제외된다', async () => {
            const { table, searchInputRef } = setupUseTable({
                columns: [
                    { key: 'name', label: '이름' },
                    { key: 'metadata.email', label: '이메일', skipSearch: true },
                ],
                items: [
                    { name: 'Carol', metadata: { email: 'XYZ@example.com' } },
                    { name: 'XYZ 사용자', metadata: { email: 'bob@example.com' } },
                ],
            });
            await nextTick();

            matchXYZ(searchInputRef);
            await nextTick();

            expect(table.bodyRows.value.map((row) => row.cells[0].value)).toEqual(['XYZ 사용자']);
        });

        it('컬럼으로 정의되지 않은 필드는 검색 대상에 포함되지 않는다', async () => {
            const { table, searchInputRef } = setupUseTable({
                columns: [{ key: 'name', label: '이름' }],
                items: [
                    { name: 'Carol', memo: 'XYZ 메모' },
                    { name: 'XYZ 사용자', memo: '' },
                ],
            });
            await nextTick();

            matchXYZ(searchInputRef);
            await nextTick();

            expect(table.bodyRows.value.map((row) => row.cells[0].value)).toEqual(['XYZ 사용자']);
        });

        it('search.extraKeys에 지정한 필드는 컬럼이 없어도 검색 대상에 포함된다', async () => {
            const { table, searchInputRef } = setupUseTable({
                columns: [{ key: 'name', label: '이름' }],
                items: [
                    { name: 'Carol', memo: 'XYZ 메모' },
                    { name: 'Bob', memo: '' },
                ],
                search: { extraKeys: ['memo'] },
            });
            await nextTick();

            matchXYZ(searchInputRef);
            await nextTick();

            expect(table.bodyRows.value.map((row) => row.cells[0].value)).toEqual(['Carol']);
        });

        it('skipSearch와 extraKeys가 같은 키를 가리키면 skipSearch가 우선한다', async () => {
            const { table, searchInputRef } = setupUseTable({
                columns: [
                    { key: 'name', label: '이름' },
                    { key: 'memo', label: '메모', skipSearch: true },
                ],
                items: [
                    { name: 'Carol', memo: 'XYZ 메모' },
                    { name: 'Bob', memo: '' },
                ],
                search: { extraKeys: ['memo'] },
            });
            await nextTick();

            matchXYZ(searchInputRef);
            await nextTick();

            expect(table.bodyRows.value).toHaveLength(0);
        });

        it('extraKeys에 중첩 키를 지정하면 해당 경로의 값으로 검색한다', async () => {
            const { table, searchInputRef } = setupUseTable({
                columns: [{ key: 'name', label: '이름' }],
                items: [
                    { name: 'Carol', memo: { content: 'XYZ 메모' } },
                    { name: 'Bob', memo: { content: '' } },
                ],
                search: { extraKeys: ['memo.content'] },
            });
            await nextTick();

            matchXYZ(searchInputRef);
            await nextTick();

            expect(table.bodyRows.value.map((row) => row.cells[0].value)).toEqual(['Carol']);
        });

        it('skipSearch 컬럼의 하위 경로는 extraKeys로도 되살아나지 않는다', async () => {
            const { table, searchInputRef } = setupUseTable({
                columns: [
                    { key: 'name', label: '이름' },
                    { key: 'memo', label: '메모', skipSearch: true },
                ],
                items: [
                    { name: 'Carol', memo: { content: 'XYZ 메모' } },
                    { name: 'Bob', memo: { content: '' } },
                ],
                search: { extraKeys: ['memo.content'] },
            });
            await nextTick();

            matchXYZ(searchInputRef);
            await nextTick();

            expect(table.bodyRows.value).toHaveLength(0);
        });

        it('transform이 적용된 렌더 값으로 검색한다', async () => {
            const { table, searchInputRef } = setupUseTable({
                columns: [
                    { key: 'name', label: '이름' },
                    { key: 'status', label: '상태', transform: (value: string) => (value === 'on' ? 'XYZ' : 'ABC') },
                ],
                items: [
                    { name: 'Carol', status: 'on' },
                    { name: 'Bob', status: 'off' },
                ],
            });
            await nextTick();

            matchXYZ(searchInputRef);
            await nextTick();

            expect(table.bodyRows.value.map((row) => row.cells[0].value)).toEqual(['Carol']);
        });
    });

    describe('pagination', () => {
        it('기본 옵션으로 페이지당 50개를 노출하고 총 페이지를 계산한다', async () => {
            const items = Array.from({ length: 120 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
            const { table } = setupUseTable({
                columns: ['name'],
                items,
                pagination: true,
            });

            await nextTick();

            expect(table.pageSize.value).toBe(DEFAULT_PAGE_SIZE);
            expect(table.bodyRows.value).toHaveLength(DEFAULT_PAGE_SIZE);
            expect(table.totalPages.value).toBe(3);
        });

        it('커스텀 옵션을 적용하고 페이지 크기 변경 시 현재 페이지를 초기화한다', async () => {
            const items = Array.from({ length: 60 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
            const { table, reactiveProps } = setupUseTable({
                columns: ['name'],
                items,
                pagination: {
                    pageSizeOptions: [
                        { label: '20 items', value: 20 },
                        { label: '50 items', value: 50 },
                        { label: '100 items', value: 100 },
                    ],
                    showingLength: 5,
                    edgeButtons: true,
                    showTotal: false,
                },
                pageSize: 20,
            });

            await nextTick();

            expect(table.pageSize.value).toBe(20);
            expect(table.totalPages.value).toBe(3);
            expect(table.bodyRows.value).toHaveLength(20);

            reactiveProps.page = 2;
            reactiveProps.pageSize = 10;
            await nextTick();

            expect(table.page.value).toBe(0);
            expect(table.pageSize.value).toBe(10);
            expect(table.totalPages.value).toBe(6);
            expect(table.bodyRows.value).toHaveLength(10);
        });

        describe('server mode', () => {
            it('서버 모드에서는 totalItemCount를 기반으로 총 페이지를 계산한다', async () => {
                const items = Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: {
                        totalItemCount: 500,
                    },
                    serverMode: true,
                    page: 0,
                    pageSize: 10,
                });

                await nextTick();

                expect(table.totalPages.value).toBe(Math.ceil(500 / 10));
                expect(table.bodyRows.value).toHaveLength(10);
            });

            it('서버 모드에서는 client-side pagination을 수행하지 않는다', async () => {
                const currentPageItems = Array.from({ length: 10 }, (_, i) => ({
                    id: `${20 + i}`,
                    name: `User ${20 + i}`,
                }));

                const { table } = setupUseTable({
                    columns: ['name'],
                    items: currentPageItems,
                    pagination: {
                        totalItemCount: 100,
                    },
                    serverMode: true,
                    page: 2,
                    pageSize: 10,
                });

                await nextTick();

                expect(table.bodyRows.value).toHaveLength(10);
                expect(table.bodyRows.value[0].cells[0].value).toBe('User 20');
                expect(table.bodyRows.value[9].cells[0].value).toBe('User 29');
            });

            it('서버 모드에서 totalItemCount가 없으면 총 페이지를 0으로 계산한다', async () => {
                const items = Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: true,
                    serverMode: true,
                    page: 0,
                    pageSize: 10,
                });

                await nextTick();

                expect(table.totalPages.value).toBe(0);
            });

            it('서버 모드에서 totalItemCount가 0이면 총 페이지를 0으로 계산한다', async () => {
                const items = Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: { totalItemCount: 0 },
                    serverMode: true,
                    page: 0,
                    pageSize: 10,
                });

                await nextTick();

                expect(table.totalPages.value).toBe(0);
            });

            it('서버 모드에서 pageSize 변경 시에도 totalItemCount 기반으로 총 페이지를 재계산한다', async () => {
                const items = Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const { table, reactiveProps } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: {
                        totalItemCount: 100,
                    },
                    serverMode: true,
                    page: 0,
                    pageSize: 10,
                });

                await nextTick();
                expect(table.totalPages.value).toBe(10);

                reactiveProps.pageSize = 25;
                await nextTick();

                expect(table.totalPages.value).toBe(4);
            });

            it('서버 모드에서 pageEndIndex가 totalItemCount 기반으로 올바르게 계산된다', async () => {
                const items = Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: {
                        totalItemCount: 500,
                    },
                    serverMode: true,
                    page: 0,
                    pageSize: 10,
                });

                await nextTick();
                expect(table.pageStartIndex.value).toBe(0);
                expect(table.pageEndIndex.value).toBe(10);
                expect(table.totalItems.value).toBe(500);
            });

            it('서버 모드에서 중간 페이지의 pageEndIndex가 올바르게 계산된다', async () => {
                const items = Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, name: `User ${i + 50}` }));
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: {
                        totalItemCount: 500,
                    },
                    serverMode: true,
                    page: 5,
                    pageSize: 10,
                });

                await nextTick();
                expect(table.pageStartIndex.value).toBe(50);
                expect(table.pageEndIndex.value).toBe(60);
                expect(table.totalItems.value).toBe(500);
            });

            it('서버 모드에서 마지막 페이지의 pageEndIndex가 totalItemCount를 초과하지 않는다', async () => {
                const items = Array.from({ length: 5 }, (_, i) => ({ id: `${i}`, name: `User ${i + 495}` }));
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: {
                        totalItemCount: 500,
                    },
                    serverMode: true,
                    page: 49,
                    pageSize: 10,
                });

                await nextTick();
                expect(table.pageStartIndex.value).toBe(490);
                expect(table.pageEndIndex.value).toBe(500);
                expect(table.totalItems.value).toBe(500);
            });
        });

        describe('pageSize Infinity (전체 데이터 표시)', () => {
            it('pageSize가 Infinity이면 모든 데이터를 1페이지에 표시한다', async () => {
                const items = Array.from({ length: 100 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: true,
                    page: 0,
                    pageSize: Infinity,
                });

                await nextTick();
                expect(table.pageStartIndex.value).toBe(0);
                expect(table.pageEndIndex.value).toBe(100);
                expect(table.totalItems.value).toBe(100);
                expect(table.totalPages.value).toBe(1);
            });

            it('pageSize가 Infinity일 때 bodyRows에 모든 아이템이 포함된다', async () => {
                const items = Array.from({ length: 50 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: true,
                    page: 0,
                    pageSize: Infinity,
                });

                await nextTick();
                expect(table.bodyRows.value.length).toBe(50);
                expect(table.bodyRows.value[0].cells[0].value).toBe('User 0');
                expect(table.bodyRows.value[49].cells[0].value).toBe('User 49');
            });

            it('서버 모드에서 pageSize가 Infinity이면 totalItemCount 기반으로 전체 데이터를 표시한다', async () => {
                const items = Array.from({ length: 10 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: {
                        totalItemCount: 1000,
                    },
                    serverMode: true,
                    page: 0,
                    pageSize: Infinity,
                });

                await nextTick();
                expect(table.pageStartIndex.value).toBe(0);
                expect(table.pageEndIndex.value).toBe(1000);
                expect(table.totalItems.value).toBe(1000);
                expect(table.totalPages.value).toBe(1);
            });
        });

        describe('사용자 정의 pageSizeOptions', () => {
            it('pageSize가 없으면 pageSizeOptions의 첫 번째 값을 초기 pageSize로 사용한다', async () => {
                const items = Array.from({ length: 30 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const customOptions = [
                    { label: '5 items', value: 5 },
                    { label: '10 items', value: 10 },
                    { label: '20 items', value: 20 },
                ];
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: {
                        pageSizeOptions: customOptions,
                        showPageSizeSelect: true,
                    },
                });

                await nextTick();

                expect(table.pageSize.value).toBe(5);
                expect(table.bodyRows.value).toHaveLength(5);
                expect(table.totalPages.value).toBe(6);
            });

            it('pageSize가 default 값(50)이어도 사용자가 지정한 pageSizeOptions를 그대로 사용한다', async () => {
                const items = Array.from({ length: 30 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const customOptions = [
                    { label: '5 items', value: 5 },
                    { label: '8 items', value: 8 },
                    { label: '10 items', value: 10 },
                    { label: 'All', value: Infinity },
                ];
                const { table } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: {
                        pageSizeOptions: customOptions,
                        showPageSizeSelect: true,
                    },
                    pageSize: DEFAULT_PAGE_SIZE,
                });

                await nextTick();
                expect(table.pagination.value.pageSizeOptions).toEqual(customOptions);
            });

            it('pageSize를 Infinity로 변경해도 사용자가 지정한 pageSizeOptions와 라벨이 유지된다', async () => {
                const items = Array.from({ length: 30 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const customOptions = [
                    { label: '5 items', value: 5 },
                    { label: '8 items', value: 8 },
                    { label: '10 items', value: 10 },
                    { label: 'All', value: Infinity },
                ];
                const { table, reactiveProps } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: {
                        pageSizeOptions: customOptions,
                        showPageSizeSelect: true,
                    },
                    pageSize: 5,
                });

                await nextTick();
                expect(table.pagination.value.pageSizeOptions).toEqual(customOptions);

                reactiveProps.pageSize = Infinity;
                await nextTick();

                expect(table.pagination.value.pageSizeOptions).toEqual(customOptions);
                expect(table.pageSize.value).toBe(Infinity);
            });

            it('pageSize를 옵션 내 다른 값으로 변경해도 pageSizeOptions가 유지된다', async () => {
                const items = Array.from({ length: 30 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
                const customOptions = [
                    { label: '5 items', value: 5 },
                    { label: '8 items', value: 8 },
                    { label: '10 items', value: 10 },
                ];
                const { table, reactiveProps } = setupUseTable({
                    columns: ['name'],
                    items,
                    pagination: {
                        pageSizeOptions: customOptions,
                        showPageSizeSelect: true,
                    },
                    pageSize: 5,
                });

                await nextTick();

                reactiveProps.pageSize = 8;
                await nextTick();

                expect(table.pagination.value.pageSizeOptions).toEqual(customOptions);
            });
        });
    });

    describe('expandable', () => {
        it('expandable이 true인 행은 토글 시 isExpanded가 변경된다', async () => {
            const { table } = setupUseTable({
                columns: ['name'],
                items: [{ id: '1', name: 'Alice' }],
                expandable: () => true,
            });

            await nextTick();
            const row = table.bodyRows.value[0].cells;

            expect(table.anyExpandable.value).toBe(true);
            expect(table.isExpanded(row)).toBe(false);

            expect(table.toggleExpand(row)).toBe(true);
            expect(table.isExpanded(row)).toBe(true);

            expect(table.toggleExpand(row)).toBe(false);
            expect(table.isExpanded(row)).toBe(false);
        });

        it('expandable 조건을 만족하지 않으면 토글되지 않는다', async () => {
            const { table } = setupUseTable({
                columns: ['name'],
                items: [{ id: '1', name: 'Alice' }],
                expandable: () => false,
            });

            await nextTick();
            const row = table.bodyRows.value[0].cells;

            expect(table.anyExpandable.value).toBe(false);
            expect(table.toggleExpand(row)).toBe(false);
            expect(table.isExpanded(row)).toBe(false);
        });
    });
    describe('정렬', () => {
        const sortableColumns: VsTableColumnDef[] = [
            { key: 'id', label: 'ID', sortable: true },
            { key: 'name', label: '이름', sortable: true },
        ];

        const getNames = (table: ReturnType<typeof useTable>) =>
            table.bodyRows.value.map((row) => row.cells[1].value);

        it('초기 상태는 NONE이며 원본 순서를 유지한다', async () => {
            const { table } = setupUseTable({
                columns: sortableColumns,
                items: [
                    { id: '2', name: 'Bob' },
                    { id: '1', name: 'Alice' },
                ],
            });
            await nextTick();

            expect(table.sortType.value).toBe(VsTableSortType.NONE);
            expect(getNames(table)).toEqual(['Bob', 'Alice']);
        });

        it('오름차순 정렬 시 작은 값이 먼저 온다', async () => {
            const { table } = setupUseTable({
                columns: sortableColumns,
                items: [
                    { id: '2', name: 'Bob' },
                    { id: '1', name: 'Alice' },
                ],
            });
            await nextTick();

            table.updateSortType('id');
            await nextTick();

            expect(table.sortType.value).toBe(VsTableSortType.ASCEND);
            expect(getNames(table)).toEqual(['Alice', 'Bob']);
        });

        it('내림차순 정렬 시 큰 값이 먼저 온다', async () => {
            const { table } = setupUseTable({
                columns: sortableColumns,
                items: [
                    { id: '1', name: 'Alice' },
                    { id: '2', name: 'Bob' },
                ],
            });
            await nextTick();

            table.updateSortType('id'); // ASCEND
            table.updateSortType('id'); // DESCEND
            await nextTick();

            expect(table.sortType.value).toBe(VsTableSortType.DESCEND);
            expect(getNames(table)).toEqual(['Bob', 'Alice']);
        });

        it('NONE으로 돌아오면 원본 순서로 복원된다', async () => {
            const { table } = setupUseTable({
                columns: sortableColumns,
                items: [
                    { id: '2', name: 'Bob' },
                    { id: '1', name: 'Alice' },
                ],
            });
            await nextTick();

            table.updateSortType('id'); // ASCEND
            table.updateSortType('id'); // DESCEND
            table.updateSortType('id'); // NONE
            await nextTick();

            expect(table.sortType.value).toBe(VsTableSortType.NONE);
            expect(getNames(table)).toEqual(['Bob', 'Alice']);
        });

        it('다른 컬럼 클릭 시 해당 컬럼 기준으로 정렬된다', async () => {
            const { table } = setupUseTable({
                columns: sortableColumns,
                items: [
                    { id: '1', name: 'Bob' },
                    { id: '2', name: 'Alice' },
                ],
            });
            await nextTick();

            table.updateSortType('name');
            await nextTick();

            expect(table.sortColumn.value?.key).toBe('name');
            expect(getNames(table)).toEqual(['Alice', 'Bob']);
        });
    });
});
