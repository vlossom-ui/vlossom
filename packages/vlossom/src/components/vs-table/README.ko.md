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

### 검색 범위

검색은 테이블 바디에 렌더링된 값을 대상으로 동작하므로, 컬럼의 `transform` 결과도 화면에 보이는 그대로 검색됩니다. 범위는 두 가지 옵션으로 조정합니다.

- 컬럼의 `skipSearch`: 렌더링되는 컬럼을 검색 대상에서 제외합니다.
- `search.extraKeys`: 어떤 컬럼으로도 렌더링되지 않는 아이템 필드를 검색 대상에 추가합니다. 슬롯으로 값을 다른 셀에 끌어와 보여주거나, 숨겨진 메타데이터로 필터링할 때 사용합니다.

```html
<template>
    <vs-table :columns="columns" :items="items" :search="{ extraKeys: ['tags'] }">
        <template #body-name="{ item }">{{ item.name }} ({{ item.tags }})</template>
    </vs-table>
</template>

<script setup>
const columns = [
    { key: 'name', label: 'Name' },
    { key: 'note', label: 'Note', skipSearch: true },
];
</script>
```

둘 다 컬럼 `key`와 동일하게 점 표기 경로(`'metadata.email'`)를 지원합니다. 어떤 키가 `skipSearch` 컬럼이거나 그 하위 경로이면, `extraKeys`에 있어도 제외가 우선합니다.

키가 객체나 배열을 가리키면 그 안의 중첩된 값까지 모두 검색하며, 클래스 인스턴스도 포함합니다. 자기 자신의 열거 가능한 속성만 검색하므로, 프로토타입 getter로 만든 값은 별도 키로 지정해야 합니다. 함수와 바이너리 값(`TypedArray`, `Blob`)은 검색에서 제외되고, `Date`는 ISO 문자열로 검색됩니다.

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

`expandable`은 기본값이 `true`이지만, 확장 UI(토글 버튼과 확장 패널)는 `expand` 슬롯이 제공된 경우에만 렌더링됩니다. 확장 기능 자체를 끄려면 `:expandable="false"`로 명시하세요.

```html
<template>
    <vs-table :columns="columns" :items="items">
        <template #expand="{ item }">
            <div>{{ item.detail }}</div>
        </template>
    </vs-table>
</template>
```

### 빈 상태

`items`가 비어있을 때 기본 "NO DATA" 자리표시자 대신 표시할 내용을 `empty` 슬롯으로 제공합니다. `loading`이 true이면 로딩 인디케이터가 이 슬롯보다 우선 표시됩니다.

```html
<template>
    <vs-table :columns="columns" :items="[]">
        <template #empty>
            <div>일치하는 결과가 없습니다.</div>
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
| `size`            | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`         | `'md'`   | 테이블 크기 — 셀 패딩/폰트 제어 및 검색 입력 · 페이지네이션(페이지 사이즈 셀렉트 포함) · 선택 체크박스로 전파 |
| `draggable`       | `boolean`                                      | `false`  | 드래그 앤 드롭 행 재정렬 활성화         |
| `expandable`      | `boolean \| (item, index?, items?) => boolean` | `true`   | 확장 행 활성화. `expand` 슬롯이 제공된 경우에만 확장 UI가 렌더링됩니다 |
| `loading`         | `boolean`                                      | `false`  | 로딩 상태 표시 및 검색 비활성화         |
| `noVirtualScroll` | `boolean`                                      | `false`  | 가상 스크롤 최적화 비활성화             |
| `page`            | `number`                                       |          | 현재 페이지 인덱스(0부터 시작), v-model |
| `pageSize`        | `number`                                       | `10`     | 페이지당 행 수, v-model                 |
| `pagedItems`      | `VsTableItem[]`                                | `[]`     | 서버 모드 현재 페이지 아이템, v-model   |
| `pagination`      | `boolean \| VsTablePaginationOptions`          | `false`  | 페이지네이션 활성화                     |
| `primary`         | `boolean`                                      | `false`  | 헤더에 기본 색상 적용                   |
| `responsive`      | `boolean`                                      | `false`  | 반응형(스택) 레이아웃 활성화            |
| `search`          | `boolean \| VsTableSearchOptions`              | `false`  | 내장 검색 활성화                        |
| `selectable`      | `boolean \| (item, index?, items?) => boolean` | `false`  | 행 선택 활성화                          |
| `selectedItems`   | `VsTableItem[]`                                | `[]`     | 선택된 행, v-model                      |
| `serverMode`      | `boolean`                                      | `false`  | 서버 측 페이지네이션 모드로 전환        |
| `state`           | `UIState \| (item, index?, items?) => UIState` | `'idle'` | 행 스타일링을 위한 UI 상태              |
| `stickyHeader`    | `boolean`                                      | `false`  | 스크롤 시 테이블 헤더 고정              |
| `totalItems`      | `VsTableItem[]`                                | `[]`     | 서버 모드 전체 아이템, v-model          |

