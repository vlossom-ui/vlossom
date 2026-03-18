# VsTable

컬럼 정의와 아이템 배열을 기반으로 표 형태 데이터를 렌더링하는 컴포넌트입니다. 헤더/바디 슬롯을 통해 세밀한 커스터마이징을 지원하며, 슬롯 네이밍 규칙으로 셀 단위의 우선순위 렌더링이 가능합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 객체 컬럼 정의

```html
<template>
    <vs-table
        :columns="[
            { key: 'name', label: 'Name' },
            { key: 'age', label: 'Age' },
        ]"
        :items="[
            { id: '1', name: 'Alice', age: 24 },
            { id: '2', name: 'Bob', age: 30 },
        ]"
    />
</template>
```

### 문자열 컬럼 정의

```html
<template>
    <vs-table
        :columns="['name', 'age']"
        :items="[
            { id: '1', name: 'Alice', age: 24 },
            { id: '2', name: 'Bob', age: 30 },
        ]"
    />
</template>
```

### 컬럼이 null인 경우 (아이템 키 기반 자동 생성)

```html
<template>
    <vs-table
        :columns="null"
        :items="[
            { id: '1', name: 'Alice', age: 24 },
            { id: '2', name: 'Bob', age: 30 },
        ]"
    />
</template>
```

### 슬롯 커스터마이징

```html
<template>
    <vs-table :columns="['name', 'age']" :items="items">
        <template #caption>
            <span class="font-bold text-blue-500">사용자 목록</span>
        </template>

        <template #header-name="{ value }">
            <span class="bg-yellow-200 font-semibold">{{ value }}*</span>
        </template>

        <template #body-age="{ item, value }">
            <span class="text-emerald-600">{{ item.age }} 세 ({{ value }})</span>
        </template>
    </vs-table>
</template>
```

### 행 선택 (Select)

```html
<template>
    <!-- 모든 행 선택 가능 -->
    <vs-table :columns="columns" :items="items" selectable />

    <!-- 조건부 선택 -->
    <vs-table
        :columns="columns"
        :items="items"
        :selectable="(item) => item.status === 'active'"
    />
</template>
```

### 정렬 (Sort)

```html
<template>
    <vs-table
        :columns="[
            { key: 'name', label: '이름', sortable: true },
            { key: 'age', label: '나이', sortable: true },
            { key: 'address', label: '주소', sortable: true, sortBy: 'address.city' },
        ]"
        :items="items"
    />
</template>
```

> 헤더 클릭 시 오름차순(ASCEND) → 내림차순(DESCEND) → 정렬 해제(NONE) 순으로 토글됩니다.

### 고정 헤더 (Sticky Header)

```html
<template>
    <vs-table
        :columns="['name', 'age', 'email']"
        :items="items"
        stickyHeader
    />
</template>
```

### 검색 (Search)

```html
<template>
    <vs-table
        :columns="[
            { key: 'name', label: '이름' },
            { key: 'age', label: '나이' },
            { key: 'email', label: '이메일', skipSearch: true },
        ]"
        :items="items"
        :search="{
            placeholder: '이름 검색',
            useCaseSensitive: false,
            useRegex: true
        }"
        @search="(rows, searchText) => console.log(rows, searchText)"
    />
</template>
```

> `search`를 `true` 또는 옵션 객체로 전달하면 검색 입력이 표시되며, `skipSearch`가 지정된 컬럼은 검색 대상에서 제외됩니다.

### 반응형 (Responsive)

```html
<template>
    <!-- 반응형 활성화 (1024px 이하에서 카드형으로 전환) -->
    <vs-table :columns="columns" :items="items" responsive />

    <!-- 반응형 비활성화 (항상 테이블 레이아웃 유지, 기본값) -->
    <vs-table :columns="columns" :items="items" />
</template>
```

