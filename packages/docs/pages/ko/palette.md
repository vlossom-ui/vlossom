# 컬러 팔레트

Vlossom의 색상 토큰입니다. 19색 × 11스텝(50~950)과 의미 토큰 3종(`soft` / `base` / `strong`)으로 이루어집니다.

각 칸에 마우스를 올리면 CSS 변수 이름이 보입니다. 오른쪽 위 테마 토글을 눌러 다크 모드에서 토큰이 어떻게 달라지는지도 확인해 보세요.

<ColorPalette />

## 쓰는 법

색상은 CSS 변수로 직접 쓰거나, 컴포넌트의 `colorScheme` prop으로 지정합니다.

```css
.my-element {
    background-color: var(--vs-blue-500);
    border-color: var(--vs-blue-strong);
}
```

```html
<template>
    <vs-button color-scheme="blue" primary>Blue Button</vs-button>
</template>
```

컴포넌트 문서 페이지 상단의 **Color scheme** 바에서 색을 고르면, 그 페이지의 모든 데모에 즉시 적용됩니다.
