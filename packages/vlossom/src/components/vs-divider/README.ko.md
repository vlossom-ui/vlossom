> For English documentation, see [README.md](./README.md).

# VsDivider

콘텐츠 섹션을 시각적으로 구분하는 수평 또는 수직 선 구분자 컴포넌트입니다.

**Available Version**: 2.0.0+

## Feature

- 수평(기본값) 및 수직 방향 지원
- 작은 컨테이너에서 수직 구분자를 수평으로 전환하는 반응형 모드
- CSS 변수를 통한 테두리 스타일, 너비/높이, 여백 커스터마이징
- 테마가 적용된 구분자를 위한 색상 테마 지원

## Basic Usage

```html
<template>
    <p>섹션 A</p>
    <vs-divider />
    <p>섹션 B</p>
</template>
```

### 수직 구분자

```html
<template>
    <div style="display: flex; align-items: center; height: 2rem;">
        <span>항목 1</span>
        <vs-divider vertical />
        <span>항목 2</span>
    </div>
</template>
```

### 반응형 수직 구분자

```html
<template>
    <div style="display: flex; align-items: center;">
        <span>왼쪽</span>
        <vs-divider vertical responsive />
        <span>오른쪽</span>
    </div>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | 컴포넌트 색상 테마 |
| `styleSet` | `string \| VsDividerStyleSet` | | | 커스텀 스타일 세트 |
| `responsive` | `boolean` | `false` | | 작은 컨테이너 너비에서 수직 구분자를 수평으로 전환 |
| `vertical` | `boolean` | `false` | | 수평 대신 수직 구분자 렌더링 |

## Types

```typescript
interface VsDividerStyleSet {
    variables?: {
        border?: string;

        horizontal?: {
            width?: string;
            margin?: string;
        };

        vertical?: {
            height?: string;
            margin?: string;
        };
    };
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-divider
        :style-set="{
            variables: {
                border: '2px dashed #6200ea',
                horizontal: {
                    width: '80%',
                    margin: '1rem auto',
                },
            },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