> 반응형은 기본 비활성화 상태입니다. `responsive`를 사용하면 컨테이너 너비에 따라 카드형 레이아웃으로 전환됩니다.

### 페이지네이션 (Pagination)

```html
<template>
    <vs-table
        :columns="['name', 'age', 'email']"
        :items="items"
        pagination
        @paginate="(page, pageSize) => console.log(page, pageSize)"
    />
</template>
```

> `pagination`을 `true`로 설정하면 내부적으로 `VsPagination`을 사용해 페이지네이션이 활성화되며, `paginate` 이벤트로 0-기반 페이지 인덱스와 페이지 크기를 받을 수 있습니다.

#### 페이지 아이템 추적

```html
<template>
    <vs-table
        :columns="['name', 'age', 'email']"
        :items="allItems"
        pagination
        v-model:paged-items="currentPageItems"
        v-model:total-items="filteredItems"
    />

    <div class="mt-4">
        <p>전체 아이템: {{ allItems.length }}개</p>
        <p>필터링/검색된 아이템: {{ filteredItems.length }}개</p>
        <p>현재 페이지 아이템: {{ currentPageItems.length }}개</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const allItems = ref([/* 1000개 아이템 */]);
const currentPageItems = ref([]); // 현재 페이지에 표시되는 아이템 (예: 50개)
const filteredItems = ref([]);    // 검색/정렬 후 전체 아이템 (예: 300개)
</script>
```

> `v-model:paged-items`로 현재 페이지에 표시되는 아이템을, `v-model:total-items`로 검색/필터링/정렬된 전체 아이템을 추적할 수 있습니다.
> 페이지 변경, 검색, 정렬 시 자동으로 업데이트됩니다.

```html
<template>
    <vs-table
        :columns="columns"
        :items="items"
        :pagination="{
            pageSizeOptions: [
                { label: '10', value: 10 },
                { label: '20', value: 20 },
                { label: '50', value: 50 }
            ],
            showPageSizeSelect: true,
            showingLength: 5,
            edgeButtons: true,
            showTotal: true
        }"
        v-model:pageSize="pageSize"
    />
</template>
```

> 페이지 크기 또는 검색/정렬 조건이 변경되면 첫 페이지로 자동 리셋됩니다.

### 행 확장 (Expand)

```html
<template>
    <vs-table
        :columns="[
            { key: 'name', label: '이름' },
            { key: 'age', label: '나이' },
        ]"
        :items="items"
        :expandable="(item) => item.age >= 30"
    >
        <template #expand="{ item, rowIdx }">
            <div class="p-4 bg-slate-50">
                <p class="font-semibold">상세 정보 (row {{ rowIdx }})</p>
                <p>{{ item.name }} / {{ item.age }}세</p>
            </div>
        </template>
    </vs-table>
</template>
```

> `expandable`이 `true`이거나 조건을 만족하는 행만 확장 버튼이 표시되며, `expand` 슬롯을 통해 확장 영역을 커스텀합니다.

### 행 드래그 (Draggable)

```html
<template>
    <vs-table
        :columns="['name', 'age', 'email']"
        :items="items"
        draggable
        @drag="handleDrag"
    />
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
    { id: '1', name: 'Alice', age: 24, email: 'alice@example.com' },
    { id: '2', name: 'Bob', age: 30, email: 'bob@example.com' },
    { id: '3', name: 'Charlie', age: 28, email: 'charlie@example.com' },
]);

function handleDrag(event) {
    const { oldIndex, newIndex } = event;
    const movedItem = items.value.splice(oldIndex, 1)[0];
    items.value.splice(newIndex, 0, movedItem);
}
</script>
```

> `draggable`을 활성화하면 각 행에 드래그 핸들이 표시되며, 행을 드래그하여 순서를 변경할 수 있습니다. `drag` 이벤트를 통해 드래그 완료 시점에 순서 변경을 처리할 수 있습니다.

### 가상 스크롤 (Virtual Scroll)

