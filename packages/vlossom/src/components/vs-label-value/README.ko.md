# VsLabelValue

상세 보기 및 데이터 테이블에 유용한, 라벨 셀과 값 셀을 나란히 표시하는 2열 컴포넌트입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- 설정 가능한 테두리를 갖춘 나란한 라벨과 값 레이아웃을 제공합니다.
- Primary 색상 모드는 라벨 영역을 기본 색상 스킴으로 강조합니다.
- Dense 모드는 컴팩트한 표시를 위해 패딩과 폰트 크기를 줄입니다.
- 수직 모드는 라벨과 값 셀을 세로로 쌓습니다.
- 반응형 수직 모드는 좁은 컨테이너에서 자동으로 세로 레이아웃으로 전환됩니다.

## Basic Usage

```html
<template>
    <vs-label-value>
        <template #label>이름</template>
        홍길동
    </vs-label-value>
</template>
```

### Primary 모드

```html
<template>
    <vs-label-value :primary="true">
        <template #label>상태</template>
        활성
    </vs-label-value>
</template>
```

### 수직 레이아웃

```html
<template>
    <vs-label-value :vertical="true">
        <template #label>설명</template>
        긴 설명 텍스트가 여기에 들어갑니다.
    </vs-label-value>
</template>
```

### Dense 모드

```html
<template>
    <vs-label-value :dense="true">
        <template #label>ID</template>
        12345
    </vs-label-value>
</template>
```

### 반응형 수직

좁은 컨테이너에서 자동으로 수직 레이아웃으로 전환됩니다.

```html
<template>
    <vs-label-value :responsive="true">
        <template #label>주소</template>
        서울시 강남구 123번지
    </vs-label-value>
</template>
```

## Props

| Prop          | Type                             | Default | Required | Description                                          |
| ------------- | -------------------------------- | ------- | -------- | ---------------------------------------------------- |
| `colorScheme` | `string`                         | -       | -        | 컴포넌트의 색상 스킴.                                |
| `styleSet`    | `string \| VsLabelValueStyleSet` | -       | -        | 컴포넌트의 커스텀 스타일 셋.                         |
| `width`       | `string \| number \| Breakpoints`| -       | -        | 컴포넌트 너비.                                       |
| `grid`        | `string \| number \| Breakpoints`| -       | -        | 레이아웃의 그리드 열 span.                           |
| `dense`       | `boolean`                        | `false` | -        | 컴팩트 표시를 위해 패딩 및 폰트 크기를 줄입니다.     |
| `primary`     | `boolean`                        | `false` | -        | 라벨 셀에 기본 색상 스킴을 적용합니다.               |
| `vertical`    | `boolean`                        | `false` | -        | 라벨과 값 셀을 세로로 쌓습니다.                      |
| `responsive`  | `boolean`                        | `false` | -        | 좁은 컨테이너에서 자동으로 세로 레이아웃으로 전환.   |

## Types

```typescript
interface VsLabelValueStyleSet {
    variables?: {
        border?: string;
    };
    component?: CSSProperties;
    label?: CSSProperties;
    value?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-label-value
        :style-set="{
            variables: { border: '2px solid #007bff' },
            component: { borderRadius: '8px' },
            label: { backgroundColor: '#e7f0ff', color: '#007bff', fontWeight: '700' },
            value: { padding: '0 1.5rem' },
        }"
    >
        <template #label>프로젝트</template>
        Vlossom UI
    </vs-label-value>
</template>
```

## Events

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## Slots

| 슬롯      | 설명             |
| --------- | ---------------- |
| `default` | 값 셀 콘텐츠.    |
| `label`   | 라벨 셀 콘텐츠.  |

## Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
