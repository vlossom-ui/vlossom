# VsSteps

다단계 프로세스를 나타내는 스텝 인디케이터 컴포넌트입니다. 수평/수직 레이아웃과 진행 바를 제공하여 사용자가 현재 진행 상황을 쉽게 파악할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 스텝

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(0);
const steps = ['Account', 'Profile', 'Settings', 'Complete'];
</script>
```

### 수직 스텝

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" vertical height="300px" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1);
const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
</script>
```

### 레이블 없는 스텝

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" no-label />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1);
const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
</script>
```

### 커스텀

슬롯을 사용하여 스텝 번호와 레이블을 커스터마이징할 수 있습니다. `isSelected`, `isPrevious`, `isDisabled` 상태를 활용하여 동적인 UI를 구현할 수 있습니다.

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps">
        <template #step="{ step, index, isSelected, isPrevious }">
            <span>{{ isPrevious ? '✓' : isSelected ? '●' : '○' }}</span>
        </template>
        <template #label="{ step, index, isSelected }">
            <span :style="{ fontWeight: isSelected ? '700' : '400' }">{{ step }}</span>
        </template>
    </vs-steps>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1);
const steps = ['Preparing', 'Processing', 'Review', 'Complete'];
</script>
```

### 비활성화된 스텝

#### 전체 스텝 비활성화 (Boolean)

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" :disabled="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(0);
const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
</script>
```

#### 조건부 스텝 비활성화 (Function)

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" :disabled="isStepDisabled" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(0);
const steps = ['Step 0', 'Step 1', 'Step 2', 'Step 3'];

function isStepDisabled(step: string, index: number): boolean {
    return index % 2 === 0;
}
</script>
```

특정 인덱스를 비활성화하려면:

```typescript
function isStepDisabled(step: string, index: number): boolean {
    return [1, 3].includes(index);
}
```

### 스텝 간격 조절

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" gap="3rem" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1);
const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
</script>
```

### 고정 Width/Height

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" width="500px" height="300px" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1);
const steps = ['Step 1', 'Step 2', 'Step 3'];
</script>
```

### 반응형 Width

화면 크기에 따라 스텝 너비를 조절할 수 있습니다.

```html
<template>
    <vs-grid>
        <vs-steps
            v-model="currentStep"
            :steps="steps"
            :width="{ xs: '100%', sm: '90%', md: '70%', lg: '50%', xl: '30%' }"
        />
    </vs-grid>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1);
const steps = ['Account', 'Profile', 'Settings', 'Complete'];
</script>
```

### 그리드 시스템 (Grid)

12컬럼 그리드 시스템에서 스텝이 차지할 컬럼 수를 지정할 수 있습니다.

```html
<template>
    <vs-grid column-gap="16px" row-gap="16px">
        <vs-steps v-model="currentStep" :steps="steps" :grid="8" />
        <vs-steps v-model="currentStep" :steps="steps" :grid="4" />
    </vs-grid>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1);
const steps = ['Step 1', 'Step 2', 'Step 3'];
</script>
```

### 반응형 Grid

화면 크기에 따라 그리드 컬럼 수를 조절할 수 있습니다.

```html
<template>
    <vs-grid column-gap="16px" row-gap="16px">
        <vs-steps
            v-model="currentStep"
            :steps="steps"
            :grid="{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }"
        />
        <vs-steps
            v-model="currentStep"
            :steps="steps"
            :grid="{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }"
        />
        <vs-steps
            v-model="currentStep"
            :steps="steps"
            :grid="{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }"
        />
    </vs-grid>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1);
const steps = ['Step 1', 'Step 2', 'Step 3'];
</script>
```

## Props

| Prop          | Type                                                    | Default | Required | Description                                                                          |
| ------------- | ------------------------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------ |
| `colorScheme` | `string`                                                | -       | -        | 스텝의 색상 테마                                                                     |
| `styleSet`    | `string \| VsStepsStyleSet`                             | -       | -        | 커스텀 스타일 설정 객체                                                              |
| `width`       | `string \| number \| Breakpoints`                       | -       | -        | 너비. 단일 값 또는 브레이크포인트 객체                                               |
| `grid`        | `string \| number \| Breakpoints`                       | -       | -        | 12컬럼 그리드 시스템에서 차지할 컬럼 수. 단일 값 또는 브레이크포인트 객체            |
| `height`      | `string`                                                | -       | -        | 높이                                                                                 |
| `gap`         | `string \| number`                                      | `''`    | -        | 스텝 간 간격                                                                         |
| `noLabel`     | `boolean`                                               | `false` | -        | 레이블 숨김                                                                          |
| `disabled`    | `boolean \| ((step: string, index: number) => boolean)` | `false` | -        | 스텝 비활성화 여부. boolean이면 전체 스텝에 적용되고, 함수면 각 스텝마다 조건부 적용 |
| `steps`       | `string[]`                                              | `[]`    | -        | 스텝 레이블 배열                                                                     |
| `vertical`    | `boolean`                                               | `false` | -        | 수직 레이아웃 적용                                                                   |
| `modelValue`  | `number`                                                | `0`     | -        | 현재 선택된 스텝 인덱스 (v-model)                                                    |

## Events

| Event               | Parameters | Description                     |
| ------------------- | ---------- | ------------------------------- |
| `update:modelValue` | `number`   | 선택된 스텝 인덱스 변경 시 발생 |
| `change`            | `number`   | 선택된 스텝 인덱스 변경 시 발생 |

## Types

```typescript
interface VsStepsStyleSet {
    variables?: {
        stepSize?: string;
    };
    step?: CSSProperties;
    activeStep?: CSSProperties;
    label?: CSSProperties;
    activeLabel?: CSSProperties;
    progress?: CSSProperties;
    progressActive?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-steps
        v-model="currentStep"
        :steps="steps"
        :style-set="{
            step: {
                backgroundColor: '#f5f5f5',
                border: '2px solid #ddd',
                borderRadius: '50%',
                width: '2.5rem',
                height: '2.5rem',
            },
            activeStep: {
                backgroundColor: '#4caf50',
                border: '2px solid #4caf50',
            },
            label: {
                color: '#666',
            },
            activeLabel: {
                color: '#000',
                fontWeight: '700',
            },
            progress: {
                backgroundColor: '#e0e0e0',
            },
            progressActive: {
                backgroundColor: '#4caf50',
            },
        }"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentStep = ref(1);
const steps = ['Account', 'Profile', 'Settings', 'Complete'];
</script>
```

## Slots

| Slot    | Props                                                 | Description                    |
| ------- | ----------------------------------------------------- | ------------------------------ |
| `step`  | `{ step, index, isSelected, isPrevious, isDisabled }` | 각 스텝 번호의 커스텀 콘텐츠   |
| `label` | `{ step, index, isSelected, isPrevious, isDisabled }` | 각 스텝 레이블의 커스텀 콘텐츠 |

## 특징

- **수평/수직 레이아웃**: `vertical` prop으로 레이아웃 전환
- **진행 바**: 현재 진행 상황을 시각적으로 표시
- **키보드 네비게이션**: 화살표 키, Home, End 키로 스텝 이동
- **비활성화**: 특정 스텝을 비활성화하여 선택 제한
- **반응형 지원**: `width`와 `grid` prop으로 다양한 화면 크기 대응
- **간격 조절**: `gap` prop으로 스텝 간 간격 커스터마이징
- **레이블 옵션**: `noLabel` prop으로 레이블 표시/숨김 제어
