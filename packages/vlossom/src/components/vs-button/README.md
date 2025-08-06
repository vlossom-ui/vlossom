# VsButton

버튼 역할을 하는 컴포넌트입니다.

**Available Version**: 2.0.0+

## 기본 사용법

<!-- 컴포넌트 이미지 -->

```vue
<template>
    <vs-button > 클릭하세요 </vs-button>
</template>
```

## Props

| Prop          | Type                         | Default  | Description                |
| ------------- | ---------------------------- | -------- | -------------------------- |
| `disabled`    | `boolean`                    | `false`  | 비활성화 상태              |
| `colorScheme` | `ColorScheme`                | -        | 색상 스키마 설정           |
| `styleSet`    | `string \| VsButtonStyleSet` | -        | 스타일 커스터마이징        |
| `dense`       | `boolean`                    | `false`  | 조밀한 크기                |
| `large`       | `boolean`                    | `false`  | 큰 크기                    |
| `primary`     | `boolean`                    | `false`  | 주요 버튼 스타일           |
| `outline`     | `boolean`                    | `false`  | 아웃라인 스타일            |
| `circle`      | `boolean`                    | `false`  | 원형 버튼                  |
| `loading`     | `boolean`                    | `false`  | 로딩 상태                  |
| `responsive`  | `boolean`                    | `false`  | 화면 너비에 따라 크기 변경 |
| `state`       | `UIState`                    | `'idle'` | 컴포넌트 상태              |

## Types

```typescript
interface VsButtonStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    fontColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    height?: string;
    padding?: string;
    width?: string;
    circleSize?: string;
}
```

<!--
## 예시
### 기본

```vue
<template>
    <vs-button > 기본 버튼 </vs-button>
    <vs-button disabled> disabled </vs-button>
</template>
```

### 색상 스키마

```vue

<template>
    <vs-button color-scheme="none" > none </vs-button>
    <vs-button color-scheme="gray" > gray </vs-button>
    <vs-button color-scheme="red" > red </vs-button>
    <vs-button color-scheme="orange" > orange </vs-button>
    <vs-button color-scheme="yellow" > yellow </vs-button>
    <vs-button color-scheme="yellow-green" > yellow-green </vs-button>
    <vs-button color-scheme="green" > green </vs-button>
    <vs-button color-scheme="teal" > teal </vs-button>
    <vs-button color-scheme="light-blue" > light-blue </vs-button>
    <vs-button color-scheme="blue" > blue </vs-button>
    <vs-button color-scheme="indigo" > indigo </vs-button>
    <vs-button color-scheme="purple" > purple </vs-button>
    <vs-button color-scheme="pink" > pink </vs-button>
    <vs-button color-scheme="brown" > brown </vs-button>
</template>
```

### 커스텀 스타일

```vue
<template>
    <vs-button :style-set="{
            backgroundColor: '#007bff',
            border: '2px solid #0056b3',
            borderRadius: '8px',
            fontColor: '#ffffff',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '12px 24px',
            width: '200px',
        }"
    >
    custom
    </vs-button>
</template>
```

### 크기

```vue
<template>
    <vs-button dense > 작은 버튼 </vs-button>
    <vs-button > 기본 크기 </vs-button>
    <vs-button large > 큰 버튼 </vs-button>
</template>
```

### 프리셋 스타일

```vue
<template>
    <vs-button primary > primary </vs-button>
    <vs-button outline > outline </vs-button>
    <vs-button circle > circle </vs-button>
    <vs-button loading > loading </vs-button>
</template>
```

### 반응형 버튼

```vue
<template>
    <vs-button responsive > 반응형 버튼 </vs-button>
</template>
```

### 상태별 사용

```vue
<template>
    <vs-button state="idle"> idle </vs-button>
    <vs-button state="success"> success </vs-button>
    <vs-button state="info"> info </vs-button>
    <vs-button state="error"> error </vs-button>
    <vs-button state="warning"> warning </vs-button>
    <vs-button state="selected"> selected </vs-button>
</template>
``` -->
