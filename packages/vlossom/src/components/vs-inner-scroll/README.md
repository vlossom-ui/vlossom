> 한국어: [README.ko.md](./README.ko.md)

# VsInnerScroll

A container component with internal scrolling. Keeps header and footer areas fixed while only the body area scrolls.

**Available Version**: 2.0.0+

## Basic Usage

### Default Scroll Container

```html
<template>
    <vs-inner-scroll>
        <div>Scrollable content</div>
        <div>More content...</div>
    </vs-inner-scroll>
</template>
```

### With Fixed Header and Footer

```html
<template>
    <vs-inner-scroll>
        <template #header>
            <div>Fixed Header</div>
        </template>

        <div>Scrollable body content</div>
        <div>More content...</div>

        <template #footer>
            <div>Fixed Footer</div>
        </template>
    </vs-inner-scroll>
</template>
```

### Hide Scrollbar

```html
<template>
    <vs-inner-scroll hide-scroll>
        <div>Scrollable content with hidden scrollbar</div>
    </vs-inner-scroll>
</template>
```

### Using hasScroll Method

```html
<template>
    <vs-inner-scroll ref="innerScrollRef">
        <div>Scrollable content</div>
    </vs-inner-scroll>
    <button @click="checkScroll">Check if scrollable</button>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { VsInnerScrollRef } from '@/components/vs-inner-scroll/types';

const innerScrollRef = useTemplateRef<VsInnerScrollRef>('innerScrollRef');

function checkScroll() {
    const canScroll = innerScrollRef.value?.hasScroll();
    console.log('Scrollable:', canScroll);
}
</script>
```

### StyleSet Example

```html
<template>
    <vs-inner-scroll
        :style-set="{
            header: {
                padding: '24px',
            },
            content: {
                padding: '24px',
            },
            footer: {
                padding: '16px',
            },
        }"
    >
        <template #header>
            <div>Header Content</div>
        </template>
        <div>Scrollable Content</div>
        <template #footer>
            <div>Footer Content</div>
        </template>
    </vs-inner-scroll>
</template>
```

## Props

| Prop         | Type                              | Default | Required | Description                       |
| ------------ | --------------------------------- | ------- | -------- | --------------------------------- |
| `hideScroll` | `boolean`                         | `false` | -        | Hide or show the scrollbar        |
| `styleSet`   | `string \| VsInnerScrollStyleSet` | -       | -        | Custom style configuration object |

## Types

```typescript
interface VsInnerScrollStyleSet {
    header?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
}
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                        |
| --------- | ---------------------------------- |
| `default` | Scrollable body content            |
| `header`  | Fixed header content at the top    |
| `footer`  | Fixed footer content at the bottom |

## Methods

| Method      | Parameters | Return    | Description                                 |
| ----------- | ---------- | --------- | ------------------------------------------- |
| `hasScroll` | -          | `boolean` | Returns whether the container is scrollable |

## Features

- **Fixed header/footer**: Header and footer areas remain fixed without scrolling
- **Content scroll**: Only the body scrolls when content exceeds the container height
- **Container Query**: Supports `container-type: inline-size` for container-based styling
- **Scrollbar control**: Control scrollbar visibility via the `hideScroll` prop
