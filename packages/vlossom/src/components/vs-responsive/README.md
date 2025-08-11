# VsResponsive

반응형 디자인을 위한 유틸리티 컴포넌트입니다. CSS Container Queries를 활용하여 다양한 화면 크기에 따라 너비와 그리드 레이아웃을 자동으로 조정합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 반응형 width

```html
<template>
    <vs-responsive
        :width="{ sm: '50%', md: '33.33%', lg: '25%' }"
    >
        <div>contents</div>
    </vs-responsive>
</template>
```

### 반응형 grid

```html
<template>
    <vs-grid>
        <vs-responsive :grid="{ sm: 12, md: 6, lg: 4, xl: 3 }">
            <div>grid contents</div>
        </vs-responsive>
    </vs-grid>
</template>
```

### 커스텀 태그 사용

```html
<template>
    <vs-grid>
        <vs-responsive
            tag="article"
            :grid="{ sm: 12, md: 6 }"
        >
            <h2>My Article</h2>
            <p>화면 크기에 따라 레이아웃이 자동으로 조정됩니다.</p>
        </vs-responsive>
    </vs-grid>
</template>
```

## Props

| Prop    | Type                              | Default | Required | Description                              |
| ------- | --------------------------------- | ------- | -------- | ---------------------------------------- |
| `width` | `string \| number \| Breakpoints` | -       | -        | 컴포넌트 너비. 단일 값 또는 반응형 객체  |
| `grid`  | `string \| number \| Breakpoints` | -       | -        | 그리드 컬럼 수. 단일 값 또는 반응형 객체 |
| `tag`   | `string`                          | `div`   | -        | 렌더링할 HTML 태그                       |

## Types

```typescript
interface Breakpoints {
    xs?: string | number; // 0px 이상
    sm?: string | number; // 640px 이상
    md?: string | number; // 768px 이상
    lg?: string | number; // 1024px 이상
    xl?: string | number; // 1280px 이상
}
```

## CSS 변수

컴포넌트는 다음 CSS 변수들을 생성합니다:

### 너비 관련 변수

- `--vs-width-xs`: 기본 너비 (xs 브레이크포인트)
- `--vs-width-sm`: 640px 이상에서의 너비
- `--vs-width-md`: 768px 이상에서의 너비
- `--vs-width-lg`: 1024px 이상에서의 너비
- `--vs-width-xl`: 1280px 이상에서의 너비

### 그리드 관련 변수

- `--vs-grid-xs`: 기본 그리드 컬럼 수
- `--vs-grid-sm`: 640px 이상에서의 그리드 컬럼 수
- `--vs-grid-md`: 768px 이상에서의 그리드 컬럼 수
- `--vs-grid-lg`: 1024px 이상에서의 그리드 컬럼 수
- `--vs-grid-xl`: 1280px 이상에서의 그리드 컬럼 수

## 브레이크포인트

컴포넌트는 다음과 같은 브레이크포인트를 지원합니다:

| 브레이크포인트 | 최소 너비 | 설명                    |
| -------------- | --------- | ----------------------- |
| `xs`           | 0px       | 기본 (모바일)           |
| `sm`           | 640px     | 작은 화면 (태블릿)      |
| `md`           | 768px     | 중간 화면 (태블릿)      |
| `lg`           | 1024px    | 큰 화면 (데스크톱)      |
| `xl`           | 1280px    | 매우 큰 화면 (데스크톱) |

## 특징

- **CSS Container Queries**: CSS Container Queries를 활용한 반응형 디자인
- **자동 클래스 생성**: 브레이크포인트에 따라 자동으로 CSS 클래스 생성
- **CSS 변수 지원**: 동적으로 CSS 변수를 생성하여 스타일링 유연성 제공
- **그리드 시스템 통합**: VsGrid 컴포넌트와 연동하여 반응형 그리드 레이아웃 구성
