> For English documentation, see [README.md](./README.md).

# VsFooter

`VsLayout` 내에서 사용 시 레이아웃 스토어 통합과 함께 고정, 스티키, 절대 위치를 지원하는 페이지 푸터 바 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 기본적으로 `<footer>` 요소로 렌더링 (`tag`로 변경 가능)
- CSS `position` 값 지원: `static`, `relative`, `absolute`, `fixed`, `sticky`
- 기본 높이 `3rem` — `height` prop으로 재정의 가능
- `primary` prop을 통한 기본 색상 스킴 스타일링
- 드로어 오프셋 계산을 위해 푸터 높이를 보고하는 `VsLayout` 통합
- 완전한 스타일 제어를 위해 `styleSet.component`를 통한 `CSSProperties` 허용

## 기본 사용법

```html
<template>
    <vs-footer>
        <p>© 2024 My App</p>
    </vs-footer>
</template>
```

### 고정 위치 푸터

```html
<template>
    <vs-footer position="fixed" height="4rem">
        <nav>네비게이션 링크</nav>
    </vs-footer>
</template>
```

### 기본 스타일 푸터

```html
<template>
    <vs-footer primary>
        <span>App v1.0.0</span>
    </vs-footer>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트의 색상 스킴 |
| `styleSet` | `string \| VsFooterStyleSet` | | | 컴포넌트의 사용자 정의 스타일 셋 |
| `position` | `'static' \| 'relative' \| 'absolute' \| 'fixed' \| 'sticky'` | | | 푸터의 CSS position 값 |
| `height` | `string` | | | 푸터의 높이. 기본값은 `3rem` |
| `primary` | `boolean` | `false` | | 기본 색상 스킴 적용 |
| `tag` | `string` | `'footer'` | | 렌더링할 HTML 태그 |

## 타입

```typescript
interface VsFooterStyleSet extends VsBarStyleSet {}

// VsBarStyleSet:
interface VsBarStyleSet {
    component?: CSSProperties;
}
```

> [!NOTE]
> `VsFooterStyleSet`은 [VsBarStyleSet](../vs-bar/README.md)을 확장합니다.

### StyleSet 예시

```html
<template>
    <vs-footer
        :style-set="{
            component: {
                backgroundColor: '#1a1a2e',
                color: '#ffffff',
                padding: '0 2rem',
                height: '4rem',
            },
        }"
    >
        <span>사용자 정의 스타일 푸터</span>
    </vs-footer>
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 푸터 콘텐츠 |

## 메서드

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
