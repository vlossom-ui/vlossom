# VsSkeleton

콘텐츠가 로딩 중일 때 보여주는 스켈레톤 UI 컴포넌트입니다. 부드러운 깜빡임 애니메이션으로 사용자에게 로딩 상태를 시각적으로 전달합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 스켈레톤

```html
<template>
    <div class="w-[200px] h-[100px]">
        <vs-skeleton />
    </div>
</template>
```

### 텍스트가 있는 스켈레톤

```html
<template>
    <div class="w-[200px] h-[100px]">
        <vs-skeleton>Loading...</vs-skeleton>
    </div>
</template>
```

### 컬러 스키마 적용

```html
<template>
    <div class="flex gap-4">
        <div class="w-[100px] h-[60px]">
            <vs-skeleton color-scheme="primary" />
        </div>
        <div class="w-[100px] h-[60px]">
            <vs-skeleton color-scheme="success" />
        </div>
        <div class="w-[100px] h-[60px]">
            <vs-skeleton color-scheme="warning" />
        </div>
    </div>
</template>
```

### 커스텀 스타일링

```html
<template>
    <div class="w-[150px] h-[80px]">
        <vs-skeleton :style-set="customStyle" />
    </div>
</template>

<script setup>
const customStyle = {
    backgroundColor: '#e0e0e0',
    borderRadius: '12px',
    width: '100%',
    height: '100%'
};
</script>
```

## Props

| Prop          | Type                           | Default | Required | Description             |
| ------------- | ------------------------------ | ------- | -------- | ----------------------- |
| `colorScheme` | `ColorScheme`                  | -       | -        | 컴포넌트 색상 테마      |
| `styleSet`    | `string \| VsSkeletonStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |

## Slots

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
| `default` | 스켈레톤 위에 표시할 텍스트나 콘텐츠 (선택사항) |

## Types

```typescript
interface VsSkeletonStyleSet {
    backgroundColor?: string; // 배경색
    borderRadius?: string; // 모서리 둥글기
    fontColor?: string; // 텍스트 색상
    fontSize?: string; // 폰트 크기
    height?: string; // 높이
    width?: string; // 너비
}
```

## CSS 변수

컴포넌트는 다음 CSS 변수를 생성합니다:

- `--vs-skeleton-backgroundColor`: 스켈레톤 배경색
- `--vs-skeleton-borderRadius`: 모서리 둥글기
- `--vs-skeleton-color`: 텍스트 색상
- `--vs-skeleton-fontSize`: 폰트 크기
- `--vs-skeleton-height`: 높이
- `--vs-skeleton-width`: 너비

## 특징

- **부드러운 애니메이션**: 0.8초 주기의 깜빡임 애니메이션으로 로딩 상태 표현
- **반응형 크기**: 부모 컨테이너의 크기에 맞춰 자동 조절 (기본 100%)
- **유연한 콘텐츠**: slot을 통해 로딩 텍스트나 아이콘 표시 가능
- **테마 시스템**: colorScheme을 통한 일관된 디자인 적용
- **커스터마이징**: CSS 변수와 styleSet을 통한 세밀한 스타일 제어