```html
<template>
    <!-- 가상 스크롤 기본 활성화 -->
    <vs-table :columns="columns" :items="largeDataset" />

    <!-- 가상 스크롤 비활성화 (모든 행을 한 번에 렌더링) -->
    <vs-table :columns="columns" :items="items" no-virtual-scroll />
</template>
```

> 가상 스크롤은 기본 활성화 상태입니다. `no-virtual-scroll`을 사용하면 비활성화됩니다.

### 로딩 상태 (Loading)

```html
<template>
    <vs-table
        :columns="['name', 'age', 'email']"
        :items="items"
        :loading="isLoading"
    />
</template>
```

> `loading`이 `true`이면 테이블 셀에 스켈레톤 UI가 표시되고, 검색 입력이 비활성화됩니다.

## Props

| Prop                     | Type                                             | Default | Required | Description                                                                                                                                                |
| ------------------------ | ------------------------------------------------ | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `colorScheme`            | `ColorScheme`                                    | -       | -        | 컴포넌트 색상 테마                                                                                                                                         |
| `styleSet`               | `string \| VsTableStyleSet`                      | -       | -        | 커스텀 스타일 설정 객체                                                                                                                                    |
| `columns`                | `VsTableColumnDef[] \| string[] \| null`         | `[]`    | -        | 테이블 컬럼 정의                                                                                                                                           |
| `items`                  | `VsTableItem[]`                                  | -       | **Yes**  | 테이블에 표시할 아이템 배열                                                                                                                                |
| `dense`                  | `boolean`                                        | false   | -        | 컴팩트 모드. padding과 font-size를 줄여 밀도 높은 레이아웃 제공                                                                                            |
| `primary`                | `boolean`                                        | false   | -        | 헤더에 primary 색상 테마 적용. `styleSet.header`와 동시 사용 시 `styleSet.header`(인라인)가 우선됩니다                                                     |
| `responsive`             | `boolean`                                        | false   | -        | 반응형 레이아웃 활성화. 기본값 false(반응형 OFF). true 시 1024px 이하에서 카드형으로 전환                                                                  |
| `search`                 | `boolean \| VsTableSearchOptions`                | false   | -        | 검색 입력 표시 및 옵션                                                                                                                                     |
| `pagination`             | `boolean \| VsTablePaginationOptions`            | false   | -        | 페이지네이션 활성화 및 옵션                                                                                                                                |
| `selectable`             | `boolean \| (item, index?, items?) => boolean`   | false   | -        | 행 선택 활성화 또는 조건부 선택 함수                                                                                                                       |
| `expandable`             | `boolean \| (item, index?, items?) => boolean`   | false   | -        | 행 확장 활성화 또는 조건부 확장 함수                                                                                                                       |
| `stickyHeader`           | `boolean`                                        | false   | -        | 스크롤 시 헤더 고정 여부                                                                                                                                   |
| `loading`                | `boolean`                                        | false   | -        | 로딩 상태. 활성화 시 스켈레톤 UI 표시 및 검색 비활성화                                                                                                     |
| `serverMode`             | `boolean`                                        | false   | -        | 서버 사이드 페이지네이션 모드. true일 경우 클라이언트 사이드 페이지네이션을 수행하지 않고 서버에서 받은 데이터만 표시                                      |
| `noVirtualScroll`        | `boolean`                                        | false   | -        | 가상 스크롤 비활성화. 기본값 false(가상 스크롤 ON). true 시 모든 행을 한 번에 렌더링                                                                       |
| `draggable`              | `boolean`                                        | false   | -        | 행 드래그 활성화. 행 순서를 드래그로 변경 가능                                                                                                             |
| `state`                  | `UIState \| (row, rowIndex?, items?) => UIState` | -       | -        | 행별 UI 상태. 상수 또는 콜백. `info` / `success` / `warning` / `error` 반환 시 해당 행에 `vs-state-*` 클래스가 적용됩니다 (selectable, expandable과 유사). |
| `selectedItems`(v-model) | `VsTableItem[]`                                  | `[]`    | -        | 선택된 행(아이템) 배열 (v-model)                                                                                                                           |
| `page`(v-model)          | `number`                                         | -       | -        | 현재 페이지 인덱스 (0부터 시작, v-model). 페이지네이션 옵션 활성화 시 사용합니다.                                                                          |
| `pageSize` (v-model)     | `number`                                         | -       | -        | 페이지 당 아이템(행) 개수 (v-model, 페이지네이션 사용 시). `-1`로 설정하면 전체 데이터를 한 페이지에 표시합니다.                                           |
| `pagedItems` (v-model)   | `VsTableItem[]`                                  | `[]`    | -        | 현재 페이지에 표시되는 아이템 배열 (v-model). 페이지네이션, 검색, 정렬이 적용된 후 현재 페이지의 아이템만 포함                                             |
| `totalItems` (v-model)   | `VsTableItem[]`                                  | `[]`    | -        | 검색/필터링/정렬이 적용된 전체 아이템 배열 (v-model). 페이지네이션 적용 전의 모든 아이템 포함                                                              |

