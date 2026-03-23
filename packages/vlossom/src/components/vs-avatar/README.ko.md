> English: [README.md](./README.md)

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
    variables?: {
        objectFit?: string;
    };
    component?: CSSProperties;
}
```

## Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | 아바타 내용 (텍스트, 이미지, 아이콘 등) |

## StyleSet 사용 예시

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
                backgroundColor: '#e188e5',
                borderRadius: '50%',
            },
        }"
    >
        <img src="/path/to/avatar.jpg" alt="User Avatar" />
    </vs-avatar>
</template>
```

## 특징

- **유연한 컨텐츠**: 텍스트, 이미지, 아이콘 등 다양한 컨텐츠 지원
- **이미지 최적화**: `object-fit` 속성으로 이미지 비율 유지
