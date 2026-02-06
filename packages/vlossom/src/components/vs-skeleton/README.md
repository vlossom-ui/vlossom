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
    backGround?: CSSProperties;
    inner?: CSSProperties;
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <div class="w-[200px] h-[100px]">
        <vs-skeleton
            :style-set="{
                component: {
                    borderRadius: '12px',
                },
                backGround: {
                    backgroundColor: '#e0e0e0',
                },
                inner: {
                    color: '#999999',
                },
            }"
        >
            Loading...
        </vs-skeleton>
    </div>
</template>
```

## 특징

- **부드러운 애니메이션**: 1초 주기의 깜빡임 애니메이션으로 로딩 상태 표현
- **반응형 크기**: 부모 컨테이너의 크기에 맞춰 자동 조절 (기본 100%)
- **유연한 콘텐츠**: slot을 통해 로딩 텍스트나 아이콘 표시 가능
- **커스터마이징**: styleSet을 통한 세밀한 스타일 제어