## Types

```typescript
interface VsTableStyleSet {
    component?: CSSProperties;
    header?: CSSProperties;
    row?: CSSProperties;
    selectedRow?: CSSProperties;
    cell?: CSSProperties;
}
```

```typescript
type VsTableColumnKey<I = VsTableItem> = JoinDotField<I>;

interface VsTableColumnDef<I = VsTableItem> {
    key: VsTableColumnKey<I>;
    label: string;
    align?: TextAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    sortable?: boolean;
    sortBy?: VsTableColumnKey<I>;
    skipSearch?: boolean;
    transform?: (value: unknown, item: I) => unknown;
}

interface VsTableSearchOptions {
    placeholder?: string;
    useCaseSensitive?: boolean;
    useRegex?: boolean;
}

type VsTablePageSizeOptions = { label: string; value: number }[];

interface VsTablePaginationOptions {
    pageSizeOptions?: VsTablePageSizeOptions;
    showPageSizeSelect?: boolean;
    showingLength?: number;
    edgeButtons?: boolean;
    showTotal?: boolean;
    totalItemCount?: number; // required when serverMode is true
}

interface VsTableHeaderCell extends VsTableCell {
    tag: 'th';
    sortable: boolean;
}

interface VsTableBodyCell<I = VsTableItem> extends VsTableCell<I> {
    tag: 'td';
    item: I;
}
```

## Slots

| Slot 이름 패턴                     | 설명                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `caption`                          | `<caption>` 영역 커스텀                                                  |
| `select`                           | 선택 컬럼 영역 커스텀 (`{ item, value, rowIdx }`)                        |
| `expand`                           | 확장 행 영역 커스텀 (`{ item, value, rowIdx }`)                          |
| `header`                           | 모든 헤더 셀 공통 렌더링 (`{ item: ColumnDef, value, colIdx, rowIdx }`)  |
| `header-${colKey}`                 | 특정 컬럼 키의 헤더 셀                                                   |
| `header-${id}`                     | 특정 헤더 셀 id (우선순위 높음)                                          |
| `header-col${colIdx}-row${rowIdx}` | 컬럼/행 인덱스 기반 헤더 셀                                              |
| `header-row${rowIdx}`              | 특정 헤더 행 전체                                                        |
| `header-col${colIdx}`              | 특정 헤더 컬럼 전체                                                      |
| `body`                             | 모든 바디 셀 공통 렌더링 (`{ item: Item, value, colIdx, rowIdx }`)       |
| `body-${colKey}`                   | 특정 컬럼 키의 바디 셀                                                   |
| `body-${id}`                       | 특정 바디 셀 id (우선순위 높음)                                          |
| `body-col${colIdx}-row${rowIdx}`   | 컬럼/행 인덱스 기반 바디 셀                                              |
| `body-row${rowIdx}`                | 특정 행의 모든 셀                                                        |
| `body-col${colIdx}`                | 특정 컬럼의 모든 셀                                                      |

