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

        <template #header-name="{ header }">
            <span class="bg-yellow-200 font-semibold">{{ header.value }}*</span>
        </template>

        <template #body-age="{ item }">
            <span class="text-emerald-600">{{ item.age }} 세</span>
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
    <vs-table
        :columns="['id', 'name', 'order', 'checked', 'created', 'desc']"
        :items="items"
        responsive
    />
</template>
```

> `responsive`가 true이면 768px 이하에서 thead를 숨기고 각 행을 카드형으로 쌓아올리며, 각 셀이 헤더 라벨을 함께 표시합니다.

### 페이지네이션 (Pagination)

```html
<template>
    <vs-table
        :columns="['name', 'age', 'email']"
        :items="items"
        pagination
        @change-page="(page, pageSize) => console.log(page, pageSize)"
    />
</template>
```

> `pagination`을 `true`로 설정하면 내부적으로 `VsPagination`을 사용해 페이지네이션이 활성화되며, `change-page` 이벤트로 0-기반 페이지 인덱스와 페이지 크기를 받을 수 있습니다.

```html
<template>
    <vs-table
        :columns="columns"
        :items="items"
        :pagination="{
            pageSize: 20,
            pageSizeOptions: [10, 20, 50],
            showPageSizeSelector: true,
            showingLength: 5,
            edgeButtons: true,
            showTotal: true
        }"
    />
</template>
```

> 페이지 크기 또는 검색/정렬 조건이 변경되면 첫 페이지로 자동 리셋됩니다.
> 기본 옵션: `pageSize: 50`, `pageSizeOptions: [10, 25, 50, 100]`, `showPageSizeSelector: true`, `showingLength: 10`, `edgeButtons: false`, `showTotal: true`

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
        <template #expand="{ cells, rowIdx }">
            <div class="p-4 bg-slate-50">
                <p class="font-semibold">상세 정보 (row {{ rowIdx }})</p>
                <p>{{ cells[0].item.name }} / {{ cells[0].item.age }}세</p>
            </div>
        </template>
    </vs-table>
</template>
```

> `expandable`이 `true`이거나 조건을 만족하는 행만 확장 버튼이 표시되며, `expand` 슬롯을 통해 확장 영역을 커스텀합니다.

## Props

| Prop                     | Type                                           | Default | Required | Description                                                                       |
| ------------------------ | ---------------------------------------------- | ------- | -------- | --------------------------------------------------------------------------------- |
| `colorScheme`            | `ColorScheme`                                  | -       | -        | 컴포넌트 색상 테마                                                                |
| `styleSet`               | `string \| VsTableStyleSet`                    | -       | -        | 커스텀 스타일 설정 객체                                                           |
| `columns`                | `ColumnDef[] \| string[] \| null`              | `[]`    | -        | 테이블 컬럼 정의                                                                  |
| `items`                  | `Item[]`                                       | -       | **Yes**  | 테이블에 표시할 아이템 배열                                                       |
| `responsive`             | `boolean`                                      | false   | -        | 좁은 화면에서 카드형(모바일) 레이아웃                                             |
| `search`                 | `boolean \| VsTableSearchOptions`              | false   | -        | 검색 입력 표시 및 옵션                                                            |
| `pagination`             | `boolean \| VsTablePaginationOptions`          | false   | -        | 페이지네이션 활성화 및 옵션                                                       |
| `selectable`             | `boolean \| (item, index?, items?) => boolean` | false   | -        | 행 선택 활성화 또는 조건부 선택 함수                                              |
| `expandable`             | `boolean \| (item, index?, items?) => boolean` | false   | -        | 행 확장 활성화 또는 조건부 확장 함수                                              |
| `stickyHeader`           | `boolean`                                      | false   | -        | 스크롤 시 헤더 고정 여부                                                          |
| `selectedItems`(v-model) | `Item[]`                                       | `[]`    | -        | 선택된 행(아이템) 배열 (v-model)                                                  |
| `page`(v-model)          | `number`                                       | `0`     | -        | 현재 페이지 인덱스 (0부터 시작, v-model). 페이지네이션 옵션 활성화 시 사용합니다. |

## Types

