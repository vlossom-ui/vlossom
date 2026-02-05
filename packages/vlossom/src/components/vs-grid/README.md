# VsGrid

CSS Grid 레이아웃을 쉽게 구성할 수 있는 그리드 컴포넌트입니다. 반응형 그리드 시스템과 커스터마이징 가능한 간격을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 그리드

```html
<template>
    <vs-grid
        :grid-size="6"
        :column-gap="16"
        :row-gap="24"
        width="800px"
        height="400px"
    >
        <div>Grid Item 1</div>
        <div>Grid Item 2</div>
        <div>Grid Item 3</div>
        <div>Grid Item 4</div>
    </vs-grid>
</template>
```

### 커스텀 태그 사용

```html
<template>
    <vs-grid tag="section" :grid-size="3">
        <article>Article 1</article>
        <article>Article 2</article>
        <article>Article 3</article>
    </vs-grid>
</template>
```

## Props

| Prop        | Type                       | Default | Required | Description                      |
| ----------- | -------------------------- | ------- | -------- | -------------------------------- |
| `gridSize`  | `string \| number`         | -       | -        | 그리드 컬럼 수 (기본 12)         |
| `columnGap` | `string \| number`         | -       | -        | 컬럼 간 간격 (기본 0)            |
| `rowGap`    | `string \| number`         | -       | -        | 행 간 간격 (기본 0)              |
| `width`     | `string \| number`         | -       | -        | VsGird 컴포넌트 너비 (기본 100%) |
| `height`    | `string \| number`         | -       | -        | VsGird 컴포넌트 높이 (기본 100%) |
| `tag`       | `string`                   | `div`   | -        | 렌더링할 HTML 태그               |
| `styleSet`  | `string \| VsGridStyleSet` | -       | -        | 커스텀 스타일 설정 객체          |

## Types

```typescript
interface VsGridStyleSet {
    component?: CSSProperties;
    variables?: {
        gridSize?: number;
        columnGap?: string;
        rowGap?: string;
    };
}
```

### StyleSet 사용 예시

#### variables로 그리드 설정

```html
<template>
    <vs-grid :style-set="{
        variables: {
            gridSize: 4,
            columnGap: '1rem',
            rowGap: '1rem',
        },
    }">
        <div>Item 1</div>
        <div>Item 2</div>
    </vs-grid>
</template>
```

#### component로 컨테이너 스타일 설정

```html
<template>
    <vs-grid :style-set="{
        component: {
            width: '600px',
            height: '200px',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
        },
    }">
        <div>Item 1</div>
        <div>Item 2</div>
    </vs-grid>
</template>
```

#### component + variables 조합

```html
<template>
    <vs-grid :style-set="{
        component: {
            width: '100%',
            padding: '1rem',
        },
        variables: {
            gridSize: 6,
            columnGap: '0.5rem',
            rowGap: '0.5rem',
        },
    }">
        <div>Item 1</div>
        <div>Item 2</div>
    </vs-grid>
</template>
```

## Slots

| Slot      | Description                 |
| --------- | --------------------------- |
| `default` | 그리드 내부에 배치할 콘텐츠 |

## 특징

- **CSS Grid 기반**: CSS Grid 레이아웃 시스템 사용
- **컨테이너 쿼리**: `container-type: inline-size` 지원
