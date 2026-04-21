> For English documentation, see [README.md](./README.md).

# VsTable

정렬, 검색, 페이지네이션, 선택, 드래그 앤 드롭, 확장 행을 지원하는 기능이 풍부한 데이터 테이블 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 컬럼 정렬, 내장 검색, 페이지네이션 (클라이언트/서버 모드)
- 행 선택 (단일/다중) 및 확장 행 패널
- SortableJS를 통한 드래그 앤 드롭 행 재정렬
- 자동 레이아웃 동기화를 지원하는 스티키 헤더
- 대용량 데이터를 위한 `VsVisibleRender` 가상 스크롤
- 작은 화면에서 컬럼을 세로로 쌓는 반응형 레이아웃

## 기본 사용법

```html
<template>
    <vs-table :columns="columns" :items="items" />
</template>

<script setup>
const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age' },
];
const items = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
];
</script>
```

### 검색 및 페이지네이션

```html
<template>
    <vs-table :columns="columns" :items="items" search pagination />
</template>
```

### 행 선택

```html
<template>
    <vs-table
        :columns="columns"
        :items="items"
        selectable
        v-model:selected-items="selected"
    />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref([]);
</script>
```

### 확장 행

```html
<template>
    <vs-table :columns="columns" :items="items" expandable>
        <template #expand="{ item }">
            <div>{{ item.detail }}</div>
        </template>
    </vs-table>
</template>
```

### 서버 모드

```html
<template>
    <vs-table
        :columns="columns"
        :items="pagedItems"
        server-mode
        :pagination="{ totalItemCount: totalCount }"
        v-model:page="page"
        v-model:page-size="pageSize"
        @paginate="fetchData"
    />
</template>
```

## Props

| Prop              | 타입                                           | 기본값   | 설명                                    |
| ----------------- | ---------------------------------------------- | -------- | --------------------------------------- |
| `colorScheme`     | `string`                                       |          | 컴포넌트 색상 스키마                    |
| `styleSet`        | `string \| VsTableStyleSet`                    |          | 컴포넌트 커스텀 스타일 세트             |
| `columns`         | `VsTableColumnDef[] \| string[]`               | `[]`     | 컬럼 정의                               |
| `items`           | `VsTableItem[]`                                | `[]`     | 데이터 행                               |
| `dense`           | `boolean`                                      | `false`  | 셀 패딩 축소                            |
| `draggable`       | `boolean`                                      | `false`  | 드래그 앤 드롭 행 재정렬 활성화         |
| `expandable`      | `boolean \| (item, index?, items?) => boolean` | `false`  | 확장 행 활성화                          |
| `loading`         | `boolean`                                      | `false`  | 로딩 상태 표시 및 검색 비활성화         |
| `noVirtualScroll` | `boolean`                                      | `false`  | 가상 스크롤 최적화 비활성화             |
| `page`            | `number`                                       |          | 현재 페이지 인덱스(0부터 시작), v-model |
| `pageSize`        | `number`                                       | `10`     | 페이지당 행 수, v-model                 |
| `pagedItems`      | `VsTableItem[]`                                | `[]`     | 서버 모드 현재 페이지 아이템, v-model   |
| `pagination`      | `boolean \| VsTablePaginationOptions`          | `false`  | 페이지네이션 활성화                     |
| `primary`         | `boolean`                                      | `false`  | 헤더에 기본 색상 적용                   |
| `responsive`      | `boolean`                                      | `false`  | 반응형(스택) 레이아웃 활성화            |
| `search`          | `boolean \| SearchProps`                       | `false`  | 내장 검색 활성화                        |
| `selectable`      | `boolean \| (item, index?, items?) => boolean` | `false`  | 행 선택 활성화                          |
| `selectedItems`   | `VsTableItem[]`                                | `[]`     | 선택된 행, v-model                      |
| `serverMode`      | `boolean`                                      | `false`  | 서버 측 페이지네이션 모드로 전환        |
| `state`           | `UIState \| (item, index?, items?) => UIState` | `'idle'` | 행 스타일링을 위한 UI 상태              |
| `stickyHeader`    | `boolean`                                      | `false`  | 스크롤 시 테이블 헤더 고정              |
| `totalItems`      | `VsTableItem[]`                                | `[]`     | 서버 모드 전체 아이템, v-model          |

## 타입

```typescript
interface VsTableStyleSet {
    component?: CSSProperties;
    toolbar?: CSSProperties;
    search?: VsSearchInputStyleSet;
    header?: CSSProperties;
    row?: CSSProperties;
    selectedRow?: CSSProperties;
    cell?: CSSProperties;
}

interface VsTableColumnDef<I = VsTableItem> {
    key: VsTableColumnKey<I>;
    label: string;
    headerAlign?: TextAlignment;
    align?: TextAlignment;
    verticalAlign?: VerticalAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    sortable?: boolean;
    sortBy?: VsTableColumnKey<I>;
    skipSearch?: boolean;
    transform?: (value: unknown, item: I) => unknown;
}

interface VsTablePaginationOptions {
    pageSizeOptions?: VsTablePageSizeOptions;
    showPageSizeSelect?: boolean;
    showingLength?: number;
    edgeButtons?: boolean;
    showTotal?: boolean;
    totalItemCount?: number;
}
```

### StyleSet 예시

```html
<template>
    <vs-table
        :columns="columns"
        :items="items"
        :style-set="{
            component: { borderRadius: '0.5rem', overflow: 'hidden' },
            header: { fontSize: '0.875rem', fontWeight: 700 },
            row: { height: '3rem' },
            selectedRow: { backgroundColor: '#e3f2fd' },
            cell: { padding: '0.5rem 1rem' },
        }"
    />
</template>
```

## 이벤트

| 이벤트                 | 페이로드                                      | 설명                             |
| ---------------------- | --------------------------------------------- | -------------------------------- |
| `click-cell`           | `(cell: VsTableBodyCell, event: MouseEvent)`  | 셀 클릭 시 발생                  |
| `select-row`           | `(row: VsTableBodyCell[], event: MouseEvent)` | 행 선택 시 발생                  |
| `expand-row`           | `(row: VsTableBodyCell[], event: MouseEvent)` | 행 확장 시 발생                  |
| `drag`                 | `SortableEvent`                               | 드래그 앤 드롭 재정렬 후 발생    |
| `search`               | `(items: VsTableItem[], searchText: string)`  | 검색 시 발생                     |
| `paginate`             | `(nextPage: number, pageSize: number)`        | 페이지 변경 시 발생              |
| `update:selectedItems` | `VsTableItem[]`                               | 선택된 행 변경 시 발생           |
| `update:page`          | `number`                                      | 현재 페이지 변경 시 발생         |
| `update:pageSize`      | `number`                                      | 페이지 크기 변경 시 발생         |
| `update:pagedItems`    | `VsTableItem[]`                               | 페이징된 아이템 업데이트 시 발생 |
| `update:totalItems`    | `VsTableItem[]`                               | 전체 아이템 업데이트 시 발생     |

## 슬롯

| 슬롯           | 설명                                                           |
| -------------- | -------------------------------------------------------------- |
| `toolbar`      | 검색 입력창 왼쪽 영역; 액션 버튼이나 커스텀 컨트롤 배치에 사용 |
| `caption`      | 테이블 캡션 내용                                               |
| `header-[key]` | 특정 컬럼 키의 커스텀 헤더 셀                                  |
| `body-[key]`   | 특정 컬럼 키의 커스텀 바디 셀                                  |
| `select`       | 선택 컬럼 셀의 커스텀 내용                                     |
| `expand`       | 확장 행 패널의 커스텀 내용                                     |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |
