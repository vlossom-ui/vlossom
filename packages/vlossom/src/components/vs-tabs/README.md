> 한국어: [README.ko.md](./README.ko.md)

# VsTabs

A tab navigation component. Supports horizontal/vertical layouts and scroll buttons for building various tab interfaces.

**Available Version**: 2.0.0+

## Basic Usage

### Default Tabs

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

### Vertical Tabs

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

### Custom Tab Content

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

### Disabled Tabs

#### Disable All Tabs (Boolean)

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

#### Conditional Disable (Function)

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="tabs" :disabled="isTabDisabled" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedTab = ref(1);
const tabs = ['Tab 0', 'Tab 1', 'Tab 2', 'Tab 3'];

function isTabDisabled(tab: string, index: number): boolean {
    return index % 2 === 0; // disable even-indexed tabs
}
</script>
```

To disable specific indexes:

```typescript
function isTabDisabled(tab: string, index: number): boolean {
    return [1, 3].includes(index);
}
```

### Primary Color Theme

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

### Show Scroll Buttons

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

### Fixed Width

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

### Responsive Width

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

### Fixed Height

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

### Grid System

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

### Responsive Grid

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

| Prop            | Type                                                   | Default  | Required | Description                                                                     |
| --------------- | ------------------------------------------------------ | -------- | -------- | ------------------------------------------------------------------------------- |
| `colorScheme`   | `string`                                               | -        | -        | Color scheme for the component                                                  |
| `styleSet`      | `string \| VsTabsStyleSet`                             | -        | -        | Custom style configuration object                                               |
| `width`         | `string \| number \| Breakpoints`                      | -        | -        | Tab width — single value or breakpoints object                                  |
| `grid`          | `string \| number \| Breakpoints`                      | -        | -        | Number of columns in the 12-column grid — single value or breakpoints object    |
| `height`        | `string \| number`                                     | `'auto'` | -        | Tab height                                                                      |
| `dense`         | `boolean`                                              | `false`  | -        | Apply compact style                                                             |
| `disabled`      | `boolean \| ((tab: string, index: number) => boolean)` | `false`  | -        | Disable tabs. `boolean` disables all; a function disables conditionally per tab |
| `primary`       | `boolean`                                              | `false`  | -        | Apply primary color theme                                                       |
| `scrollButtons` | `'hide' \| 'show' \| 'auto'`                           | `'auto'` | -        | Scroll button visibility mode                                                   |
| `tabs`          | `string[]`                                             | `[]`     | -        | Array of tab labels                                                             |
| `vertical`      | `boolean`                                              | `false`  | -        | Apply vertical layout                                                           |
| `modelValue`    | `number`                                               | `0`      | -        | Selected tab index (v-model)                                                    |

## Events

| Event               | Parameters | Description                                 |
| ------------------- | ---------- | ------------------------------------------- |
| `update:modelValue` | `number`   | Emitted when the v-model value changes      |
| `change`            | `number`   | Emitted when the selected tab index changes |

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
> `scrollButton` uses [VsButtonStyleSet](../vs-button/README.md#types).

### StyleSet Example

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

| Slot  | Props            | Description                 |
| ----- | ---------------- | --------------------------- |
| `tab` | `{ tab, index }` | Custom content for each tab |

## Features

- **Horizontal/vertical layout**: Switch layout via the `vertical` prop
- **Keyboard navigation**: Navigate tabs with arrow keys, Home, and End keys
- **Scroll support**: Scrolling and scroll buttons for long tab lists
- **Disable tabs**: Restrict selection by disabling specific tabs
- **Responsive support**: Adapt to various screen sizes via `width` and `grid` props
- **Accessibility**: Screen reader support via ARIA attributes
