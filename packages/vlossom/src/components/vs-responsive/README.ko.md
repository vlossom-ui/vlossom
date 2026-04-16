> For English documentation, see [README.md](./README.md).

# VsResponsive

컨테이너 브레이크포인트에 따라 반응형 너비와 그리드 컬럼 설정을 적용하는 레이아웃 래퍼 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 컨테이너 쿼리 브레이크포인트(xs, sm, md, lg, xl)를 통해 반응형 `width` 및 `grid` 컬럼 스팬 적용
- 화면 크기별 세밀한 제어를 위한 브레이크포인트 객체 허용
- `tag` prop으로 임의의 HTML 요소로 렌더링 가능
- 레이아웃 일관성을 위해 많은 Vlossom 입력 컴포넌트 내부에서 사용

## 기본 사용법

```html
<template>
    <vs-responsive width="50%">
        <p>이 요소는 50% 너비를 차지합니다.</p>
    </vs-responsive>
</template>
```

### 그리드 컬럼 스팬 사용

```html
<template>
    <vs-responsive :grid="6">
        <p>6개의 그리드 컬럼을 차지합니다.</p>
    </vs-responsive>
</template>
```

### 브레이크포인트 객체 사용

```html
<template>
    <vs-responsive :width="{ xs: '100%', md: '50%', lg: '33%' }">
        <p>브레이크포인트별 반응형 너비를 적용합니다.</p>
    </vs-responsive>
</template>
```

### 커스텀 태그

```html
<template>
    <vs-responsive tag="section" width="80%">
        <p>section 요소로 렌더링됩니다.</p>
    </vs-responsive>
</template>
```

## Props

| Prop    | Type                                 | Default | Required | 설명                                                  |
| ------- | ------------------------------------ | ------- | -------- | ----------------------------------------------------- |
| `width` | `string \| number \| Breakpoints`    | -       | -        | 반응형 너비; 고정 값 또는 브레이크포인트 객체 사용 가능 |
| `grid`  | `string \| number \| Breakpoints`    | -       | -        | 그리드 컬럼 스팬; 고정 값 또는 브레이크포인트 객체 사용 가능 |
| `tag`   | `string`                             | `'div'` | -        | 루트 요소로 사용할 HTML 태그                          |

## Types

이 컴포넌트에는 커스텀 StyleSet 인터페이스가 없습니다.

```typescript
// width와 grid에서 사용하는 Breakpoints 타입
type Breakpoints = {
    xs?: string | number;
    sm?: string | number;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
};
```

## Events

| Event | Payload | 설명 |
| ----- | ------- | ---- |

## Slots

| Slot      | 설명             |
| --------- | ---------------- |
| `default` | 래핑할 콘텐츠    |

## Methods

| Method | Parameters | 설명 |
| ------ | ---------- | ---- |
