# VsMenuButton

메뉴의 열기/닫기를 제어하는 토글 버튼 컴포넌트입니다. 햄버거 메뉴나 모바일 네비게이션에서 주로 사용됩니다.

**Available Version**: 2.0.0+

## 기본 사용법

```vue
<template>
    <vs-menu-button v-model="isMenuOpen" @change="onMenuToggle" />
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

function onMenuToggle() {
    console.log('Menu toggled:', isMenuOpen.value);
}
</script>
```

### 크기 조정

```vue
<template>
    <vs-menu-button size="2rem" />
    <vs-menu-button size="4rem" />
    <vs-menu-button size="5rem" />
</template>
```

### 선택된 상태

```vue
<template>
    <vs-menu-button :selected="true" />
</template>
```

### 커스텀 스타일링

```vue
<template>
    <vs-menu-button :style-set="customStyle" />
</template>

<script setup>
const customStyle = {
    backgroundColor: '#f0f0f0',
    border: '2px solid #333',
    borderRadius: '8px',
    fontColor: '#333'
};
</script>
```

## Props

| Prop          | Type                             | Default    | Required | Description                   |
| ------------- | -------------------------------- | ---------- | -------- | ----------------------------- |
| `colorScheme` | `ColorScheme`                    | -          | -        | 색상 스키마 설정              |
| `styleSet`    | `string \| VsMenuButtonStyleSet` | -          | -        | 스타일 커스터마이징           |
| `selected`    | `boolean`                        | `false`    | -        | 선택된 상태 표시              |
| `size`        | `string`                         | `'3.2rem'` | -        | 버튼 크기 (width, height)     |
| `modelValue`  | `boolean`                        | `false`    | -        | v-model을 통한 열림/닫힘 상태 |

## Events

| Event               | Parameters | Description                      |
| ------------------- | ---------- | -------------------------------- |
| `update:modelValue` | `boolean`  | v-model 값이 변경될 때 발생      |
| `change`            | -          | 버튼이 클릭되어 상태가 변경될 때 |

## Types

```typescript
interface VsMenuButtonStyleSet {
    backgroundColor?: string; // 배경 색상
    border?: string; // 테두리 스타일
    borderRadius?: string; // 모서리 둥글기
    fontColor?: string; // 아이콘 색상
}
```

## 특징

- **v-model 지원**: 양방향 데이터 바인딩으로 메뉴 상태 관리
- **유연한 크기**: size prop으로 다양한 크기 설정 가능
- **선택 상태**: selected prop으로 활성 상태 시각적 피드백
- **이벤트 처리**: change 이벤트로 상태 변경 감지
