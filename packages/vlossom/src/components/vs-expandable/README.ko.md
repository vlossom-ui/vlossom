> For English documentation, see [README.md](./README.md).

# VsExpandable

`open` prop으로 제어되는 애니메이션이 있는 확장/축소 콘텐츠 컨테이너 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 확장/축소 시 부드러운 높이 및 불투명도 애니메이션
- 필수 `open` boolean prop으로 제어
- 기본 슬롯 외 추가 DOM 래퍼가 필요 없는 경량 래퍼
- `styleSet`을 통한 사용자 정의 콘텐츠 스타일링 지원

## 기본 사용법

```html
<template>
    <vs-button @click="isOpen = !isOpen">토글</vs-button>
    <vs-expandable :open="isOpen">
        <p>이 콘텐츠는 애니메이션과 함께 확장 및 축소됩니다.</p>
    </vs-expandable>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### 사용자 정의 스타일 콘텐츠

```html
<template>
    <vs-expandable
        :open="isOpen"
        :style-set="{
            component: { backgroundColor: '#f0f4ff', padding: '1.5rem', borderRadius: '8px' },
        }"
    >
        <p>스타일이 적용된 확장 가능한 콘텐츠.</p>
    </vs-expandable>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `styleSet` | `string \| VsExpandableStyleSet` | | | 컴포넌트의 사용자 정의 스타일 셋 |
| `open` | `boolean` | `false` | ✓ | 콘텐츠가 확장되어 있는지 제어 |

## 타입

```typescript
interface VsExpandableStyleSet {
    component?: CSSProperties;
}
```

### StyleSet 예시

```html
<template>
    <vs-expandable
        :open="true"
        :style-set="{
            component: { backgroundColor: '#fff8e1', padding: '2rem', borderLeft: '4px solid orange' },
        }"
    >
        <p>강조된 확장 가능한 콘텐츠.</p>
    </vs-expandable>
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 표시하거나 숨길 콘텐츠 |

## 메서드

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
