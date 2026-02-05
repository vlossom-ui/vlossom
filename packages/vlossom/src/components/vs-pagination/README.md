# VsPagination

페이지 네비게이션을 위한 페이지네이션 컴포넌트입니다. `v-model`을 지원하며, 전체 페이지 수에 따라 자동으로 페이지 버튼을 생성합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 페이지네이션

```html
<template>
    <vs-pagination v-model="currentPage" :length="10" @change="handlePageChange" />
</template>
```

### Edge 버튼 포함

```html
<template>
    <vs-pagination
        v-model="currentPage"
        :length="20"
        edge-buttons
    />
</template>
```

### 표시 페이지 수 조정

```html
<template>
    <vs-pagination
        v-model="currentPage"
        :length="100"
        :showing-length="5"
    />
</template>
```

### 다양한 스타일

```html
<template>
    <vs-pagination v-model="currentPage" :length="10" ghost />
    <vs-pagination v-model="currentPage" :length="10" outline />
</template>
```

### 커스텀 페이지 번호

```html
<template>
    <vs-pagination v-model="currentPage" :length="10">
        <template #page="{ page }">
            Page {{ page }}
        </template>
    </vs-pagination>
</template>
```

## Props

| Prop            | Type                             | Default | Required | Description                                |
| --------------- | -------------------------------- | ------- | -------- | ------------------------------------------ |
| `modelValue`    | `number`                         | `0`     | -        | v-model로 바인딩되는 현재 페이지 (0-based) |
| `length`        | `number`                         | `1`     | ✓        | 전체 페이지 수 (1 이상이어야 함)           |
| `showingLength` | `number`                         | `10`    | -        | 화면에 표시할 페이지 버튼 수 (1 이상)      |
| `edgeButtons`   | `boolean`                        | `false` | -        | 첫 페이지/마지막 페이지 버튼 표시 여부     |
| `disabled`      | `boolean`                        | `false` | -        | 전체 페이지네이션 비활성화                 |
| `ghost`         | `boolean`                        | `false` | -        | 고스트 스타일 적용                         |
| `outline`       | `boolean`                        | `false` | -        | 아웃라인 스타일 적용                       |
| `colorScheme`   | `ColorScheme`                    | -       | -        | 컴포넌트 색상 테마                         |
| `styleSet`      | `string \| VsPaginationStyleSet` | -       | -        | 커스텀 스타일 설정 객체                    |

## Events

| Event               | Parameters | Description                 |
| ------------------- | ---------- | --------------------------- |
| `update:modelValue` | `number`   | v-model 값이 변경될 때 발생 |
| `change`            | `number`   | 페이지가 변경될 때 발생     |

## Slots

| Slot    | Props      | Description                        |
| ------- | ---------- | ---------------------------------- |
| `first` | -          | 첫 페이지로 이동 버튼의 콘텐츠     |
| `prev`  | -          | 이전 페이지로 이동 버튼의 콘텐츠   |
| `page`  | `{ page }` | 페이지 번호 버튼의 콘텐츠          |
| `next`  | -          | 다음 페이지로 이동 버튼의 콘텐츠   |
| `last`  | -          | 마지막 페이지로 이동 버튼의 콘텐츠 |

## Types

```typescript
interface VsPaginationStyleSet {
    component?: CSSProperties;
    pageButton?: {
        variables?: {
            padding?: string;
        };
        component?: CSSProperties;
    };
    controlButton?: {
        variables?: {
            padding?: string;
        };
        component?: CSSProperties;
    };
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-pagination
        v-model="currentPage"
        :length="20"
        :style-set="{
            component: {
                gap: '1rem',
            },
            pageButton: {
                component: {
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#f5f5f5',
                },
            },
            controlButton: {
                component: {
                    borderRadius: '50%',
                },
            },
        }"
    />
</template>
```

## 특징

- **v-model 지원**: 양방향 데이터 바인딩으로 현재 페이지 상태 관리 (0-based 인덱스 사용)
- **자동 페이지 계산**: 현재 선택된 페이지를 중심으로 표시할 페이지 범위 자동 계산
- **VsButton 기반**: edge 버튼과 page 버튼을 VsButton으로 구성하여 일관된 스타일링 제공
