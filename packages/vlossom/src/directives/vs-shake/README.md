> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# v-shake

Triggers a horizontal shake animation on an element. Intended for validation feedback — shake the input when validation fails.

**Available Version**: 2.0.0+

## Basic Usage

Bind a boolean value that becomes `true` when validation fails:

```html
<template>
    <div v-shake="hasError">
        <input v-model="value" />
    </div>
    <button @click="validate">Submit</button>
</template>

<script setup>
import { ref } from 'vue';

const value = ref('');
const hasError = ref(false);

function validate() {
    hasError.value = !value.value;
}
</script>
```

The shake animation fires each time the bound value transitions to `true`. Setting it back to `false` resets the state without triggering an animation.

## Binding

| Binding | Type                   | Default     | Description                                                                |
| ------- | ---------------------- | ----------- | -------------------------------------------------------------------------- |
| `value` | `boolean \| undefined` | `undefined` | When `true`, triggers the shake animation. When `false`, clears the state. |

## Cautions

- The animation re-triggers every time the value transitions from `false` (or `undefined`) to `true`. If the value remains `true` across updates, no additional animation fires.
- The directive applies the `shake-horizontal` CSS class, which must be present in the loaded stylesheet. Ensure `vlossom/styles` is imported in your project.
