> For English documentation, see [README.md](./README.md).

# VsBar

헤더, 푸터, 또는 툴바 컨테이너로 주로 사용되는 전체 너비 수평 바 컴포넌트입니다.

**Available Version**: 2.0.0+

## Feature

- `tag` prop을 통해 원하는 HTML 요소로 렌더링 가능 (기본값: `div`)
- `position` prop을 통해 `absolute`, `fixed`, `sticky` 등 CSS position 값 지원
- 두드러진 툴바/헤더 스타일링을 위한 Primary 변형
- `component` CSSProperties를 통한 완전한 스타일 재정의

## Basic Usage

```html
<template>
    <vs-bar>
        <span>나의 애플리케이션 타이틀</span>
    </vs-bar>
</template>
```

### 고정 위치 헤더

```html
<template>
    <vs-bar position="fixed" primary>
        <span>고정 헤더 바</span>
    </vs-bar>
</template>
```

### 커스텀 태그

```html
<template>
    <vs-bar tag="header">
        <nav>네비게이션 콘텐츠</nav>
    </vs-bar>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | 컴포넌트 색상 테마 |
| `styleSet` | `string \| VsBarStyleSet` | | | 커스텀 스타일 세트 |
| `position` | `CssPosition` | | | CSS position 값 (`static`, `relative`, `absolute`, `fixed`, `sticky`) |
| `primary` | `boolean` | `false` | | Primary 색상 테마 적용 |
| `tag` | `string` | `'div'` | | 렌더링할 HTML 태그 |

## Types

```typescript
interface VsBarStyleSet {
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-bar
        :style-set="{
            component: {
                backgroundColor: '#1a1a2e',
                color: '#ffffff',
                padding: '0 1.5rem',
                height: '4rem',
            },
        }"
    >
        <span>커스텀 스타일 바</span>
    </vs-bar>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | 바 콘텐츠 |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
