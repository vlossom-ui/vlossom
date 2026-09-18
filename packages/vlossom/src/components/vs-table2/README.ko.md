> For English documentation, see [README.md](./README.md).

# VsTable2

정렬, 검색, 페이지네이션, 선택, 드래그 앤 드롭, 확장 행을 아이템(행) 단위로 다루는 데이터 테이블 컴포넌트입니다.

**사용 가능 버전**: 2.1.0+

## 기능

- 컬럼 정렬, 내장 검색, 페이지네이션 (클라이언트/서버 모드)
- 아이템을 기준으로 동작하는 행 선택과 확장 행 패널
- `items`를 변경하지 않는 드래그 앤 드롭 행 재정렬
- 자동 레이아웃 동기화를 지원하는 스티키 헤더
- 작은 화면에서 컬럼을 세로로 쌓는 반응형 레이아웃

## 기본 사용법

```html
<template>
    <vs-table2 :columns="columns" :items="items" item-key="id" />
</template>

<script setup>
const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age' },
];
const items = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 },
];
</script>
```

`columns`에는 문자열 배열(`['name', 'age']`)도 전달할 수 있고, 비어 있으면 첫 아이템의 키를 컬럼으로 사용합니다.

### 행 식별

`itemKey`는 무엇을 하나의 행으로 볼지 정합니다. 필드 이름(중첩 경로 가능) 또는 함수를 전달합니다. 지정하지 않으면 아이템 객체의 동일성을 기준으로 하기 때문에, 데이터를 다시 조회해 아이템 객체를 새로 만들어 교체하면 선택/확장 상태가 사라지고 행이 다시 마운트됩니다.

```html
<template>
    <vs-table2 :columns="columns" :items="items" :item-key="(item) => item.user.id" />
</template>
```

### 검색 및 페이지네이션

```html
<template>
    <vs-table2 :columns="columns" :items="items" search pagination />
</template>
```

### 검색 범위

검색은 테이블 바디에 렌더링된 값을 대상으로 동작하므로, 컬럼의 `transform` 결과도 화면에 보이는 그대로 검색됩니다. 범위는 두 가지 옵션으로 조정합니다.

- 컬럼의 `skipSearch`: 렌더링되는 컬럼을 검색 대상에서 제외합니다.
- `search.extraKeys`: 어떤 컬럼으로도 렌더링되지 않는 아이템 필드를 검색 대상에 추가합니다. 슬롯으로 값을 다른 셀에 끌어와 보여주거나, 숨겨진 메타데이터로 필터링할 때 사용합니다.

```html
<template>
    <vs-table2 :columns="columns" :items="items" :search="{ extraKeys: ['tags'] }">
        <template #item-name="{ item }">{{ item.name }} ({{ item.tags }})</template>
    </vs-table2>
</template>

<script setup>
const columns = [
    { key: 'name', label: 'Name' },
    { key: 'note', label: 'Note', skipSearch: true },
];
</script>
```

둘 다 컬럼 `key`와 동일하게 점 경로(`'metadata.email'`)를 지원합니다. `skipSearch` 컬럼이거나 그 하위 경로인 키는 `extraKeys`에 넣어도 제외된 상태로 유지됩니다.

키가 객체나 배열을 가리키면 내부의 모든 값이 검색 대상이 되며, 클래스 인스턴스도 포함됩니다. 자기 자신의 열거 가능한 속성만 검색하므로 프로토타입 getter 값은 별도의 키가 필요합니다. 함수와 바이너리 값(`TypedArray`, `Blob`)은 무시하고, `Date`는 ISO 문자열로 검색합니다.

### 선택 가능한 행

```html
<template>
    <vs-table2 :columns="columns" :items="items" item-key="id" selectable v-model:selected-items="selected" />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref([]);
</script>
```

### 확장 가능한 행

