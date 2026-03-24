> 한국어: [README.ko.md](./README.ko.md)

# VsIndexView

A component that tracks scroll position and activates navigation links accordingly. Useful for long-page layouts that need a sidebar navigation showing which section is currently in view.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Index View

```html
<template>
    <vs-index-view
        v-model="currentIndex"
        :items="sections"
    />
    <div>
        <section id="section-0">Section 1 content</section>
        <section id="section-1">Section 2 content</section>
        <section id="section-2">Section 3 content</section>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const currentIndex = ref(0);
const sections = [
    { label: 'Section 1', target: '#section-0' },
    { label: 'Section 2', target: '#section-1' },
    { label: 'Section 3', target: '#section-2' },
];
</script>
```

### Custom Slot

```html
<template>
    <vs-index-view v-model="currentIndex" :items="sections">
        <template #item="{ item, index, active }">
            <div :class="{ 'font-bold text-blue-500': active }">
                {{ index + 1 }}. {{ item.label }}
            </div>
        </template>
    </vs-index-view>
</template>
```

## Props

| Prop          | Type                            | Default | Required | Description                                    |
| ------------- | ------------------------------- | ------- | -------- | ---------------------------------------------- |
| `modelValue`  | `number`                        | `0`     | -        | Current active index (v-model)                 |
| `colorScheme` | `ColorScheme`                   | -       | -        | Color scheme for the component                 |
| `styleSet`    | `string \| VsIndexViewStyleSet` | -       | -        | Custom style configuration object              |
| `items`       | `IndexItem[]`                   | `[]`    | -        | Array of index items with label and target     |

## Types

```typescript
interface IndexItem {
    label: string;
    target: string; // CSS selector for the target section
}

interface VsIndexViewStyleSet {
    component?: CSSProperties;
    item?: CSSProperties;
    activeItem?: CSSProperties;
}
```

## Events

| Event               | Payload  | Description                             |
| ------------------- | -------- | --------------------------------------- |
| `update:modelValue` | `number` | Emitted when the v-model value changes  |

## Slots

| Slot   | Props                                          | Description                              |
| ------ | ---------------------------------------------- | ---------------------------------------- |
| `item` | `{ item: IndexItem, index: number, active: boolean }` | Custom rendering for each index item |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
