> 한국어: [README.ko.md](./README.ko.md)

# VsSwitch

A toggle switch component for ON/OFF state. Supports `v-model`, keyboard accessibility, and custom labels.

**Available Version**: 2.0.0+

## Basic Usage

### Default Switch

```html
<template>
    <vs-switch v-model="isOn" label="Notifications" />
</template>

<script setup>
import { ref } from 'vue';
const isOn = ref(false);
</script>
```

### Custom Labels

```html
<template>
    <vs-switch
        v-model="status"
        label="Account Status"
        true-label="Active"
        false-label="Inactive"
    />
</template>
```

### Disabled State

```html
<template>
    <vs-switch v-model="isOn" label="Settings" disabled />
</template>
```

### Custom Values & Array Mode

```html
<template>
    <!-- Using string values -->
    <vs-switch
        v-model="userStatus"
        :true-value="'active'"
        :false-value="'inactive'"
    />

    <!-- Array mode for multiple options -->
    <vs-switch
        v-model="selectedOptions"
        :true-value="'notifications'"
        label="Receive Notifications"
        multiple
    />
</template>

<script setup>
import { ref } from 'vue';
const userStatus = ref('inactive');
const selectedOptions = ref([]);
</script>
```

### StyleSet Example

```html
<template>
    <vs-switch
        v-model="value"
        :style-set="{
            variables: {
                handleSize: '1.8rem',
                handleColor: '#fff',
            },
            switchButton: {
                borderRadius: '2rem',
                border: '2px solid #ddd',
            },
            activeSwitchButton: {
                backgroundColor: '#4caf50',
                borderColor: '#4caf50',
            },
        }"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const value = ref(false);
</script>
```

## Props

| Prop             | Type                         | Default | Required | Description                                     |
| ---------------- | ---------------------------- | ------- | -------- | ----------------------------------------------- |
| `modelValue`     | `any`                        | `false` | -        | Switch value bound via v-model                  |
| `colorScheme`    | `ColorScheme`                | -       | -        | Color scheme for the component                  |
| `styleSet`       | `string \| VsSwitchStyleSet` | -       | -        | Custom style configuration object               |
| `label`          | `string`                     | `''`    | -        | Switch label                                    |
| `trueValue`      | `any`                        | `true`  | -        | Value for the ON state                          |
| `falseValue`     | `any`                        | `false` | -        | Value for the OFF state                         |
| `beforeChange`   | `Function`                   | `null`  | -        | Callback function called before value changes   |
| `checked`        | `boolean`                    | `false` | -        | Initial checked state                           |
| `multiple`       | `boolean`                    | `false` | -        | Enable array mode                               |
| `disabled`       | `boolean`                    | `false` | -        | Disable the switch                              |
| `readonly`       | `boolean`                    | `false` | -        | Set to readonly mode                            |
| `required`       | `boolean`                    | `false` | -        | Mark as required                                |
| `hidden`         | `boolean`                    | `false` | -        | Hide the switch                                 |
| `id`             | `string`                     | `''`    | -        | The `id` attribute of the input element         |
| `name`           | `string`                     | `''`    | -        | The `name` attribute of the input element       |
| `messages`       | `Message[]`                  | `[]`    | -        | Validation message array                        |
| `rules`          | `Rule[]`                     | `[]`    | -        | Validation rule array                           |
| `state`          | `UIState`                    | `idle`  | -        | Component state                                 |
| `noMessages`     | `boolean`                    | `false` | -        | Hide the messages area                          |
| `noDefaultRules` | `boolean`                    | `false` | -        | Disable built-in validation rules               |
| `width`          | `string \| number \| Breakpoints` | -  | -        | Component width                                 |
| `grid`           | `string \| number \| Breakpoints` | -  | -        | Grid layout size                                |

## Types

```typescript
interface VsSwitchStyleSet {
    variables?: {
        handleColor?: string;
        handleSize?: string;
    };
    switchButton?: CSSProperties;
    activeSwitchButton?: CSSProperties;
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types).

## Events

| Event               | Payload   | Description                              |
| ------------------- | --------- | ---------------------------------------- |
| `update:modelValue` | `any`     | Emitted when the v-model value changes   |
| `update:changed`    | `boolean` | Emitted when the changed state updates   |
| `update:valid`      | `boolean` | Emitted when the validation result updates |
| `change`            | `any`     | Emitted when the value changes           |
| `focus`             | `Event`   | Emitted when the switch receives focus   |
| `blur`              | `Event`   | Emitted when the switch loses focus      |

## Slots

| Slot       | Description            |
| ---------- | ---------------------- |
| `label`    | Custom label content   |
| `messages` | Custom message content |

## Methods

| Method     | Parameters | Description                          |
| ---------- | ---------- | ------------------------------------ |
| `focus`    | -          | Set focus on the switch              |
| `blur`     | -          | Remove focus from the switch         |
| `validate` | -          | Run validation                       |
| `clear`    | -          | Reset the value                      |

## Features

- **Full accessibility**: Keyboard navigation (Tab, Space, Enter) and screen reader support
- **Native behavior**: Automatically handles click and keyboard input via HTML label structure
- **Multiple value types**: Supports all types including strings and objects, not just booleans
- **Array mode**: Manage multiple switches as a single array via the `multiple` prop
- **Validation system**: Validation and state display via `rules` and `required`
- **Change control**: Implement pre-change confirmation logic via the `beforeChange` callback
- **Responsive layout**: Responsive width and grid based on VsInputWrapper
