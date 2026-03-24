> 한국어: [README.ko.md](./README.ko.md)

# VsTabs

A tab navigation component for organizing content into multiple panels. Supports horizontal and vertical layouts, scroll buttons for overflow, and keyboard navigation.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Tabs

```html
<template>
    <vs-tabs v-model="selectedTab" :tabs="['Tab 1', 'Tab 2', 'Tab 3']">
        <template #tab-content-0>
            <p>Content of Tab 1</p>
        </template>
        <template #tab-content-1>
            <p>Content of Tab 2</p>
        </template>
        <template #tab-content-2>
            <p>Content of Tab 3</p>
        </template>
    </vs-tabs>
</template>

<script setup>
import { ref } from 'vue';
const selectedTab = ref(0);
</script>
```

### Object Tabs

```html
<template>
    <vs-tabs
        v-model="selectedTab"
        :tabs="[
            { label: 'Profile', value: 'profile' },
            { label: 'Settings', value: 'settings' },
            { label: 'Activity', value: 'activity' },
        ]"
        tab-label="label"
        tab-value="value"
    >
        <template #tab-content-profile>
            <p>Profile content</p>
        </template>
        <template #tab-content-settings>
            <p>Settings content</p>
        </template>
        <template #tab-content-activity>
            <p>Activity content</p>
        </template>
    </vs-tabs>
</template>
```

### Vertical Tabs

```html
<template>
    <vs-tabs v-model="tab" :tabs="['A', 'B', 'C']" vertical>
        <template #tab-content-0>Vertical Tab 1</template>
    </vs-tabs>
</template>
```

### Disabled Tabs

```html
<template>
    <vs-tabs
        v-model="tab"
        :tabs="tabs"
        :tabs-disabled="(tab) => tab === 'Disabled'"
    />
</template>
```

## Props

| Prop           | Type                                              | Default | Required | Description                                          |
| -------------- | ------------------------------------------------- | ------- | -------- | ---------------------------------------------------- |
| `modelValue`   | `any`                                             | -       | -        | v-model binding (selected tab value or index)        |
| `colorScheme`  | `ColorScheme`                                     | -       | -        | Color scheme for the component                       |
| `styleSet`     | `string \| VsTabsStyleSet`                        | -       | -        | Custom style configuration object                    |
| `tabs`         | `any[]`                                           | `[]`    | -        | Array of tab definitions (string or object)          |
| `tabLabel`     | `string`                                          | `''`    | -        | Property to use as label from a tab object           |
| `tabValue`     | `string`                                          | `''`    | -        | Property to use as value from a tab object           |
| `tabsDisabled` | `boolean \| (tab, index) => boolean`              | `false` | -        | Disable all tabs or conditionally disable per tab    |
| `vertical`     | `boolean`                                         | `false` | -        | Apply vertical layout                                |

## Types

```typescript
interface VsTabsStyleSet {
    component?: CSSProperties;
    tab?: CSSProperties;
    activeTab?: CSSProperties;
    scrollButton?: Omit<VsButtonStyleSet, 'loading'>;
}
```

> [!NOTE]
>
> `scrollButton` uses [VsButtonStyleSet](../vs-button/README.md#types) (excluding `loading`).

## Events

| Event               | Payload | Description                             |
| ------------------- | ------- | --------------------------------------- |
| `update:modelValue` | `any`   | Emitted when the v-model value changes  |
| `change`            | `any`   | Emitted when the selected tab changes   |

## Slots

| Slot                    | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `tab-content-${value}`  | Content for the tab matching the given value/index |

## Methods

| Method   | Parameters | Description            |
| -------- | ---------- | ---------------------- |
| `goPrev` | -          | Navigate to previous tab |
| `goNext` | -          | Navigate to next tab   |
