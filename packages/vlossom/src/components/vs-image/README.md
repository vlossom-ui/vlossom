# VsImage

이미지를 표시하는 컴포넌트입니다. 지연 로딩(Lazy Loading), 폴백 이미지, 로딩 스켈레톤 등 다양한 기능을 지원합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 이미지

```html
<template>
    <vs-image
        src="https://example.com/image.jpg"
        alt="Example Image"
    />
</template>
```

### 지연 로딩 (Lazy Loading)

```html
<template>
    <vs-image
        src="https://example.com/image.jpg"
        alt="Lazy Image"
        :lazy="true"
    />
</template>
```

### 폴백 이미지

```html
<template>
    <vs-image
        src="https://example.com/image.jpg"
        fallback="https://example.com/fallback.jpg"
        alt="Image with fallback"
    />
</template>
```

### 스켈레톤 로딩 상태

```html
<template>
    <vs-image
        src="https://example.com/image.jpg"
        alt="Image with skeleton"
    >
        <template #skeleton>
            로딩 중...
        </template>
    </vs-image>
</template>
```

## Props

| Prop         | Type                        | Default | Required | Description                     |
| ------------ | --------------------------- | ------- | -------- | ------------------------------- |
| `src`        | `string`                    | -       | ✅       | 이미지 소스 URL                 |
| `alt`        | `string`                    | `''`    | -        | 이미지 대체 텍스트              |
| `fallback`   | `string`                    | `''`    | -        | 로딩 실패 시 사용할 폴백 이미지 |
| `lazy`       | `boolean`                   | `false` | -        | 지연 로딩 활성화                |
| `noSkeleton` | `boolean`                   | `false` | -        | 로딩 중 스켈레톤 표시를 무시    |
| `styleSet`   | `string \| VsImageStyleSet` | -       | -        | 커스텀 스타일 설정 객체         |

## Slots

| Slot       | Description                                      |
| ---------- | ------------------------------------------------ |
| `skeleton` | 이미지 로딩 중 표시할 스켈레톤 콘텐츠 (선택사항) |

## Events

| Event   | Parameters | Description                         |
| ------- | ---------- | ----------------------------------- |
| `error` | -          | 이미지 로딩 실패 시 발생하는 이벤트 |

## Types

```typescript
import type { CSSProperties } from 'vue';
import type { VsSkeletonStyleSet } from '@/components/vs-skeleton/types';

interface VsImageStyleSet {
    variables?: {
        width?: string;
        height?: string;
    };
    skeleton?: VsSkeletonStyleSet;
    component?: CSSProperties;
}
```

> **참고**: `skeleton`은 [VsSkeletonStyleSet](../vs-skeleton/README.md#types)의 StyleSet을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-image
        src="https://example.com/image.jpg"
        alt="Sized Image"
        :style-set="{
            variables: {
                width: '300px',
                height: '300px',
            },
        }"
    />

    <!-- skeleton 커스텀 -->
    <vs-image
        src="https://example.com/image.jpg"
        alt="Custom Skeleton"
        :style-set="{
            variables: {
                width: '200px',
                height: '200px',
            },
            skeleton: {
                component: {
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e0e0',
                },
            },
        }"
    />
</template>
```

## 특징

- **지연 로딩**: IntersectionObserver를 사용한 효율적인 지연 로딩
- **폴백 지원**: 이미지 로딩 실패 시 자동으로 폴백 이미지 표시
- **로딩 상태**: 스켈레톤 UI로 로딩 상태 시각화
- **접근성**: alt 텍스트를 통한 접근성 지원
- **반응형**: 유연한 크기 조절과 object-fit을 통한 비율 유지
- **에러 핸들링**: 이미지 로딩 실패 시 error 이벤트 emit
