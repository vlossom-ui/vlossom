# VsDimmed

오버레이나 모달 같은 컴포넌트에서 배경을 어둡게 처리하는 컴포넌트입니다. 기본적으로 절대 위치로 부모 요소를 가득 채우며, opacity를 통한 애니메이션 효과를 지원합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 dimmed

```html
<template>
    <div class="relative h-screen w-full">
        <vs-dimmed v-model="isVisible" />
    </div>
</template>
```

### v-model로 on/off 제어

```html
<template>
    <div class="relative h-screen w-full">
        <button @click="isVisible = !isVisible">Toggle</button>
        <vs-dimmed v-model="isVisible" />
    </div>
</template>
```

### StyleSet 사용 예시

```html
<template>
    <div class="relative h-screen w-full">
        <vs-dimmed
            v-model="isVisible"
            :style-set="{
                component: {
                    backgroundColor: '#000000',
                    opacity: 0.6,
                    backdropFilter: 'blur(4px)',
                },
            }"
        />
    </div>
</template>
```

## Props

| Prop         | Type                         | Default | Required | Description                |
| ------------ | ---------------------------- | ------- | -------- | -------------------------- |
| `modelValue` | `boolean`                    | `false` | -        | dimmed 표시 여부 (v-model) |
| `styleSet`   | `string \| VsDimmedStyleSet` | -       | -        | 커스텀 스타일 설정 객체    |

## Types

```typescript
interface VsDimmedStyleSet {
    component?: CSSProperties;
}
```

## 특징

- **절대 위치**: 기본적으로 `position: absolute`로 부모 요소를 가득 채움 (`top: 0, left: 0, width: 100%, height: 100%`)
- **v-model 지원**: `v-model`을 통해 on/off 제어 가능
- **내장 애니메이션**: opacity 기반 페이드 인/아웃 효과가 내장되어 있음
- **접근성**: `aria-hidden="true"` 속성으로 스크린 리더에서 숨김 처리
- **커스터마이징**: CSS 변수와 styleSet을 통한 유연한 스타일 변경

## 주의사항

- 부모 요소에 `position: relative` 또는 `position: absolute` 스타일이 필요합니다
