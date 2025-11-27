# VsTabs

탭 네비게이션을 위한 컴포넌트입니다. 수평/수직 레이아웃과 스크롤 버튼을 지원하여 다양한 탭 인터페이스를 구성할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 탭

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="tabs" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
</script>
```

### 수직 탭

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="tabs" vertical />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
</script>
```

### 커스텀 탭 콘텐츠

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="tabs">
        <template #tab="{ tab, index }">
            <span>🎉 {{ tab }}</span>
        </template>
    </vs-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Home', 'Profile', 'Settings'];
</script>
```

### 비활성화된 탭

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="tabs" :disabled="isTabDisabled" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(1);
const tabs = ['Tab 0', 'Tab 1', 'Tab 2', 'Tab 3'];

function isTabDisabled(tab: string, index: number): boolean {
    return index % 2 === 0; // 짝수 인덱스 비활성화
}
</script>
```

특정 인덱스를 비활성화하려면:

```typescript
function isTabDisabled(tab: string, index: number): boolean {
    return [1, 3].includes(index);
}
```

### Primary 색상 테마

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="tabs" primary />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'];
</script>
```

### 스크롤 버튼 표시

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="tabs" scroll-buttons="show" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4', 'Tab 5', 'Tab 6', 'Tab 7', 'Tab 8'];
</script>
```

## Props

| Prop            | Type                                      | Default     | Required | Description                      |
| --------------- | ----------------------------------------- | ----------- | -------- | -------------------------------- |
| `colorScheme`   | `string`                                  | -           | -        | 탭의 색상 테마                   |
| `styleSet`      | `string \| VsTabsStyleSet`                | -           | -        | 커스텀 스타일 설정 객체          |
| `dense`         | `boolean`                                 | `false`     | -        | 조밀한 스타일 적용               |
| `disabled`      | `(tab: string, index: number) => boolean` | `undefined` | -        | 탭 비활성화 여부를 판별하는 함수 |
| `primary`       | `boolean`                                 | `false`     | -        | primary 색상 테마 적용           |
| `scrollButtons` | `'hide' \| 'show' \| 'auto'`              | `'auto'`    | -        | 스크롤 버튼 표시 방식            |
| `tabs`          | `string[]`                                | -           | ✅       | 탭 레이블 배열                   |
| `vertical`      | `boolean`                                 | `false`     | -        | 수직 레이아웃 적용               |
| `modelValue`    | `number`                                  | `0`         | -        | 선택된 탭 인덱스 (v-model)       |

## Events

| Event               | Parameters | Description                   |
| ------------------- | ---------- | ----------------------------- |
| `update:modelValue` | `number`   | 선택된 탭 인덱스 변경 시 발생 |
| `change`            | `number`   | 선택된 탭 인덱스 변경 시 발생 |

## Types

```typescript
interface VsTabsStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: number;

    height?: string;
    gap?: string;
    tabWidth?: string;
}
```

## Slots

| Slot  | Props            | Description           |
| ----- | ---------------- | --------------------- |
| `tab` | `{ tab, index }` | 각 탭의 커스텀 콘텐츠 |

## 특징

- **수평/수직 레이아웃**: `vertical` prop으로 레이아웃 전환
- **키보드 네비게이션**: 화살표 키, Home, End 키로 탭 이동
- **스크롤 지원**: 긴 탭 목록에 대한 스크롤 및 스크롤 버튼 제공
- **비활성화**: 특정 탭을 비활성화하여 선택 제한
- **접근성**: ARIA 속성을 통한 스크린 리더 지원
