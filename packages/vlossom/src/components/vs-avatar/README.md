# VsAvatar

사용자 프로필 이미지, 이니셜, 아이콘 등을 표시하는 아바타 컴포넌트입니다. 다양한 크기와 스타일 커스터마이징을 지원합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 이미지 아바타

```html
<template>
    <vs-avatar>
        <img src="/path/to/avatar.jpg" alt="User Avatar" />
    </vs-avatar>
</template>
```

### 커스텀 스타일링

```html
<template>
    <vs-avatar :style-set="customStyle">Custom</vs-avatar>
</template>

<script setup>
const customStyle = {
    width: '5rem',
    height: '5rem',
    backgroundColor: '#e188e5',
    fontColor: '#fff',
    borderRadius: '50%',
    fontSize: '1.5rem',
    fontWeight: '600'
};
</script>
```

## Props

| Prop          | Type                         | Default | Required | Description             |
| ------------- | ---------------------------- | ------- | -------- | ----------------------- |
| `colorScheme` | `ColorScheme`                | -       | -        | 컴포넌트 색상 테마      |
| `styleSet`    | `string \| VsAvatarStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |

## Types

```typescript
interface VsAvatarStyleSet {
    backgroundColor?: string; // 배경 색상
    border?: string; // 테두리 스타일
    borderRadius?: string; // 모서리 둥글기
    fontColor?: string; // 텍스트 색상
    fontSize?: string; // 폰트 크기
    fontWeight?: string | number; // 폰트 굵기
    height?: string; // 높이
    objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down'; // 이미지 맞춤 방식
    width?: string; // 너비
}
```

## Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | 아바타 내용 (텍스트, 이미지, 아이콘 등) |

## CSS 변수

컴포넌트는 다음 CSS 변수를 생성합니다:

- `--vs-avatar-backgroundColor`: 배경 색상
- `--vs-avatar-border`: 테두리 스타일
- `--vs-avatar-borderRadius`: 모서리 둥글기
- `--vs-avatar-fontColor`: 텍스트 색상
- `--vs-avatar-fontSize`: 폰트 크기
- `--vs-avatar-fontWeight`: 폰트 굵기
- `--vs-avatar-height`: 높이
- `--vs-avatar-width`: 너비
- `--vs-avatar-objectFit`: 이미지 맞춤 방식

## 특징

- **유연한 컨텐츠**: 텍스트, 이미지, 아이콘 등 다양한 컨텐츠 지원
- **이미지 최적화**: `object-fit` 속성으로 이미지 비율 유지