## 타입

```typescript
interface VsTableStyleSet extends CSSProperties {
    $toolbar?: CSSProperties;
    $search?: VsSearchInputStyleSet;
    $caption?: CSSProperties;
    $header?: CSSProperties;
    $stickyHeaderTop?: string;
    $row?: CSSProperties & {
        $selected?: CSSProperties;
    };
    $cell?: CSSProperties;
    $pagination?: VsPaginationStyleSet;
    $pageSizeSelect?: VsSelectStyleSet;
}

interface VsTableSearchOptions<I = VsTableItem> {
    useRegex?: boolean;
    useCaseSensitive?: boolean;
    placeholder?: string;
    extraKeys?: VsTableColumnKey<I>[];
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
    transform?: (value: any, item: I) => unknown;
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
            borderRadius: '0.5rem', overflow: 'hidden',
            $header: { fontSize: '0.875rem', fontWeight: 700 },
            $stickyHeaderTop: '60px',
            $row: {
                height: '3rem',
                $selected: { backgroundColor: '#e3f2fd' },
            },
            $cell: { padding: '0.5rem 1rem' },
        }"
    />
</template>
```

`$stickyHeaderTop`은 `stickyHeader`가 켜졌을 때 떠 있는 헤더의 `top` 오프셋입니다. 기본적으로 뷰포트 상단(`0`)에 붙으며, 앱 고정 헤더 아래로 내리고 싶을 때 값을 지정합니다(예: `'60px'`).

## 이벤트

| 이벤트                 | 페이로드                                      | 설명                             |
| ---------------------- | --------------------------------------------- | -------------------------------- |
| `click-cell`           | `(cell: VsTableBodyCell, event: MouseEvent)`  | 셀 클릭 시 발생                  |
| `click-row`            | `(item: VsTableItem, index: number, event: MouseEvent)` | 바디 행 클릭 시 발생             |
| `select-row`           | `(row: VsTableBodyCell[], event: MouseEvent)` | 행 선택 시 발생                  |
| `expand-row`           | `(row: VsTableBodyCell[], event: MouseEvent)` | 행 확장 시 발생                  |
| `drag`                 | `SortableEvent`                               | 드래그 앤 드롭 재정렬 후 발생    |
| `search`               | `(items: VsTableItem[], searchText: string)`  | 검색 시 발생                     |
| `paginate`             | `(nextPage: number, pageSize: number)`        | 페이지 또는 page size 변경 시 발생 (page size 변경 시 페이지는 0으로 초기화) |
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
| `expand`       | 확장 행 패널의 커스텀 내용. `expandable`이 활성화된 경우 이 슬롯이 있어야 확장 UI가 렌더링됩니다 |
| `empty`        | 행이 없을 때 표시할 커스텀 내용. 미제공 시 기본 "NO DATA" 자리표시자가 사용됩니다 |

## 메서드

| 메서드     | 매개변수        | 설명                                                                                              |
| ---------- | --------------- | ------------------------------------------------------------------------------------------------- |
| `expand`   | `index: number` | 현재 표시된 행 중 해당 index의 확장 가능한 행을 펼칩니다. 행이 없거나 확장 불가능하면 아무 동작도 하지 않습니다 |
| `collapse` | `index: number` | 현재 표시된 행 중 해당 index의 확장 가능한 행을 접습니다. 행이 없거나 확장 불가능하면 아무 동작도 하지 않습니다 |
