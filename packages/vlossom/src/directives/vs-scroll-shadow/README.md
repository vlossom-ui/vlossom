> 한국어: [README.ko.md](./README.ko.md)

# v-scroll-shadow

A directive that displays top/bottom shadows on a scrollable container based on scroll position.

**Available Version**: 2.0.0+

## Basic Usage

```html
<template>
    <div v-scroll-shadow style="overflow: auto; height: 300px">
        <div v-for="item in items" :key="item">{{ item }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { scrollShadow } from 'vlossom';

export default defineComponent({
    directives: {
        scrollShadow,
    },
});
</script>
```

## Conditional Usage

You can dynamically control whether the directive is active using a binding value.

```html
<template>
    <div v-scroll-shadow="isEnabled" style="overflow: auto; height: 300px">
        ...
    </div>
</template>
```

## Binding

| Binding | Type                   | Default     | Description                                                         |
| ------- | ---------------------- | ----------- | ------------------------------------------------------------------- |
| `value` | `boolean \| undefined` | `undefined` | Disabled when `false`; active when `undefined` |

## Notes

The directive must be applied to the **element where scrolling occurs** (`overflow: auto` or `overflow: scroll`).
Applying it to an element that does not scroll will emit a warning.

```html
<!-- ✅ Correct: applied directly to the element with overflow -->
<div v-scroll-shadow style="overflow: auto; height: 300px">
    ...
</div>

<!-- ❌ Incorrect: applied to a wrapper element without scroll -->
<div v-scroll-shadow>
    <div style="overflow: auto; height: 300px">...</div>
</div>
```

## Browser Support

Shadow display uses CSS `@container scroll-state()` queries and works in **Chrome 128+**.
