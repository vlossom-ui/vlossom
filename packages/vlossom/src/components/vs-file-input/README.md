> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsFileInput

An input-style file selector component that opens a file dialog on click or keyboard (Enter/Space) and displays selected files as chips.

**Available Version**: 2.1.0+

## Feature

- Single and multiple file selection modes
- Folder selection mode (`webkitdirectory`)
- Displays selected files as chips with a close button
- `collapseChips` to collapse chips when many files are selected
- File dialog triggered by click or keyboard (Enter/Space)
- Built-in validation support (required, file type)
- Customizable prepend icon via `prepend` slot

## Basic Usage

```html
<template>
    <vs-file-input v-model="files" label="Attachment" placeholder="Select a file" />
</template>

<script setup>
import { ref } from 'vue';
const files = ref([]);
</script>
```

### Multiple File Selection

```html
<template>
    <vs-file-input v-model="files" multiple label="Attachments" placeholder="Select files" />
</template>
```

### File Type Restriction

```html
<template>
    <!-- Images only -->
    <vs-file-input v-model="files" accept="image/*" label="Image" />

    <!-- PDF only -->
    <vs-file-input v-model="files" accept=".pdf" label="PDF" />
</template>
```

### Collapse Chips

```html
<template>
    <vs-file-input v-model="files" multiple collapse-chips label="Attachments" />
</template>
```

### Form Integration

```html
<template>
    <vs-form ref="formRef">
        <vs-file-input v-model="files" label="Required File" required />
        <vs-button @click="formRef.validate()">Submit</vs-button>
    </vs-form>
</template>
```

## Props

| Prop             | Type                                                    | Default  | Required | Description                                            |
| ---------------- | ------------------------------------------------------- | -------- | -------- | ------------------------------------------------------ |
| `colorScheme`    | `string`                                                | -        | -        | Color scheme for the component                         |
| `styleSet`       | `string \| VsFileInputStyleSet`                         | -        | -        | Custom style set for the component                     |
| `disabled`       | `boolean`                                               | `false`  | -        | Disables the component                                 |
| `hidden`         | `boolean`                                               | `false`  | -        | Hides the component                                    |
| `id`             | `string`                                                | `''`     | -        | HTML id attribute                                      |
| `label`          | `string`                                                | `''`     | -        | Label text                                             |
| `noLabel`        | `boolean`                                               | `false`  | -        | Hides the label                                        |
| `noMessages`     | `boolean`                                               | `false`  | -        | Hides validation messages                              |
| `required`       | `boolean`                                               | `false`  | -        | Marks the field as required                            |
| `messages`       | `Message[]`                                             | `[]`     | -        | Validation messages                                    |
| `name`           | `string`                                                | `''`     | -        | HTML name attribute                                    |
| `noDefaultRules` | `boolean`                                               | `false`  | -        | Disables built-in validation rules                     |
| `placeholder`    | `string`                                                | `''`     | -        | Placeholder shown when no file is selected             |
| `readonly`       | `boolean`                                               | `false`  | -        | Makes the component read-only                          |
| `rules`          | `Rule[]`                                                | `[]`     | -        | Custom validation rules                                |
| `state`          | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'idle'` | -        | Validation state                                       |
| `width`          | `string \| number \| Breakpoints`                       | -        | -        | Responsive width                                       |
| `grid`           | `string \| number \| Breakpoints`                       | -        | -        | Grid column span                                       |
| `accept`         | `string`                                                | `''`     | -        | Accepted file types (native accept attribute)          |
| `collapseChips`  | `boolean`                                               | `false`  | -        | Show only the first chip and abbreviate the rest as +N |
| `directory`      | `boolean`                                               | `false`  | -        | Enables folder selection mode (webkitdirectory)        |
| `multiple`       | `boolean`                                               | `false`  | -        | Allows multiple file selection                         |
| `noClear`        | `boolean`                                               | `false`  | -        | Hides the clear-all button                             |
| `size`           | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                  | `'md'`   | -        | Component size                                         |
| `modelValue`     | `File[]`                                                | `[]`     | -        | Selected files (v-model)                               |

## Types

```typescript
interface VsFileInputStyleSet extends CSSProperties {
    $prepend?: CSSProperties;
    $append?: CSSProperties;
    $chip?: VsChipStyleSet;
    $wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
> `$wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types) and `$chip` uses [VsChipStyleSet](../vs-chip/README.md#types).

### StyleSet Example

```html
<template>
    <vs-file-input
        v-model="files"
        label="Attachment"
        :style-set="{ $chip: { backgroundColor: '#e0f2fe' } }"
    />
</template>
```

## Events

| Event               | Payload      | Description                                                |
| ------------------- | ------------ | ---------------------------------------------------------- |
| `update:modelValue` | `File[]`     | Emitted when the selected files change                     |
| `update:changed`    | `boolean`    | Emitted when the changed state updates                     |
| `update:valid`      | `boolean`    | Emitted when the validation state updates                  |
| `change`            | `File[]`     | Emitted when files change via user interaction             |
| `focus`             | `FocusEvent` | Emitted when the component receives focus                  |
| `blur`              | `FocusEvent` | Emitted when the component loses focus                     |
| `clear`             | `File[]`     | Emitted with the previous files when all files are cleared |

## Slots

| Slot       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `label`    | Custom label content                                    |
| `prepend`  | Custom prepend content (replaces the default clip icon) |
| `append`   | Custom append content                                   |
| `messages` | Custom validation messages                              |

## Methods

| Method     | Parameters | Description                                |
| ---------- | ---------- | ------------------------------------------ |
| `focus`    | -          | Focuses the component                      |
| `blur`     | -          | Blurs the component                        |
| `validate` | -          | Triggers validation                        |
| `clear`    | -          | Clears all selected files                  |
| `reset`    | -          | Resets selected files to the initial value |
