> 한국어: [README.ko.md](./README.ko.md)

# VsFloating

A floating component that automatically calculates position relative to a target element. Useful for tooltips, dropdowns, popovers, and other overlay UI patterns.

**Available Version**: 2.0.0+

## Basic Usage

### Default Floating

```html
<template>
    <div id="my-button" style="padding: 8px 16px; border: 1px solid #ccc; display: inline-block; cursor: pointer;">
        Hover Me
    </div>
    <vs-floating target="#my-button" v-model="isOpen">
        <div>Floating content</div>
    </vs-floating>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### Various Positions

```html
<template>
    <vs-floating target="#top-button" v-model="open" placement="top">
        <div>Top floating</div>
    </vs-floating>

    <vs-floating target="#right-button" v-model="open" placement="right">
        <div>Right floating</div>
    </vs-floating>

    <vs-floating target="#bottom-button" v-model="open" placement="bottom">
        <div>Bottom floating</div>
    </vs-floating>

    <vs-floating target="#left-button" v-model="open" placement="left">
        <div>Left floating</div>
    </vs-floating>
</template>
```

### Alignment

```html
<template>
    <vs-floating target="#target" v-model="open" placement="top" align="start">start</vs-floating>
    <vs-floating target="#target" v-model="open" placement="top" align="center">center</vs-floating>
    <vs-floating target="#target" v-model="open" placement="top" align="end">end</vs-floating>
</template>
```

### Follow Target Width

```html
<template>
    <div id="follow-button" style="width: 200px;">Follow Width</div>
    <vs-floating target="#follow-button" v-model="open" follow-width>
        <div>Matches the target element's width</div>
    </vs-floating>
</template>
```

### Delay Animation

```html
<template>
    <vs-floating target="#target" v-model="open" :enter-delay="300" :leave-delay="200">
        <div>Delayed floating</div>
    </vs-floating>
</template>
```

### Accessing placement in Slot

```html
<template>
    <vs-floating target="#target" v-model="open">
        <template #default="{ placement }">
            <div>Current placement: {{ placement }}</div>
        </template>
    </vs-floating>
</template>
```

## Props

| Prop          | Type                                                  | Default                  | Required | Description                                      |
| ------------- | ----------------------------------------------------- | ------------------------ | -------- | ------------------------------------------------ |
| `target`      | `string`                                              | -                        | ✅       | CSS selector for the target element              |
| `align`       | `'start' \| 'center' \| 'end'`                        | `'start'`                | -        | Alignment of the floating element                |
| `disabled`    | `boolean`                                             | `false`                  | -        | Disable the floating                             |
| `enterDelay`  | `string \| number`                                    | `0`                      | -        | Show delay in milliseconds                       |
| `followWidth` | `boolean`                                             | `false`                  | -        | Match the target element's width                 |
| `leaveDelay`  | `string \| number`                                    | `0`                      | -        | Hide delay in milliseconds                       |
| `margin`      | `string \| number`                                    | `5`                      | -        | Gap between floating and target element          |
| `modelValue`  | `boolean`                                             | `false`                  | -        | Show/hide state bound via v-model                |
| `noAnimation` | `boolean`                                             | `false`                  | -        | Disable animation                                |
| `overlayId`   | `string`                                              | `'#vs-floating-overlay'` | -        | ID of the overlay container where floating renders |
| `placement`   | `'top' \| 'right' \| 'bottom' \| 'left' \| 'middle'`  | `'bottom'`               | -        | Preferred position                               |

## Types

```typescript
// No StyleSet for this component
```

## Events

| Event               | Payload   | Description                             |
| ------------------- | --------- | --------------------------------------- |
| `update:modelValue` | `boolean` | Emitted when the v-model value changes  |

## Slots

| Slot      | Props                      | Description                                          |
| --------- | -------------------------- | ---------------------------------------------------- |
| `default` | `{ placement: Placement }` | Floating content — provides the computed placement   |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Automatic position calculation**: Automatically calculates the optimal position relative to the target element
- **Flexible positioning**: Supports 5 positions (`top`, `right`, `bottom`, `left`, `middle`) and 3 alignment options (`start`, `center`, `end`)
- **Animation support**: Smooth fade in/out effects (position-specific animations)
- **Delay configuration**: Customizable show/hide delay times
- **Follow width**: Set the floating element to match the target element's width via the `followWidth` prop
