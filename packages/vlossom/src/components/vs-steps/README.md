> 한국어: [README.ko.md](./README.ko.md)

# VsSteps

A step indicator component for multi-step processes. Provides horizontal/vertical layouts and a progress bar so users can easily track their current progress.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Steps

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

### Vertical Steps

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

### Steps Without Labels

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

### Custom Steps

Use slots to customize step numbers and labels. The `isSelected`, `isPrevious`, and `isDisabled` states can be used to build dynamic UIs.

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

### Disabled Steps

#### Disable All Steps (Boolean)

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

#### Conditional Disable (Function)

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

To disable specific indexes:

```typescript
function isStepDisabled(step: string, index: number): boolean {
    return [1, 3].includes(index);
}
```

### Gap Between Steps

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

### Fixed Width/Height

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

### Responsive Width

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

### Grid System

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

### Responsive Grid

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

| Prop          | Type                                                    | Default | Required | Description                                                                              |
| ------------- | ------------------------------------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| `colorScheme` | `string`                                                | -       | -        | Color scheme for the component                                                           |
| `styleSet`    | `string \| VsStepsStyleSet`                             | -       | -        | Custom style configuration object                                                        |
| `width`       | `string \| number \| Breakpoints`                       | -       | -        | Width — single value or breakpoints object                                               |
| `grid`        | `string \| number \| Breakpoints`                       | -       | -        | Number of columns in the 12-column grid — single value or breakpoints object             |
| `height`      | `string`                                                | -       | -        | Height                                                                                   |
| `gap`         | `string \| number`                                      | `''`    | -        | Gap between steps                                                                        |
| `noLabel`     | `boolean`                                               | `false` | -        | Hide step labels                                                                         |
| `disabled`    | `boolean \| ((step: string, index: number) => boolean)` | `false` | -        | Disable steps. `boolean` disables all; a function disables conditionally per step        |
| `steps`       | `string[]`                                              | `[]`    | -        | Array of step labels                                                                     |
| `vertical`    | `boolean`                                               | `false` | -        | Apply vertical layout                                                                    |
| `modelValue`  | `number`                                                | `0`     | -        | Currently selected step index (v-model)                                                  |

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
    activeProgress?: CSSProperties;
}
```

### StyleSet Example

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
            activeProgress: {
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

## Events

| Event               | Parameters | Description                                  |
| ------------------- | ---------- | -------------------------------------------- |
| `update:modelValue` | `number`   | Emitted when the v-model value changes       |
| `change`            | `number`   | Emitted when the selected step index changes |

## Slots

| Slot    | Props                                                 | Description                          |
| ------- | ----------------------------------------------------- | ------------------------------------ |
| `step`  | `{ step, index, isSelected, isPrevious, isDisabled }` | Custom content for each step number  |
| `label` | `{ step, index, isSelected, isPrevious, isDisabled }` | Custom content for each step label   |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
