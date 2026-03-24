> English: [README.md](./README.md)

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

#### 전체 탭 비활성화 (Boolean)

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="tabs" :disabled="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
</script>
```

#### 조건부 탭 비활성화 (Function)

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

### 고정 Width

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="tabs" width="600px" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
</script>
```

### 반응형 Width

화면 크기에 따라 탭 너비를 조절할 수 있습니다.

```html
<template>
    <vs-grid>
        <vs-tabs
            v-model="selectedTab"
            :tabs="tabs"
            :width="{ xs: '100%', sm: '90%', md: '70%', lg: '50%', xl: '30%' }"
        />
    </vs-grid>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Home', 'Profile', 'Settings', 'Messages'];
</script>
```

### 고정 Height

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="tabs" height="60px" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
</script>
```

### 그리드 시스템 (Grid)

12컬럼 그리드 시스템에서 탭이 차지할 컬럼 수를 지정할 수 있습니다.

```html
<template>
    <vs-grid column-gap="16px" row-gap="16px">
        <vs-tabs v-model="selectedTab" :tabs="tabs" :grid="8" />
        <vs-tabs v-model="selectedTab" :tabs="tabs" :grid="4" />
    </vs-grid>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
</script>
```

### 반응형 Grid

화면 크기에 따라 그리드 컬럼 수를 조절할 수 있습니다.

```html
<template>
    <vs-grid column-gap="16px" row-gap="16px">
        <vs-tabs
            v-model="selectedTab"
            :tabs="tabs"
            :grid="{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }"
        />
        <vs-tabs
            v-model="selectedTab"
            :tabs="tabs"
            :grid="{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }"
        />
        <vs-tabs
            v-model="selectedTab"
            :tabs="tabs"
            :grid="{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }"
        />
    </vs-grid>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(0);
const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
</script>
```

## Props

| Prop            | Type                                                   | Default  | Required | Description                                                                    |
| --------------- | ------------------------------------------------------ | -------- | -------- | ------------------------------------------------------------------------------ |
| `colorScheme`   | `string`                                               | -        | -        | 컴포넌트 색상 테마                                                             |
| `styleSet`      | `string \| VsTabsStyleSet`                             | -        | -        | 커스텀 스타일 설정 객체                                                        |
| `width`         | `string \| number \| Breakpoints`                      | -        | -        | 탭 너비. 단일 값 또는 브레이크포인트 객체                                      |
| `grid`          | `string \| number \| Breakpoints`                      | -        | -        | 12컬럼 그리드 시스템에서 차지할 컬럼 수. 단일 값 또는 브레이크포인트 객체      |
| `height`        | `string \| number`                                     | `'auto'` | -        | 탭 높이                                                                        |
| `dense`         | `boolean`                                              | `false`  | -        | 조밀한 스타일 적용                                                             |
| `disabled`      | `boolean \| ((tab: string, index: number) => boolean)` | `false`  | -        | 탭 비활성화 여부. boolean이면 전체 탭에 적용되고, 함수면 각 탭마다 조건부 적용 |
| `primary`       | `boolean`                                              | `false`  | -        | primary 색상 테마 적용                                                         |
| `scrollButtons` | `'hide' \| 'show' \| 'auto'`                           | `'auto'` | -        | 스크롤 버튼 표시 방식                                                          |
| `tabs`          | `string[]`                                             | `[]`     | -        | 탭 레이블 배열                                                                 |
| `vertical`      | `boolean`                                              | `false`  | -        | 수직 레이아웃 적용                                                             |
| `modelValue`    | `number`                                               | `0`      | -        | 선택된 탭 인덱스 (v-model)                                                     |

## Events

| Event               | Parameters | Description                   |
| ------------------- | ---------- | ----------------------------- |
| `update:modelValue` | `number`   | v-model 값 변경 시 발생       |
| `change`            | `number`   | 선택된 탭 인덱스 변경 시 발생 |

## Types

```typescript
interface VsTabsStyleSet {
    variables?: {
        gap?: string;
        divider?: CSSProperties['border'];
    };
    tab?: CSSProperties;
    activeTab?: CSSProperties;
    scrollButton?: Omit<VsButtonStyleSet, 'loading'>;
}
```

> [!NOTE]
>
> `scrollButton`은 [VsButtonStyleSet](../vs-button/README.md#types)을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-tabs
        v-model="selectedTab"
        :tabs="tabs"
        :style-set="{
            variables: { gap: '0.5rem', divider: '2px solid #ccc' },
            tab: { fontWeight: '600' },
            activeTab: { backgroundColor: '#e8e8e8' },
            scrollButton: {
                variables: { padding: '0.4rem' },
                component: { borderRadius: '4px' },
            },
        }"
    />
</template>
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
- **반응형 지원**: `width`와 `grid` prop으로 다양한 화면 크기 대응
- **접근성**: ARIA 속성을 통한 스크린 리더 지원
