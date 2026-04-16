> For English documentation, see [README.md](./README.md).

# VsBlock

선택적 타이틀 영역과 스크롤 가능한 콘텐츠 영역을 갖춘 콘텐츠 블록 컴포넌트입니다.

**Available Version**: 2.0.0+

## Feature

- `VsInnerScroll`로 구동되는 스크롤 가능한 콘텐츠 영역
- 선택적 타이틀 슬롯이 분리된 헤더 영역에 렌더링
- `width`, `grid` prop을 통한 반응형 너비 제어
- `height` prop으로 블록의 전체 높이 지정
- `title`, `content` 영역에 CSSProperties를 통한 개별 스타일 제어

## Basic Usage

```html
<template>
    <vs-block>
        <p>블록 콘텐츠가 여기에 들어갑니다.</p>
    </vs-block>
</template>
```

### 타이틀과 함께 사용

```html
<template>
    <vs-block>
        <template #title>블록 타이틀</template>
        <p>블록 콘텐츠가 여기에 들어갑니다.</p>
    </vs-block>
</template>
```

### 고정 높이

```html
<template>
    <vs-block height="300px">
        <template #title>스크롤 가능한 블록</template>
        <p v-for="i in 20" :key="i">줄 {{ i }}</p>
    </vs-block>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | 컴포넌트 색상 테마 |
| `styleSet` | `string \| VsBlockStyleSet` | | | 커스텀 스타일 세트 |
| `width` | `string \| number \| Breakpoints` | | | 컴포넌트 너비 |
| `grid` | `string \| number \| Breakpoints` | | | 그리드 컬럼 스팬 |
| `height` | `string \| number` | | | 블록의 높이 |

## Types

```typescript
interface VsBlockStyleSet {
    variables?: {
        border?: string;
    };
    component?: CSSProperties;
    title?: CSSProperties;
    content?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-block
        :style-set="{
            variables: {
                border: '2px solid #6200ea',
            },
            component: {
                borderRadius: '1rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            },
            title: {
                backgroundColor: '#6200ea',
                color: '#ffffff',
                padding: '1rem 1.5rem',
            },
            content: {
                padding: '1.5rem',
            },
        }"
    >
        <template #title>스타일 블록</template>
        <p>커스텀 스타일이 적용된 콘텐츠.</p>
    </vs-block>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | 블록의 메인 콘텐츠 |
| `title` | 타이틀 헤더 영역에 렌더링되는 콘텐츠 |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
