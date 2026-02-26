# VsLabelValue

레이블과 값을 쌍으로 표시하는 컴포넌트입니다. 폼 정보, 사용자 프로필, 데이터 표시 등에 활용할 수 있으며, 다양한 스타일과 반응형 레이아웃을 지원합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 레이블-값

```html
<template>
    <vs-label-value>
        <template #label>이름</template>
        홍길동
    </vs-label-value>
</template>
```

### Primary 스타일

```html
<template>
    <vs-label-value primary>
        <template #label>중요한 정보</template>
        이것은 중요한 값입니다
    </vs-label-value>
</template>
```

### Dense 스타일

```html
<template>
    <vs-label-value dense>
        <template #label>압축된 레이블</template>
        작은 크기의 값
    </vs-label-value>
</template>
```

### 반응형 레이아웃

```html
<template>
    <!-- responsive 사용 시 컨테이너 768px 이하에서 세로 배치 -->
    <div class="max-w-md">
        <vs-label-value responsive>
            <template #label>긴 레이블 텍스트</template>
            이것은 반응형 동작을 테스트하기 위한 긴 값입니다.
            화면 크기가 작아지면 세로로 배치됩니다.
        </vs-label-value>
    </div>
</template>
```

## Props

| Prop                 | Type                             | Default | Required | Description                                    |
| -------------------- | -------------------------------- | ------- | -------- | ---------------------------------------------- |
| `colorScheme`        | `ColorScheme`                     | -       | -        | 컴포넌트 색상 테마                             |
| `styleSet`           | `string \| VsLabelValueStyleSet` | -       | -        | 커스텀 스타일 설정 객체                        |
| `width`              | `string`                         | -       | -        | 컴포넌트 너비 (예: `'400px'`)                  |
| `grid`               | `number`                         | -       | -        | 12 그리드 시스템 기반 너비 (1~12)              |
| `dense`              | `boolean`                        | `false` | -        | 압축된 스타일 적용                             |
| `primary`            | `boolean`                        | `false` | -        | 강조 스타일 적용                               |
| `vertical`           | `boolean`                        | `false` | -        | 레이블-값을 항상 세로 배치                     |
| `responsive`         | `boolean`                        | `false` | -        | 컨테이너 768px 이하에서 세로 배치로 전환       |

## Types

```typescript
import type { CSSProperties } from 'vue';

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
            variables: {
                border: '2px solid #e91e63',
            },
            label: {
                backgroundColor: '#f5f5f5',
                color: '#333',
                fontWeight: 600,
            },
            value: {
                backgroundColor: '#fff',
                color: '#666',
                padding: '1rem 2rem',
            },
        }"
    >
        <template #label>사용자 정의 스타일</template>
        커스터마이징된 값
    </vs-label-value>
</template>
```

## Slots

| Slot      | Description                 |
| --------- | --------------------------- |
| `label`   | 레이블 영역에 표시할 콘텐츠 |
| `default` | 값 영역에 표시할 콘텐츠     |

## 특징

- **세로/반응형 레이아웃**: `vertical`로 항상 세로 배치, `responsive`로 컨테이너 쿼리 768px 이하에서 세로 배치 전환
- **유연한 커스터마이징**: 레이블과 값 영역을 각각 독립적으로 스타일링 가능
- **Dense 모드**: 공간이 제한된 환경에서 사용할 수 있는 압축된 스타일
- **Primary 강조**: 중요한 정보를 강조하기 위한 primary 스타일
- **접근성**: 적절한 색상 대비와 시각적 계층 구조 제공
