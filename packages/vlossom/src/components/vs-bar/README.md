# VsBar

다양한 위치에 배치할 수 있는 바 형태의 컴포넌트입니다. 네비게이션 바, 툴바, 상태 바 등 다양한 용도로 활용할 수 있으며, 유연한 위치 지정과 시멘틱 HTML 태그 옵션을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 바

```html
<template>
    <vs-bar>
        BAR CONTENTS
    </vs-bar>
</template>
```

### Primary 스타일

```html
<template>
    <vs-bar primary>
        PRIMARY STYLE
    </vs-bar>
</template>
```

### HTML 태그 지정

```html
<template>
    <!-- 네비게이션 바 -->
    <vs-bar tag="nav">
        <a href="#home">홈</a>
        <a href="#about">소개</a>
    </vs-bar>

    <!-- 헤더 바 -->
    <vs-bar tag="header">
        <h1>사이트 제목</h1>
    </vs-bar>

    <!-- 푸터 바 -->
    <vs-bar tag="footer">
        <p>&copy; 2024 Company Name</p>
    </vs-bar>
</template>
```

### 위치 지정

```html
<template>
    <!-- CSS position: fixed -->
    <vs-bar position="fixed">
        <span>고정된 바</span>
    </vs-bar>

    <!-- CSS position: absolute -->
    <vs-bar position="absolute">
        <span>절대 위치 바</span>
    </vs-bar>

    <!-- CSS position: sticky -->
    <vs-bar position="sticky">
        <span>Sticky 바</span>
    </vs-bar>

    <!-- CSS position: static -->
    <vs-bar position="static">
        <span>정적 위치 바</span>
    </vs-bar>
</template>
```

## Props

| Prop          | Type                                                          | Default      | Required | Description             |
| ------------- | ------------------------------------------------------------- | ------------ | -------- | ----------------------- |
| `colorScheme` | `ColorScheme`                                                 | -            | -        | 컴포넌트 색상 테마      |
| `styleSet`    | `string \| VsBarStyleSet`                                     | -            | -        | 커스텀 스타일 설정 객체 |
| `primary`     | `boolean`                                                     | `false`      | -        | 강조 스타일 적용        |
| `position`    | `'relative' \| 'absolute' \| 'fixed' \| 'sticky' \| 'static'` | `'relative'` | -        | CSS position 속성 설정  |
| `tag`         | `string`                                                      | `'div'`      | -        | 렌더링할 HTML 태그 지정 |

## Types

```typescript
interface VsBarStyleSet {
    backgroundColor?: string; // 배경색
    border?: string; // 테두리 스타일
    boxShadow?: string; // 그림자 효과
    fontColor?: string; // 텍스트 색상
    fontSize?: string; // 폰트 크기
    fontWeight?: string; // 폰트 두께
    height?: string; // 높이
    padding?: string; // 내부 여백
    position?: 'fixed' | 'absolute' | 'relative' | 'sticky' | 'static'; // 위치 지정
    top?: string | number; // 상단 위치
    bottom?: string | number; // 하단 위치
    left?: string | number; // 좌측 위치
    right?: string | number; // 우측 위치
    width?: string; // 너비
    zIndex?: string; // z-index 값
}
```

## Slots

| Slot      | Description             |
| --------- | ----------------------- |
| `default` | 바 내부에 표시할 콘텐츠 |

## 특징

- **유연한 위치 지정**: `position` prop을 통해 `relative`, `absolute`, `fixed`, `sticky`, `static` CSS position 옵션 제공
- **시멘틱 HTML 지원**: `tag` prop을 통해 적절한 HTML 태그(`nav`, `header`, `footer`, `section` 등) 사용 가능
- **Primary 스타일**: 강조가 필요한 바에 적용할 수 있는 primary 스타일
