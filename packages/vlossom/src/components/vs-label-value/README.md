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
    <!-- 화면 크기가 작아지면 세로로 배치됩니다 -->
    <div class="max-w-md">
        <vs-label-value>
            <template #label>긴 레이블 텍스트</template>
            이것은 반응형 동작을 테스트하기 위한 긴 값입니다.
            화면 크기가 작아지면 세로로 배치됩니다.
        </vs-label-value>
    </div>
</template>
```

## Props

| Prop          | Type                             | Default | Required | Description             |
| ------------- | -------------------------------- | ------- | -------- | ----------------------- |
| `colorScheme` | `ColorScheme`                    | -       | -        | 컴포넌트 색상 테마      |
| `styleSet`    | `string \| VsLabelValueStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |
| `dense`       | `boolean`                        | `false` | -        | 압축된 스타일 적용      |
| `primary`     | `boolean`                        | `false` | -        | 강조 스타일 적용        |

## Types

```typescript
interface VsLabelValueStyleSet {
    border?: string;
    borderRadius?: string;
    opacity?: string | number;

    label?: {
        fontColor?: string;
        fontSize?: string;
        fontWeight?: number;

        backgroundColor?: string;
        padding?: string;
        verticalAlign?: string;
        width?: string;
    };

    value?: {
        fontColor?: string;
        fontSize?: string;
        fontWeight?: number;

        backgroundColor?: string;
        padding?: string;
        verticalAlign?: string;
    };
}
```

## Slots

| Slot      | Description                 |
| --------- | --------------------------- |
| `label`   | 레이블 영역에 표시할 콘텐츠 |
| `default` | 값 영역에 표시할 콘텐츠     |

## 특징

- **반응형 레이아웃**: 컨테이너 쿼리를 사용하여 768px 이하에서 자동으로 세로 배치로 전환
- **Tailwind CSS 통합**: Tailwind 클래스와 CSS 변수의 하이브리드 접근 방식으로 최적화된 스타일링
- **유연한 커스터마이징**: 레이블과 값 영역을 각각 독립적으로 스타일링 가능
- **Dense 모드**: 공간이 제한된 환경에서 사용할 수 있는 압축된 스타일
- **Primary 강조**: 중요한 정보를 강조하기 위한 primary 스타일
- **접근성**: 적절한 색상 대비와 시각적 계층 구조 제공