`expandable`의 기본값은 `true`지만, 확장 UI(토글 버튼과 확장 패널)는 `expand` 슬롯이 있을 때만 렌더링됩니다. `:expandable="false"`를 전달하면 확장 기능을 완전히 끕니다.

```html
<template>
    <vs-table2 :columns="columns" :items="items" item-key="id">
        <template #expand="{ item }">
            <div>{{ item.detail }}</div>
        </template>
    </vs-table2>
</template>
```

### 테이블이 보여주는 아이템 가져오기

`items`는 입력이며 테이블은 이 배열을 변경하지 않습니다. 검색 · 정렬 · 드래그가 반영된 현재 상태는 출력용 v-model로 가져옵니다.

```html
<template>
    <vs-table2
        :columns="columns"
        :items="items"
        item-key="id"
        search
        pagination
        draggable
        v-model:paged-items="pagedItems"
        v-model:total-items="totalItems"
        v-model:selected-items="selectedItems"
    />
</template>
```

- `pagedItems`: 현재 페이지에 보이는 행
- `totalItems`: 검색과 정렬을 거친 전체 행을 화면 순서대로 (페이지네이션으로 가려진 행 포함)
- `selectedItems`: 현재 선택된 행

### 드래그 가능한 행

드래그는 화면에 보이는 순서를 재배열하며, 정렬이 켜져 있어도 동작합니다. `items`는 그대로 유지되므로 바뀐 순서는 `totalItems` / `pagedItems`나 `drag` 이벤트로 읽습니다. `items`, 검색어, 정렬이 바뀌면 드래그 순서는 버려지고, 페이지네이션이 있으면 드래그는 현재 페이지가 차지한 자리 안에서만 순서를 바꿉니다.

```html
<template>
    <vs-table2 :columns="columns" :items="items" item-key="id" draggable v-model:total-items="orderedItems" />
</template>
```

### 빈 상태

행이 없을 때 기본 "NO DATA" 자리표시자 대신 `empty` 슬롯을 렌더링합니다. `loading`이 true이면 로딩 인디케이터가 우선합니다.

```html
<template>
    <vs-table2 :columns="columns" :items="[]">
        <template #empty>
            <div>조건에 맞는 결과가 없습니다.</div>
        </template>
    </vs-table2>
</template>
```

### 서버 모드

```html
<template>
    <vs-table2
        :columns="columns"
        :items="items"
        item-key="id"
        server-mode
        :pagination="{ totalItemCount: totalCount }"
        v-model:page="page"
        v-model:page-size="pageSize"
        @paginate="fetchData"
    />
</template>
```

## Props

