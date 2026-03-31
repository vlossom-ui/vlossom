> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# v-scroll-shadow

Automatically adds a scroll shadow indicator to a scrollable element. The shadow visually signals that there is more content to scroll in a given direction.

**Available Version**: 2.0.0+

## Basic Usage

Apply `v-scroll-shadow` to any element that has scrollable overflow:

```html
<template>
    <div v-scroll-shadow style="height: 200px; overflow: auto;">
        <!-- scrollable content -->
    </div>
</template>
```

To conditionally enable or disable the directive, bind a boolean value:

```html
<template>
    <div v-scroll-shadow="isEnabled" style="height: 200px; overflow: auto;">
        <!-- scrollable content -->
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isEnabled = ref(true);
</script>
```

## Binding

| Binding | Type                   | Default     | Description                                                    |
| ------- | ---------------------- | ----------- | -------------------------------------------------------------- |
| `value` | `boolean \| undefined` | `undefined` | When `false`, the directive is deactivated. Otherwise, active. |

## Hooks

| Hook        | Description                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| `mounted`   | Checks if the element is scrollable; activates the scroll shadow if so.                               |
| `updated`   | Re-evaluates the binding value; activates or deactivates the shadow when the bound value changes.     |
| `unmounted` | Cleans up by removing the shadow class and restoring the original `container-type` CSS property.      |

## Caution

- The directive relies on the CSS `scroll-state` container query feature. Make sure the target browsers support this feature.
- The directive only activates if the element is actually scrollable (i.e., its computed `overflow-x` or `overflow-y` allows scrolling and its content overflows). If the element has no overflow, the directive will silently skip activation.
- If the element already has a `container-type` style set, the directive appends `scroll-state` to the existing value rather than replacing it, and restores the original value on unmount.
