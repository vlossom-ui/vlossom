# VsDivider

콘텐츠 영역을 시각적으로 구분하는 구분선 컴포넌트입니다. 가로형과 세로형 구분선을 지원하며, Container Query를 활용한 반응형 동작이 가능합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 가로 구분선 (기본)

```html
<template>
    <div>
        <p>첫 번째 콘텐츠</p>
        <vs-divider />
        <p>두 번째 콘텐츠</p>
    </div>
</template>
```

### 세로 구분선

```html
<template>
    <div class="flex items-center h-20">
        <span>메뉴 1</span>
        <vs-divider vertical />
        <span>메뉴 2</span>
        <vs-divider vertical />
        <span>메뉴 3</span>
    </div>
</template>
```

### 반응형 구분선

데스크톱에서는 세로형, 모바일에서는 가로형으로 자동 변환됩니다. vs-divider를 포함하는 태그는 `container-type` 스타일을 포함해야합니다.

```html
<template>
    <div class="navigation">
        <span>홈</span>
        <vs-divider vertical responsive />
        <span>소개</span>
        <vs-divider vertical responsive />
        <span>연락처</span>
    </div>
</template>
<style>
.navigation {
    ...;
    container-type: inline-size;
}
</style>
```

### 커스텀 스타일링

```html
<template>
    <vs-divider
        :style-set="customDividerStyle"
        color-scheme="primary"
    />
</template>

<script setup>
const customDividerStyle = {
    border: '2px dashed #ff6b6b',
    margin: '2rem 0'
};
</script>
```

## Props

| Prop          | Type                          | Default | Required | Description                                      |
| ------------- | ----------------------------- | ------- | -------- | ------------------------------------------------ |
| `colorScheme` | `ColorScheme`                 | -       | -        | 컴포넌트 색상 테마                               |
| `styleSet`    | `string \| VsDividerStyleSet` | -       | -        | 커스텀 스타일 설정 객체                          |
| `vertical`    | `boolean`                     | `false` | -        | 세로 구분선 여부 (false: 가로, true: 세로)       |
| `responsive`  | `boolean`                     | `false` | -        | 반응형 동작 여부 (768px 기준으로 가로/세로 전환) |

## Types

```typescript
interface VsDividerVerticalStyleSet {
    height?: string; // 세로 구분선 높이
    margin?: string; // 세로 구분선 여백
}
interface VsDividerStyleSet {
    border?: string; // 구분선 스타일 (색상, 두께, 형태)
    margin?: string; // 가로 구분선 여백
    vertical?: VsDividerVerticalStyleSet;
}
```

## CSS 변수

컴포넌트는 다음 CSS 변수를 생성합니다:

- `--vs-divider-border`: 구분선 테두리 스타일 (기본값: `1px solid var(--vs-primary-comp-bg)`)
- `--vs-divider-margin`: 가로 구분선 여백 (기본값: `1.6rem 0`)
- `--vs-divider-vertical-margin`: 세로 구분선 여백 (기본값: `0 1.2rem`)
- `--vs-divider-vertical-height`: 세로 구분선 높이 (기본값: `100%`)

## 특징

- **다양한 방향 지원**: 가로형과 세로형 구분선 모두 지원
- **Container Query 반응형**: 컨테이너 크기에 따른 자동 방향 전환
- **접근성**: 시각적 구분을 위한 의미적 역할 수행
- **커스터마이징**: CSS 변수와 styleSet을 통한 유연한 스타일 변경

## Container Query 동작

`responsive` 속성이 `true`일 때, 다음과 같이 동작합니다:

- **768px 초과**: 세로 구분선 유지
- **768px 이하**: 가로 구분선으로 자동 변환

```css
/* 반응형 동작 CSS */
@container (max-width: 768px) {
    .vs-divider.vs-vertical.vs-divider-responsive {
        /* 세로 → 가로 구분선으로 변환 */
    }
}
```
