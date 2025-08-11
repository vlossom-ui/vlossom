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

## CSS 변수

컴포넌트는 다음 CSS 변수를 생성합니다:

- `--vs-grid-width`: VsGird 컴포넌트 너비
- `--vs-grid-height`: VsGird 컴포넌트 높이
- `--vs-grid-gridSize`: 그리드 컬럼 수
- `--vs-grid-columnGap`: 컬럼 간격
- `--vs-grid-rowGap`: 행 간격

## 특징

- **CSS Grid 기반**: CSS Grid 레이아웃 시스템 사용
- **컨테이너 쿼리**: `container-type: inline-size` 지원