> 셀의 슬롯에는 우선순위가 존재합니다.
> 슬롯 우선순위는 보다 구체적인 패턴(`*-id`) → `*-colKey` → 인덱스 기반 → 범용 슬롯 순으로 선택됩니다.

### 슬롯 바인딩 상세

| 슬롯 유형 | `item`             | `value`       | `colIdx` | `rowIdx` |
| --------- | ------------------ | ------------- | -------- | -------- |
| header    | `ColumnDef` 객체   | 헤더 표시 값  | O        | O        |
| body      | 행의 아이템 (`I`)  | 셀 표시 값    | O        | O        |
| select    | 행 아이템 / `null` | 선택 여부     | -        | O        |
| expand    | 행 아이템          | 확장 여부     | -        | O        |

## Events

| Event        | Payload                                    | Description                                       |
| ------------ | ------------------------------------------ | ------------------------------------------------- |
| `click-cell` | `(cell: VsTableBodyCell, event: MouseEvent)`      | 셀 클릭 시 발생                                   |
| `select-row` | `(row: VsTableBodyCell[], event: MouseEvent)`     | 행(셀 배열) 선택 시 발생                          |
| `expand-row` | `(row: VsTableBodyCell[], event: MouseEvent)`     | 행 확장 버튼 클릭 시 발생                         |
| `search`     | `(rows: VsTableBodyCell[][], searchText: string)` | 검색 입력 시 필터링된 행과 검색어를 반환          |
| `paginate`   | `(page: number, pageSize: number)`         | 페이지네이션 변경 시 현재 페이지/페이지 크기 반환 |
| `drag`       | `(event: SortableEvent)`                   | 행 드래그 완료 시 발생 (oldIndex, newIndex 포함)  |

## 특징

- **다양한 컬럼 입력**: 객체/문자열/null 컬럼 정의를 지원해 유연한 초기 설정 가능
- **슬롯 기반 커스터마이징**: 헤더/바디 셀 단위로 세밀한 우선순위 슬롯 렌더링
- **반응형 스타일링**: `styleSet`, `colorScheme`로 디자인 시스템 일관성 유지
- **반응형 테이블**: `responsive` prop으로 활성화. 1024px 이하 컨테이너에서 카드형으로 전환하며, 각 셀에서 헤더 정보를 함께 표시
- **페이지네이션**: `pagination` 옵션으로 `VsPagination` 기반 페이지 네비게이션과 총 아이템/페이지 크기 선택을 제공
- **데이터 추적**: `v-model:paged-items`와 `v-model:total-items`로 현재 페이지 및 필터링된 전체 데이터를 실시간 추적
- **행 선택**: `selectable` prop으로 체크박스 기반 행 선택 및 조건부 선택 지원
- **행 확장**: `expandable` prop과 `expand` 슬롯으로 행별 상세 영역 토글 가능
- **행 드래그**: `draggable` prop으로 드래그 앤 드롭 기반 행 순서 변경 지원
- **컬럼 정렬**: `sortable` 옵션으로 오름차순/내림차순 정렬, `sortBy`로 중첩 경로 정렬 지원
- **행 검색**: `search` 옵션으로 검색 입력을 제공하고, `skipSearch`로 제외 컬럼을 제어
- **가상 스크롤**: 기본 활성화. 화면에 보이는 행만 렌더링하여 대용량 데이터 성능 최적화. `no-virtual-scroll`로 비활성화 가능
- **로딩 상태**: `loading` prop으로 스켈레톤 UI를 표시하여 데이터 로딩 중 사용자 경험 향상
