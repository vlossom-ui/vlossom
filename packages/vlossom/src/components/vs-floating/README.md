> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsFloating

A positioned floating element that renders in a teleport overlay and automatically positions itself relative to a target element with optional animation.

**Available Version**: 2.0.0+

## Feature

- Automatically positions relative to a CSS selector target element
- Supports four placement directions (`top`, `bottom`, `left`, `right`) and a `middle` mode
- Configurable alignment (`start`, `center`, `end`) and margin offset
- Optional follow-width mode to match the target element's width
- Fade-in/out animations per direction (disableable with `noAnimation`)
- Configurable enter and leave delays

## Basic Usage

```html live
<template>
    <vs-button id="my-anchor" @mouseenter="show = true" @mouseleave="show = false">Hover me</vs-button>
    <vs-floating v-model="show" target="#my-anchor" placement="bottom">
        <div style="padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; background: #fff; color: #1f2937">
            Floating content
        </div>
    </vs-floating>
</template>

<script setup>
import { ref } from 'vue';
const show = ref(false);
</script>
```

### Follow Width with Top Placement

```html live
<template>
    <vs-input id="search-input" @focus="dropdownOpen = true" @blur="dropdownOpen = false" />
    <vs-floating v-model="dropdownOpen" target="#search-input" placement="top" follow-width>
        <div style="padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; background: #fff; color: #1f2937">
            Dropdown items
        </div>
    </vs-floating>
</template>

<script setup>
import { ref } from 'vue';
const dropdownOpen = ref(false);
</script>
```

### With Enter/Leave Delay

```html live
<template>
    <vs-button id="delayed-btn" @mouseenter="visible = true" @mouseleave="visible = false">
        Hover for tooltip
    </vs-button>
    <vs-floating v-model="visible" target="#delayed-btn" placement="top" :enter-delay="300" :leave-delay="200">
        <div style="padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; background: #fff; color: #1f2937">
            Delayed tooltip
        </div>
    </vs-floating>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `target` | `string` | `''` | ✓ | CSS selector for the target element to position against |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | | Alignment along the cross axis |
| `disabled` | `boolean` | `false` | | Prevent the floating element from showing |
| `enterDelay` | `string \| number` | `0` | | Delay in milliseconds before showing |
| `leaveDelay` | `string \| number` | `0` | | Delay in milliseconds before hiding |
| `margin` | `string \| number` | `5` | | Gap in pixels between the target and the floating element |
| `noAnimation` | `boolean` | `false` | | Disable the fade-in/out animation |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'middle'` | `'bottom'` | | Preferred placement of the floating element |
| `followWidth` | `boolean` | `false` | | Match the floating element width to the target element width |
| `overlayId` | `string` | `'#vs-floating-overlay'` | | CSS selector for the teleport container |
| `modelValue` | `boolean` | `false` | | v-model binding to show/hide the floating element |

## Types

VsFloating has no `StyleSet` interface.

### StyleSet Example

VsFloating does not use a `styleSet` prop. Style the content via the default slot.

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `boolean` | Emitted when visibility changes |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | The floating content. Receives `{ placement: string }` as slot props reflecting the computed placement |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