```typescript
type ColumnKey<I = Item> = JoinDotField<I>;

interface ColumnDef<I = Item> {
    key: ColumnKey<I>;
    label: string;
    align?: TextAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    sortable?: boolean;
    sortBy?: ColumnKey<I>;
    skipSearch?: boolean;
    transform?: (value: unknown, item: I) => unknown;
}

interface VsTableSearchOptions {
    placeholder?: string;
    useCaseSensitive?: boolean;
    useRegex?: boolean;
}

interface VsTablePaginationOptions {
    pageSize?: number;
    pageSizeOptions?: number[];
    showPageSizeSelector?: boolean;
    showingLength?: number;
    edgeButtons?: boolean;
    showTotal?: boolean;
}

interface HeaderCell extends Cell {
    tag: 'th';
    sortable: boolean;
}

interface BodyCell<I = Item> extends Cell<I> {
    tag: 'td';
    item: I;
}
```

## Slots

| Slot 이름 패턴                     | 설명                                        |
| ---------------------------------- | ------------------------------------------- |
| `caption`                          | `<caption>` 영역 커스텀                     |
| `select`                           | 선택 컬럼 영역 커스텀 (`{ cells, rowIdx }`) |
| `expand`                           | 확장 행 영역 커스텀 (`{ cells, rowIdx }`)   |
| `header`                           | 모든 헤더 셀 공통 렌더링                    |
| `header-${colKey}`                 | 특정 컬럼 키의 헤더 셀                      |
| `header-${id}`                     | 특정 헤더 셀 id (우선순위 높음)             |
| `header-col${colIdx}-row${rowIdx}` | 컬럼/행 인덱스 기반 헤더 셀                 |
| `header-row${rowIdx}`              | 특정 헤더 행 전체                           |
| `header-col${colIdx}`              | 특정 헤더 컬럼 전체                         |
| `body`                             | 모든 바디 셀 공통 렌더링                    |
| `body-${colKey}`                   | 특정 컬럼 키의 바디 셀                      |
| `body-${id}`                       | 특정 바디 셀 id (우선순위 높음)             |
| `body-col${colIdx}-row${rowIdx}`   | 컬럼/행 인덱스 기반 바디 셀                 |
| `body-row${rowIdx}`                | 특정 행의 모든 셀                           |
| `body-col${colIdx}`                | 특정 컬럼의 모든 셀                         |

> 셀의 슬롯에는 우선순위가 존재합니다.
> 슬롯 우선순위는 보다 구체적인 패턴(`*-id`) → `*-colKey` → 인덱스 기반 → 범용 슬롯 순으로 선택됩니다.

## Events

| Event         | Payload                                    | Description                                       |
| ------------- | ------------------------------------------ | ------------------------------------------------- |
| `click-cell`  | `(cell: BodyCell, event: MouseEvent)`      | 셀 클릭 시 발생                                   |
| `select-row`  | `(row: BodyCell[], event: MouseEvent)`     | 행(셀 배열) 선택 시 발생                          |
| `expand-row`  | `(row: BodyCell[], event: MouseEvent)`     | 행 확장 버튼 클릭 시 발생                         |
| `search`      | `(rows: BodyCell[][], searchText: string)` | 검색 입력 시 필터링된 행과 검색어를 반환          |
| `change-page` | `(page: number, pageSize: number)`         | 페이지네이션 변경 시 현재 페이지/페이지 크기 반환 |

## 특징

- **다양한 컬럼 입력**: 객체/문자열/null 컬럼 정의를 지원해 유연한 초기 설정 가능
- **슬롯 기반 커스터마이징**: 헤더/바디 셀 단위로 세밀한 우선순위 슬롯 렌더링
- **반응형 스타일링**: `styleSet`, `colorScheme`로 디자인 시스템 일관성 유지
- **반응형 테이블**: `responsive` prop을 통해 모바일 환경에서 표 레이아웃이 자동으로 바뀌며, 각 셀에서 헤더 정보를 함께 보여줌
- **페이지네이션**: `pagination` 옵션으로 `VsPagination` 기반 페이지 네비게이션과 총 아이템/페이지 크기 선택을 제공
- **행 선택**: `selectable` prop으로 체크박스 기반 행 선택 및 조건부 선택 지원
- **행 확장**: `expandable` prop과 `expand` 슬롯으로 행별 상세 영역 토글 가능
- **컬럼 정렬**: `sortable` 옵션으로 오름차순/내림차순 정렬, `sortBy`로 중첩 경로 정렬 지원
- **행 검색**: `search` 옵션으로 검색 입력을 제공하고, `skipSearch`로 제외 컬럼을 제어
