> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsFileDrop

A file input component that supports both drag-and-drop and click-to-browse file selection with validation, multiple file support, and form integration.

**Available Version**: 2.0.0+

## Feature

- Drag-and-drop and click-to-browse file selection
- Multiple file selection support
- Built-in file type (`accept`), count (`min`/`max`) validation
- Displays selected files as removable chips
- Integrates with `VsForm` for form-level validation and state management
- Label, messages, and disabled/readonly states via `VsInputWrapper`

## Basic Usage

```html
<template>
    <vs-file-drop v-model="files" label="Upload Files" />
</template>

<script setup>
import { ref } from 'vue';
const files = ref([]);
</script>
```

### Multiple Files with Accept Filter

```html
<template>
    <vs-file-drop
        v-model="files"
        label="Upload Images"
        multiple
        accept="image/*"
        :max="5"
        placeholder="Drop images here or click to select"
    />
</template>

<script setup>
import { ref } from 'vue';
const files = ref([]);
</script>
```

### With Validation Messages

```html
<template>
    <vs-file-drop
        v-model="files"
        label="Documents"
        required
        :messages="[{ state: 'info', text: 'PDF files only' }]"
        accept=".pdf"
    />
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsFileDropStyleSet` | | | Custom style set for the component |
| `disabled` | `boolean` | `false` | | Disable the file drop area |
| `hidden` | `boolean` | `false` | | Hide the component |
| `id` | `string` | `''` | | HTML id attribute |
| `label` | `string` | `''` | | Label text displayed above the file drop area |
| `noLabel` | `boolean` | `false` | | Hide the label |
| `noMessages` | `boolean` | `false` | | Hide the messages area |
| `required` | `boolean` | `false` | | Mark the field as required |
| `messages` | `Message[]` | `[]` | | State messages to display |
| `name` | `string` | `''` | | HTML name attribute for the input |
| `noDefaultRules` | `boolean` | `false` | | Disable default validation rules |
| `placeholder` | `string` | `''` | | Placeholder text shown in the drop area |
| `readonly` | `boolean` | `false` | | Make the component read-only |
| `rules` | `Rule[]` | `[]` | | Custom validation rules |
| `state` | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'idle'` | | Current validation state |
| `width` | `string \| number \| Breakpoints` | | | Width of the component |
| `grid` | `string \| number \| Breakpoints` | | | Grid column span |
| `accept` | `string` | `''` | | Accepted file types (e.g. `image/*`, `.pdf`) |
| `height` | `string \| number \| Breakpoints` | `'auto'` | | Height of the drop area |
| `noClear` | `boolean` | `false` | | Hide the clear button |
| `multiple` | `boolean` | `false` | | Allow multiple file selection |
| `min` | `number \| string` | `0` | | Minimum number of files required |
| `max` | `number \| string` | `Number.MAX_SAFE_INTEGER` | | Maximum number of files allowed |
| `modelValue` | `File[]` | `[]` | | v-model binding for selected files |

## Types

```typescript
interface VsFileDropStyleSet {
    variables?: {
        dragBackgroundColor?: string;
        iconColor?: string;
    };
    component?: CSSProperties;
    placeholder?: CSSProperties;
    files?: CSSProperties;
    closeButton?: CSSProperties;
    chip?: VsChipStyleSet;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
> `chip` uses [VsChipStyleSet](../vs-chip/README.md) and `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md).

### StyleSet Example

```html
<template>
    <vs-file-drop
        v-model="files"
        label="Upload"
        :style-set="{
            variables: { dragBackgroundColor: '#e8f4fd', iconColor: '#0066cc' },
            component: { borderRadius: '12px' },
            placeholder: { color: '#666' },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `File[]` | Emitted when the selected files change |
| `update:changed` | `File[]` | Emitted when files are changed |
| `update:valid` | `boolean` | Emitted when the validation state changes |
| `change` | `File[]` | Emitted on file selection change |
| `drop` | `File[]` | Emitted when files are dropped |
| `focus` | `FocusEvent` | Emitted when the file drop area gains focus |
| `blur` | `FocusEvent` | Emitted when the file drop area loses focus |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Custom content for the drop area. Receives `{ dragging: boolean }` as slot props |
| `label` | Custom label content |
| `messages` | Custom messages content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `focus` | - | Set focus to the file input |
| `blur` | - | Remove focus from the file input |
| `validate` | - | Trigger validation and return the result |
| `clear` | - | Clear the selected files |
