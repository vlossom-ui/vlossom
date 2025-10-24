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

## Props

| Prop          | Type                         | Default | Required | Description             |
| ------------- | ---------------------------- | ------- | -------- | ----------------------- |
| `colorScheme` | `ColorScheme`                | -       | -        | 컴포넌트 색상 테마      |
| `styleSet`    | `string \| VsAvatarStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |

## Types

```typescript
interface VsAvatarStyleSet {
    width?: string; // 너비
    height?: string; // 높이

    backgroundColor?: string; // 배경 색상
    border?: string; // 테두리 스타일
    borderRadius?: string; // 모서리 둥글기
    opacity?: number; // 투명도

    fontColor?: string; // 텍스트 색상
    objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down'; // 이미지 맞춤 방식
}
```

## Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | 아바타 내용 (텍스트, 이미지, 아이콘 등) |

## 특징

- **유연한 컨텐츠**: 텍스트, 이미지, 아이콘 등 다양한 컨텐츠 지원
- **이미지 최적화**: `object-fit` 속성으로 이미지 비율 유지
