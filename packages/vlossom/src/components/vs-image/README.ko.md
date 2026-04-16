# VsImage

이미지를 표시하는 컴포넌트로, 지연 로딩, 대체 이미지, 로딩 중 스켈레톤 플레이스홀더를 지원합니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- `src`, `alt`, `fallback` props를 통해 이미지를 표시합니다.
- 이미지 로딩 중 스켈레톤 플레이스홀더를 보여줍니다.
- Intersection Observer API를 통한 지연 로딩을 지원합니다.
- 로드 오류 시 `fallback` 이미지로 자동 전환됩니다.
- 이미지 로드 실패 시 `error` 이벤트를 발생시킵니다.

## Basic Usage

```html
<template>
    <vs-image src="https://example.com/image.png" alt="예시 이미지" />
</template>
```

### 지연 로딩

요소가 뷰포트에 진입할 때까지 이미지 로딩을 지연합니다.

```html
<template>
    <vs-image src="https://example.com/image.png" alt="지연 로딩 이미지" :lazy="true" />
</template>
```

### 대체 이미지

기본 소스 로드 실패 시 표시할 대체 이미지 URL을 제공합니다.

```html
<template>
    <vs-image
        src="https://example.com/broken.png"
        fallback="https://example.com/fallback.png"
        alt="대체 이미지 포함"
    />
</template>
```

### 스켈레톤 비활성화

로딩 중 스켈레톤 플레이스홀더를 비활성화합니다.

```html
<template>
    <vs-image src="https://example.com/image.png" alt="스켈레톤 없음" :no-skeleton="true" />
</template>
```

## Props

| Prop        | Type                           | Default | Required | Description                                      |
| ----------- | ------------------------------ | ------- | -------- | ------------------------------------------------ |
| `styleSet`  | `string \| VsImageStyleSet`    | -       | -        | 컴포넌트의 커스텀 스타일 셋.                     |
| `alt`       | `string`                       | `''`    | -        | 이미지 요소의 alt 텍스트.                        |
| `fallback`  | `string`                       | `''`    | -        | 기본 src 실패 시 표시할 대체 이미지 URL.         |
| `lazy`      | `boolean`                      | `false` | -        | Intersection Observer를 사용한 지연 로딩 활성화. |
| `noSkeleton`| `boolean`                      | `false` | -        | 로딩 중 스켈레톤 플레이스홀더 비활성화.          |
| `src`       | `string`                       | `''`    | `true`   | 이미지의 소스 URL.                               |

## Types

```typescript
interface VsImageStyleSet {
    variables?: {
        width?: string;
        height?: string;
    };
    skeleton?: VsSkeletonStyleSet;
    component?: CSSProperties;
}
```

> [!NOTE]
> `skeleton`은 `VsSkeletonStyleSet`을 사용합니다. 자세한 내용은 [VsSkeleton README](../vs-skeleton/README.md)를 참고하세요.

### StyleSet 사용 예시

```html
<template>
    <vs-image
        src="https://example.com/image.png"
        alt="스타일 적용 이미지"
        :style-set="{
            variables: { width: '200px', height: '200px' },
            component: { borderRadius: '8px', objectFit: 'cover' },
            skeleton: { component: { borderRadius: '8px' } },
        }"
    />
</template>
```

## Events

| 이벤트  | 페이로드 | 설명                              |
| ------- | -------- | --------------------------------- |
| `error` | -        | 이미지 로드 실패 시 발생합니다.   |

## Slots

| 슬롯       | 설명                                         |
| ---------- | -------------------------------------------- |
| `skeleton` | 스켈레톤 상태에서 표시할 커스텀 콘텐츠.      |

## Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
