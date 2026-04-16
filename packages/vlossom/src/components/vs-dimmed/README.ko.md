> For English documentation, see [README.md](./README.md).

# VsDimmed

페이드 전환 효과와 함께 부모 컨테이너를 덮는 반투명 오버레이 컴포넌트입니다.

**Available Version**: 2.0.0+

## Feature

- 프로그래밍 방식으로 가시성을 제어하는 `v-model` 바인딩
- 부드러운 페이드 인/아웃 전환 애니메이션
- 명령형 제어를 위한 `show()` 및 `hide()` 메서드 노출
- `component` CSSProperties를 통한 완전한 외관 커스터마이징

## Basic Usage

```html
<template>
    <div class="relative">
        <vs-dimmed v-model="isVisible" />
        <p>딤드 오버레이 뒤의 콘텐츠</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isVisible = ref(false);
</script>
```

### 프로그래밍 방식 제어

```html
<template>
    <div class="relative">
        <vs-dimmed ref="dimmedRef" v-model="isVisible" />
        <vs-button @click="dimmedRef.show()">딤드 표시</vs-button>
        <vs-button @click="dimmedRef.hide()">딤드 숨김</vs-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isVisible = ref(false);
const dimmedRef = ref(null);
</script>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `styleSet` | `string \| VsDimmedStyleSet` | | | 커스텀 스타일 세트 |
| `modelValue` | `boolean` | `false` | | 가시성을 위한 v-model 바인딩 |

## Types

```typescript
interface VsDimmedStyleSet {
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
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
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `boolean` | 가시성이 변경될 때 발생 |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `show` | — | 딤드 오버레이를 표시합니다 |
| `hide` | — | 딤드 오버레이를 숨깁니다 |

## Caution

- `VsDimmed`는 `position: absolute`를 사용하므로, 오버레이가 올바르게 덮이려면 부모 요소에 `position: relative`(또는 다른 non-static position)가 설정되어 있어야 합니다.
