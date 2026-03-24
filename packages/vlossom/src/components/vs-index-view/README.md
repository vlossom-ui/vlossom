> 한국어: [README.ko.md](./README.ko.md)

# VsIndexView

An index-based view component that renders only the slot content at a specific index. The current index to display can be controlled via v-model, and component state can be preserved using the keep-alive option.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Index View

```html
<template>
    <vs-index-view v-model="currentIndex">
        <div>First content</div>
        <div>Second content</div>
        <div>Third content</div>
    </vs-index-view>
</template>

<script setup>
import { ref } from 'vue';

const currentIndex = ref(0);
</script>
```

### Disable keep-alive

```html
<template>
    <vs-index-view v-model="currentIndex" :keep-alive="false">
        <MyComponent />
        <AnotherComponent />
        <ThirdComponent />
    </vs-index-view>
</template>
```

### Dynamic Content with v-for

```html
<template>
    <vs-index-view v-model="currentIndex">
        <div v-for="item in items" :key="item.id" class="item-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
        </div>
    </vs-index-view>
</template>
```

## Props

| Prop         | Type                              | Default | Required | Description                                              |
| ------------ | --------------------------------- | ------- | -------- | -------------------------------------------------------- |
| `modelValue` | `number`                          | `0`     | -        | Index of the slot content to display (v-model binding)  |
| `keepAlive`  | `boolean`                         | `false` | -        | Whether to use keep-alive for component state preservation |
| `width`      | `string \| number \| Breakpoints` | -       | -        | Responsive width setting                                 |
| `grid`       | `string \| number \| Breakpoints` | -       | -        | Responsive grid column count                             |

## Types

```typescript
interface Breakpoints {
    xs?: string | number; // 0px and above
    sm?: string | number; // 640px and above
    md?: string | number; // 768px and above
    lg?: string | number; // 1024px and above
    xl?: string | number; // 1280px and above
}
```

## Events

| Event               | Payload  | Description                             |
| ------------------- | -------- | --------------------------------------- |
| `update:modelValue` | `number` | Emitted when the v-model value changes  |

## Slots

| Slot      | Description                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| `default` | Contents to display by index. Each child element becomes one index entry.     |

## Methods

| Method        | Parameter | Description                        |
| ------------- | --------- | ---------------------------------- |
| `updateIndex` | `number`  | Change the index and emit an event |
