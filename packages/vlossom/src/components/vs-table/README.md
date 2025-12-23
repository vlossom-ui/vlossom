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

## Props

| Prop                     | Type                                           | Default | Required | Description                          |
| ------------------------ | ---------------------------------------------- | ------- | -------- | ------------------------------------ |
| `colorScheme`            | `ColorScheme`                                  | -       | -        | 컴포넌트 색상 테마                   |
| `styleSet`               | `string \| VsTableStyleSet`                    | -       | -        | 커스텀 스타일 설정 객체              |
| `columns`                | `ColumnDef[] \| string[] \| null`              | `[]`    | -        | 테이블 컬럼 정의                     |
| `items`                  | `Item[]`                                       | -       | **Yes**  | 테이블에 표시할 아이템 배열          |
| `selectable`             | `boolean \| (item, index?, items?) => boolean` | false   | -        | 행 선택 활성화 또는 조건부 선택 함수 |
| `selectedItems`(v-model) | `Item[]`                                       | `[]`    | -        | 선택된 행(아이템) 배열 (v-model)     |

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
    transform?: (value: unknown, item: I) => unknown;
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

| Slot 이름 패턴                     | 설명                            |
| ---------------------------------- | ------------------------------- |
| `caption`                          | `<caption>` 영역 커스텀         |
| `header`                           | 모든 헤더 셀 공통 렌더링        |
| `header-${colKey}`                 | 특정 컬럼 키의 헤더 셀          |
| `header-${id}`                     | 특정 헤더 셀 id (우선순위 높음) |
| `header-col${colIdx}-row${rowIdx}` | 컬럼/행 인덱스 기반 헤더 셀     |
| `header-row${rowIdx}`              | 특정 헤더 행 전체               |
| `header-col${colIdx}`              | 특정 헤더 컬럼 전체             |
| `body`                             | 모든 바디 셀 공통 렌더링        |
| `body-${colKey}`                   | 특정 컬럼 키의 바디 셀          |
| `body-${id}`                       | 특정 바디 셀 id (우선순위 높음) |
| `body-col${colIdx}-row${rowIdx}`   | 컬럼/행 인덱스 기반 바디 셀     |
| `body-row${rowIdx}`                | 특정 행의 모든 셀               |
| `body-col${colIdx}`                | 특정 컬럼의 모든 셀             |

> 셀의 슬롯에는 우선순위가 존재합니다.
> 슬롯 우선순위는 보다 구체적인 패턴(`*-id`) → `*-colKey` → 인덱스 기반 → 범용 슬롯 순으로 선택됩니다.

## Events

| Event        | Payload                                | Description              |
| ------------ | -------------------------------------- | ------------------------ |
| `click-cell` | `(event: MouseEvent, cell: BodyCell)`  | 셀 클릭 시 발생          |
| `select-row` | `(event: MouseEvent, row: BodyCell[])` | 행(셀 배열) 선택 시 발생 |

## 특징

- **다양한 컬럼 입력**: 객체/문자열/null 컬럼 정의를 지원해 유연한 초기 설정 가능
- **슬롯 기반 커스터마이징**: 헤더/바디 셀 단위로 세밀한 우선순위 슬롯 렌더링
- **반응형 스타일링**: `styleSet`, `colorScheme`로 디자인 시스템 일관성 유지
- **행 선택**: `selectable` prop으로 체크박스 기반 행 선택 및 조건부 선택 지원
- **컬럼 정렬**: `sortable` 옵션으로 오름차순/내림차순 정렬, `sortBy`로 중첩 경로 정렬 지원
