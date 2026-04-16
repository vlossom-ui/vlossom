> For English documentation, see [README.md](./README.md).

# VsAvatar

사용자 프로필 이미지, 이니셜, 또는 아이콘을 표시하기 위한 원형 또는 둥근 모서리 디스플레이 컴포넌트입니다.

**Available Version**: 2.0.0+

## Feature

- 기본 슬롯을 통해 이미지, 텍스트 이니셜, 아이콘 콘텐츠 수용
- `objectFit` CSS 변수를 통한 이미지 object-fit 커스터마이징 지원
- 배경 및 테두리 스타일링을 위한 색상 테마 지원
- 기본 크기(3.6rem × 3.6rem) 고정이며 `component` CSSProperties로 완전 재정의 가능

## Basic Usage

```html
<template>
    <vs-avatar>
        <img src="/profile.png" alt="사용자 아바타" />
    </vs-avatar>
</template>
```

### 텍스트 이니셜

```html
<template>
    <vs-avatar>JD</vs-avatar>
</template>
```

### 색상 테마 적용

```html
<template>
    <vs-avatar color-scheme="blue">
        <img src="/profile.png" alt="사용자" />
    </vs-avatar>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | 컴포넌트 색상 테마 |
| `styleSet` | `string \| VsAvatarStyleSet` | | | 커스텀 스타일 세트 |

## Types

```typescript
interface VsAvatarStyleSet {
    variables?: {
        objectFit?: CSSProperties['objectFit'] & {};
    };
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-avatar
        :style-set="{
            variables: {
                objectFit: 'cover',
            },
            component: {
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
            },
        }"
    >
        <img src="/profile.png" alt="사용자" />
    </vs-avatar>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | 아바타 콘텐츠 — 이미지, 이니셜, 아이콘 |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
