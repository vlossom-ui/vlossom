> 한국어: [README.ko.md](./README.ko.md)

# VsCheckbox & VsCheckboxSet

Checkbox input components. Provides a single checkbox (`VsCheckbox`) and a checkbox group for selecting multiple options (`VsCheckboxSet`).

**Available Version**: 2.0.0+

---

## VsCheckbox

A single checkbox component.

### Basic Usage

#### Single Checkbox

```html
<template>
    <vs-checkbox v-model="checked" check-label="I agree" />
</template>
```

#### Custom Values

```html
<template>
    <vs-checkbox
        v-model="agreement"
        check-label="Agree"
        true-value="yes"
        false-value="no"
    />
</template>

<script setup>
import { ref } from 'vue';
const agreement = ref('no');
</script>
```

#### Indeterminate State

```html
<template>
    <vs-checkbox indeterminate check-label="Partially selected" />
</template>
```

#### Array Mode

```html
<template>
    <vs-checkbox
        v-model="selectedTags"
        check-label="Tag 1"
        :true-value="'tag1'"
        multiple
    />
    <vs-checkbox
        v-model="selectedTags"
        check-label="Tag 2"
        :true-value="'tag2'"
        multiple
    />
</template>

<script setup>
import { ref } from 'vue';
const selectedTags = ref([]);
</script>
```

#### Before Change Confirmation

```html
<template>
    <vs-checkbox
        v-model="checked"
        check-label="I agree"
        :before-change="confirmBeforeChange"
    />
</template>

<script setup>
import { ref } from 'vue';

const checked = ref(false);

const confirmBeforeChange = async (from, to, optionValue) => {
    // from: value before change, to: value after change, optionValue: trueValue
    return confirm('Are you sure you want to agree?');
};
</script>
```

### Props

| Prop            | Type                           | Default | Required | Description                                                                                         |
| --------------- | ------------------------------ | ------- | -------- | --------------------------------------------------------------------------------------------------- |
| `colorScheme`   | `string`                       | -       | -        | Color scheme for the component                                                                      |
| `styleSet`      | `string \| VsCheckboxStyleSet` | -       | -        | Custom style configuration object                                                                   |
| `checked`       | `boolean`                      | `false` | -        | Initial checked state                                                                               |
| `checkLabel`    | `string`                       | -       | -        | Label displayed next to the checkbox                                                                |
| `indeterminate` | `boolean`                      | `false` | -        | Show indeterminate (partially selected) state                                                       |
| `multiple`      | `boolean`                      | `false` | -        | Enable array mode (v-model operates as an array)                                                    |
| `trueValue`     | `any`                          | `true`  | -        | Value stored in v-model when checked                                                                |
| `falseValue`    | `any`                          | `false` | -        | Value stored in v-model when unchecked                                                              |
| `beforeChange`  | `Function`                     | -       | -        | Async function called before state change (receives from, to, optionValue; cancel if returns false) |

Also supports common Input Props: `id`, `label`, `required`, `disabled`, `readonly`, `messages`, `rules`, etc.

### Types

```typescript
interface VsCheckboxStyleSet {
    variables?: {
        checkboxColor?: string;
        checkboxSize?: string;
    };
    checkbox?: CSSProperties;
    checkboxLabel?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types).

### Slots

| Slot          | Description                            |
| ------------- | -------------------------------------- |
| `default`     | Content displayed in the outer wrapper |
| `label`       | Label area of the input wrapper        |
| `check-label` | Label displayed next to the checkbox   |
| `messages`    | Bottom message area                    |

### Events

| Event               | Parameters              | Description                                  |
| ------------------- | ----------------------- | -------------------------------------------- |
| `update:modelValue` | `any \| any[]`          | Emitted when the v-model value changes       |
| `change`            | `any`                   | Emitted when the checked state changes       |
| `toggle`            | `(boolean, MouseEvent)` | Emitted on toggle (passes post-toggle state) |
| `focus`             | `FocusEvent`            | Emitted when the checkbox receives focus     |
| `blur`              | `FocusEvent`            | Emitted when the checkbox loses focus        |

---

## VsCheckboxSet

A checkbox group component for selecting multiple options.

### Basic Usage

#### Checkbox Group

```html
<template>
    <vs-checkbox-set
        v-model="selectedOptions"
        :options="options"
        option-label="label"
        option-value="value"
    />