| Prop            | Type                                           | Default  | Description                                                                                                        |
| --------------- | ---------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `colorScheme`   | `string`                                       |          | 컴포넌트 컬러 스킴                                                                                                 |
| `styleSet`      | `string \| VsTable2StyleSet`                   |          | 컴포넌트 스타일 세트                                                                                               |
| `columns`       | `VsTable2ColumnDef[] \| string[]`              | `[]`     | 컬럼 정의. 비어 있으면 첫 아이템의 키를 사용합니다                                                                 |
| `items`         | `VsTable2Item[]`                               | `[]`     | 데이터 행. 테이블이 변경하지 않습니다                                                                              |
| `itemKey`       | `string \| ((item) => string \| number)`       |          | 행 식별 키. 생략하면 아이템 객체의 동일성을 사용합니다                                                             |
| `size`          | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`         | `'md'`   | 테이블 크기 — 셀 패딩/폰트에 반영되고 검색 입력, 페이지네이션(페이지 크기 셀렉트 포함), 선택 체크박스로 전파됩니다 |
| `draggable`     | `boolean`                                      | `false`  | 드래그 앤 드롭 행 재정렬 활성화                                                                                    |
| `expandable`    | `boolean \| (item, index?, items?) => boolean` | `true`   | 행 확장 활성화. 확장 UI는 `expand` 슬롯이 있을 때만 렌더링됩니다                                                   |
| `loading`       | `boolean`                                      | `false`  | 로딩 상태 표시 및 검색/페이지네이션/드래그 비활성화                                                                |
| `page`          | `number`                                       |          | 현재 페이지 인덱스 (0부터 시작), v-model                                                                           |
| `pageSize`      | `number`                                       |          | 페이지당 행 수, v-model. 기본값은 pageSizeOptions의 첫 번째 값                                                     |
| `pagedItems`    | `VsTable2Item[]`                               | `[]`     | 현재 페이지의 행, v-model (출력 전용)                                                                              |
| `pagination`    | `boolean \| VsTable2PaginationOptions`         | `false`  | 페이지네이션 활성화                                                                                                |
| `primary`       | `boolean`                                      | `false`  | 헤더에 primary 색상 적용                                                                                           |
| `responsive`    | `boolean`                                      | `false`  | 반응형(세로 적층) 레이아웃 활성화                                                                                  |
| `search`        | `boolean \| VsTable2SearchOptions`             | `false`  | 내장 검색 활성화                                                                                                   |
| `selectable`    | `boolean \| (item, index?, items?) => boolean` | `false`  | 행 선택 활성화                                                                                                     |
| `selectedItems` | `VsTable2Item[]`                               | `[]`     | 선택된 행, v-model                                                                                                 |
| `serverMode`    | `boolean`                                      | `false`  | 서버 사이드 페이지네이션 모드                                                                                      |
| `state`         | `UIState \| (item, index?, items?) => UIState` | `'idle'` | 행 상태 스타일                                                                                                     |
| `stickyHeader`  | `boolean`                                      | `false`  | 스크롤 시 헤더 고정                                                                                                |
| `totalItems`    | `VsTable2Item[]`                               | `[]`     | 검색과 정렬을 거친 전체 행(화면 순서), v-model (출력 전용)                                                         |

## Types

```typescript
interface VsTable2StyleSet extends CSSProperties {
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

type VsTable2ItemKey<I = VsTable2Item> = VsTable2ColumnKey<I> | ((item: I) => string | number);

interface VsTable2SearchOptions<I = VsTable2Item> {
    useRegex?: boolean;
    useCaseSensitive?: boolean;
    placeholder?: string;
    extraKeys?: VsTable2ColumnKey<I>[];
}

interface VsTable2ColumnDef<I = VsTable2Item> {
    key: VsTable2ColumnKey<I>;
    label: string;
    headerAlign?: TextAlignment;
    align?: TextAlignment;
    verticalAlign?: VerticalAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    sortable?: boolean;
    sortBy?: VsTable2ColumnKey<I>;
    skipSearch?: boolean;
    transform?: (value: any, item: I) => unknown;
}

interface VsTable2Cell<I = VsTable2Item> {
    item: I;
    value: unknown;
    colKey: VsTable2ColumnKey<I>;
    rowIdx: number;
    colIdx: number;
}

interface VsTable2PaginationOptions {
    pageSizeOptions?: VsTable2PageSizeOptions;
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
    <vs-table2
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

`$stickyHeaderTop`은 `stickyHeader`가 켜져 있을 때 나타나는 고정 헤더의 `top` 오프셋입니다. 기본값은 뷰포트 최상단(`0`)이며, 고정 앱 헤더 아래로 내리려면 `'60px'`처럼 지정합니다.

## Events

| Event                  | Payload                                                                     | Description                                                                      |
| ---------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `click-cell`           | `(cell: VsTable2Cell, event: MouseEvent)`                                   | 바디 셀을 클릭했을 때                                                            |
| `click-row`            | `(item: VsTable2Item, index: number, event: MouseEvent)`                    | 바디 행을 클릭했을 때                                                            |
| `select-row`           | `(item: VsTable2Item, index: number, selected: boolean, event: MouseEvent)` | 행이 선택되거나 해제됐을 때                                                      |
| `expand-row`           | `(item: VsTable2Item, index: number, expanded: boolean, event: MouseEvent)` | 행이 펼쳐지거나 접혔을 때                                                        |
| `drag`                 | `SortableEvent`                                                             | 드래그 앤 드롭으로 순서가 바뀐 뒤                                                |
| `search`               | `(items: VsTable2Item[], searchText: string)`                               | 검색 시. 필터링 후 화면에 보이는 행과 함께 발생합니다                            |
| `paginate`             | `(nextPage: number, pageSize: number)`                                      | 페이지 또는 페이지 크기가 바뀌었을 때 (페이지 크기가 바뀌면 페이지는 0으로 리셋) |
| `update:selectedItems` | `VsTable2Item[]`                                                            | 선택된 행이 바뀌었을 때                                                          |
| `update:page`          | `number`                                                                    | 현재 페이지가 바뀌었을 때                                                        |
| `update:pageSize`      | `number`                                                                    | 페이지 크기가 바뀌었을 때                                                        |
| `update:pagedItems`    | `VsTable2Item[]`                                                            | 현재 페이지의 행이 바뀌었을 때                                                   |
| `update:totalItems`    | `VsTable2Item[]`                                                            | 검색/정렬을 거친 전체 행이 바뀌었을 때                                           |

`index`는 현재 화면에 표시된 행들 안에서의 위치입니다.

## Slots

| Slot           | Slot Props                                           | Description                                                 |
| -------------- | ---------------------------------------------------- | ----------------------------------------------------------- |
| `toolbar`      |                                                      | 검색 입력 왼쪽 영역. 액션 버튼이나 커스텀 컨트롤을 넣습니다 |
| `caption`      |                                                      | 테이블 캡션                                                 |
| `header-[key]` | `{ item: VsTable2ColumnDef, value, colIdx, rowIdx }` | 특정 컬럼 키의 헤더 셀                                      |
| `item-[key]`   | `{ item: VsTable2Item, value, colIdx, rowIdx }`      | 특정 컬럼 키의 아이템 셀                                    |
| `select`       | `{ item, value, rowIdx }`                            | 선택 컬럼 셀                                                |
| `expand`       | `{ item, value, rowIdx }`                            | 확장 패널. 확장 UI를 렌더링하려면 반드시 필요합니다         |
| `empty`        |                                                      | 행이 없을 때 표시할 내용                                    |

헤더 셀 슬롯은 `header-`, 바디 셀 슬롯은 `item-` 접두사를 쓰며, 각각 `[key]` → `col{colIdx}-row{rowIdx}` → `row{rowIdx}` → `col{colIdx}` → 접두사 단독(`header` / `item`) 순으로 매칭됩니다.

## Methods

| Method     | Parameters      | Description                                                                                     |
| ---------- | --------------- | ----------------------------------------------------------------------------------------------- |
| `expand`   | `index: number` | 현재 표시된 행 중 해당 index의 행을 펼칩니다. 행이 없거나 확장 불가면 아무 동작도 하지 않습니다 |
| `collapse` | `index: number` | 현재 표시된 행 중 해당 index의 행을 접습니다. 행이 없거나 확장 불가면 아무 동작도 하지 않습니다 |

## Caution

- 행 이벤트는 셀 객체가 아니라 아이템을 전달합니다. 값이 필요하면 `item`에서 읽거나, 렌더링된 셀 값이 필요할 때 `click-cell`을 사용하세요.
- 헤더 셀 클릭은 `click-cell`을 발생시키지 않습니다. 정렬은 `sortable` 컬럼의 정렬 아이콘으로 트리거됩니다.
- 드래그는 테이블이 보여주는 순서만 바꿉니다. `items`가 갱신돼도 순서를 유지해야 한다면 `totalItems`나 `drag` 이벤트로 받아 직접 저장하세요.
