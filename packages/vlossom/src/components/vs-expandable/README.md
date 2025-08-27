# VsExpandable

콘텐츠의 확장과 축소 애니메이션을 제공하는 컴포넌트입니다. 부드러운 트랜지션 효과로 사용자 경험을 향상시키며, 아코디언, 드롭다운, 토글 메뉴 등 다양한 UI 패턴에 활용할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 확장 가능한 콘텐츠

```html
<template>
    <div>
        <button @click="isOpen = !isOpen">
            {{ isOpen ? '축소' : '확장' }}
        </button>
        <vs-expandable :open="isOpen">
            <div>
                <p>확장 가능한 콘텐츠입니다.</p>
                <p>이 내용은 애니메이션과 함께 표시되거나 숨겨집니다.</p>
            </div>
        </vs-expandable>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
</script>
```

## Props

| Prop       | Type                             | Default | Required | Description             |
| ---------- | -------------------------------- | ------- | -------- | ----------------------- |
| `open`     | `boolean`                        | `false` | ✓        | 확장/축소 상태 제어     |
| `styleSet` | `string \| VsExpandableStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |

## Types

```typescript
interface VsExpandableStyleSet {
    backgroundColor?: string; // 배경 색상
    padding?: string; // 내부 여백
    fontColor?: string; // 텍스트 색상
    fontSize?: string; // 폰트 크기
    fontWeight?: string | number; // 폰트 굵기
    lineHeight?: string; // 줄 간격
    whiteSpace?: string; // 공백 처리 방식
}
```

## Slots

| Slot      | Description        |
| --------- | ------------------ |
| `default` | 확장/축소될 콘텐츠 |

## 특징

- **부드러운 애니메이션**: height와 opacity를 이용한 자연스러운 확장/축소 효과
- **동적 높이 계산**: 콘텐츠 크기에 따라 자동으로 높이 계산 및 애니메이션 적용
- **성능 최적화**: 트랜지션 완료 후 `height: auto`로 설정하여 반응형 동작 보장
- **유연한 사용법**: 아코디언, 드롭다운, 토글 메뉴 등 다양한 UI 패턴에 활용 가능