</template>

<script setup>
import { ref } from 'vue';
const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
];
const selectedOptions = ref([]);
</script>
```

#### Vertical Layout

```html
<template>
    <vs-checkbox-set v-model="selected" :options="options" vertical />
</template>
```

#### Min/Max Selection Limit

```html
<template>
    <vs-checkbox-set v-model="selected" :options="options" :min="1" :max="3" />
</template>
```

#### Before Change Confirmation

```html
<template>
    <vs-checkbox-set
        v-model="selected"
        :options="options"
        :before-change="confirmBeforeChange"
    />
</template>

<script setup>
import { ref } from 'vue';

const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
];
const selected = ref([]);

const confirmBeforeChange = async (from, to, optionValue) => {
    // from: array before change, to: array after change, optionValue: selected/deselected option value
    return confirm(`Do you want to change the selection?`);
};
</script>
```

### Props

| Prop           | Type               | Default | Required | Description                                                                                         |
| -------------- | ------------------ | ------- | -------- | --------------------------------------------------------------------------------------------------- |
| `options`      | `any[]`            | -       | ✅       | Array of selectable options                                                                         |
| `optionLabel`  | `string`           | -       | -        | Property to use as the label from an option object                                                  |
| `optionValue`  | `string`           | -       | -        | Property to use as the value from an option object                                                  |
| `vertical`     | `boolean`          | `false` | -        | Apply vertical layout                                                                               |
| `min`          | `number \| string` | `0`     | -        | Minimum number of selections                                                                        |
| `max`          | `number \| string` | -       | -        | Maximum number of selections                                                                        |
| `beforeChange` | `Function`         | -       | -        | Async function called before state change (receives from, to, optionValue; cancel if returns false) |

Also supports common Input Props: `id`, `label`, `required`, `disabled`, `readonly`, `messages`, `rules`, etc.

### Types

```typescript
interface VsCheckboxSetStyleSet {
    component?: CSSProperties;
    checkbox?: Omit<VsCheckboxStyleSet, 'wrapper'>;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> - `component` is the style for the checkbox set container.
> - `checkbox` uses [VsCheckboxStyleSet](#types).
> - `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types).

### Slots

| Slot          | Description                                           |
| ------------- | ----------------------------------------------------- |
| `default`     | Content displayed in the outer wrapper                |
| `label`       | Label area of the input wrapper                       |
| `check-label` | Label for each checkbox (scoped slot)                 |
| `messages`    | Bottom message area                                   |

### Events

| Event               | Parameters             | Description                                        |
| ------------------- | ---------------------- | -------------------------------------------------- |
| `update:modelValue` | `any[]`                | Emitted when the v-model value changes             |
| `change`            | `any`                  | Emitted when the checked state changes             |
| `focus`             | `(option, FocusEvent)` | Emitted when a checkbox receives focus             |
| `blur`              | `(option, FocusEvent)` | Emitted when a checkbox loses focus                |

---

## Features

- **Single and group support**: Single checkbox and multiple-selection via checkbox group
- **v-model support**: Two-way data binding
- **Flexible option configuration**: Automatically extracts labels/values from object arrays
- **Selection count limit**: Limit selectable items with `min`/`max` props
- **Vertical/horizontal layout**: Switch between vertical and horizontal layout via the `vertical` prop
- **Indeterminate state**: Represent partial selection with the `indeterminate` prop
- **Customizable**: Fine-tune styles via the `styleSet` prop
