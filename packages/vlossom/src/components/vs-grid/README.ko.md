> For English documentation, see [README.md](./README.md).

# VsGrid

구성 가능한 열 수, 간격 제어, 사용자 정의 크기를 지원하는 반응형 CSS 그리드 컨테이너 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- `gridSize`를 통해 구성 가능한 열 수를 가진 CSS Grid 레이아웃 (기본값: 12열)
- 독립적인 `columnGap` 및 `rowGap` 제어
- 명시적인 `width` 및 `height` 크기 조절 props
- `tag` prop을 통해 임의의 HTML 요소로 렌더링
- 자식 컴포넌트의 Vlossom 반응형 props(`width`, `grid`)와 통합
- 사용자 정의 컴포넌트 스타일 및 grid-size CSS 변수를 위한 `StyleSet` 노출

## 기본 사용법

```html
<template>
    <vs-grid :grid-size="12" :column-gap="16" :row-gap="8">
        <div style="grid-column: span 6">왼쪽</div>
        <div style="grid-column: span 6">오른쪽</div>
    </vs-grid>
</template>
```

### 사용자 정의 너비와 높이

```html
<template>
    <vs-grid width="800px" height="400px" :grid-size="3" :column-gap="8">
        <div>열 1</div>
        <div>열 2</div>
        <div>열 3</div>
    </vs-grid>
</template>
```

### 다른 태그로 렌더링

```html
<template>
    <vs-grid tag="ul" :grid-size="4">
        <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </vs-grid>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `styleSet` | `string \| VsGridStyleSet` | | | 컴포넌트의 사용자 정의 스타일 셋 |
| `gridSize` | `number \| string` | | | 그리드 열 수. 기본값은 12 |
| `columnGap` | `number \| string` | | | 그리드 열 사이의 간격 |
| `rowGap` | `number \| string` | | | 그리드 행 사이의 간격 |
| `width` | `string \| number` | | | 그리드 컨테이너의 너비 |
| `height` | `string \| number` | | | 그리드 컨테이너의 높이 |
| `tag` | `string` | `'div'` | | 렌더링할 HTML 태그 |

## 타입

```typescript
interface VsGridStyleSet {
    component?: CSSProperties;
    variables?: {
        gridSize?: number;
    };
}
```

### StyleSet 예시

```html
<template>
    <vs-grid
        :style-set="{
            variables: { gridSize: 6 },
            component: { backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px' },
        }"
    >
        <div>항목 1</div>
        <div>항목 2</div>
    </vs-grid>
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 그리드 항목들 |

## 메서드

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
