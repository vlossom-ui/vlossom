> 한국어: [README.ko.md](./README.ko.md)

# VsFileDrop

A file upload component that supports drag-and-drop and click-to-browse. Selected files are displayed as chips with individual removal support.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default File Upload

```html
<template>
    <vs-file-drop v-model="files" placeholder="Drag files here or click to upload" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const files = ref<File[]>([]);
</script>
```

### With Label

```html
<template>
    <vs-file-drop v-model="files" label="Attach Files" placeholder="Select files" />
</template>
```

### Multiple Files

```html
<template>
    <vs-file-drop v-model="files" multiple label="Profile Images" placeholder="Multiple files allowed" />
</template>
```

### Accept Specific File Types

```html
<template>
    <vs-file-drop v-model="images" accept=".png,.jpg,.jpeg,.gif" label="Upload Images" placeholder="Image files only" />
</template>
```

### File Count Limit

```html
<template>
    <vs-file-drop v-model="files" label="Document Upload" placeholder="Max 5 files" :max="5" :min="1" required />
</template>
```

### Custom Content (with dragging state)

```html
<template>
    <vs-file-drop v-model="files">
        <template #default="{ dragging }">
            <div v-if="dragging" style="color: #1e88e5; font-weight: bold">Drop files here! 📁</div>
            <div v-else>Drag or click to upload 📎</div>
        </template>
    </vs-file-drop>
</template>
```

### Custom Style

```html
<template>
    <vs-file-drop
        v-model="files"
        label="Custom Style"
        :style-set="{
            variables: {
                dragBackgroundColor: '#e3f2fd',
                iconColor: '#1e88e5'
            },
            component: {
                border: '2px dashed #1e88e5',
                borderRadius: '16px'
            },
            files: {
                padding: '2rem'
            },
            placeholder: {
                padding: '2rem'
            }
        }"
    />
</template>
```

## Props

| Prop          | Type                              | Default                   | Required | Description                                              |
| ------------- | --------------------------------- | ------------------------- | -------- | -------------------------------------------------------- |
| `modelValue`  | `File[]`                          | `[]`                      | -        | v-model binding value                                    |
| `accept`      | `string`                          | `''`                      | -        | Accepted file types (e.g. `.png,.jpg,.pdf`, `image/*`)  |
| `multiple`    | `boolean`                         | `false`                   | -        | Allow multiple file uploads                              |
| `max`         | `number \| string`                | `Number.MAX_SAFE_INTEGER` | -        | Maximum number of files                                  |
| `min`         | `number \| string`                | `Number.MIN_SAFE_INTEGER` | -        | Minimum number of files required                         |
| `colorScheme` | `ColorScheme`                     | -                         | -        | Color scheme for the component                           |
| `styleSet`    | `string \| VsFileDropStyleSet`    | -                         | -        | Custom style configuration object                        |
| `disabled`    | `boolean`                         | `false`                   | -        | Disable the component                                    |
| `grid`        | `string \| number \| Breakpoints` | -                         | -        | Grid layout size                                         |
| `hidden`      | `boolean`                         | `false`                   | -        | Hide the component                                       |
| `id`          | `string`                          | -                         | -        | The `id` attribute of the input element                  |
| `label`       | `string`                          | -                         | -        | Label text                                               |
| `messages`    | `Message<FileDropValueType>[]`    | `[]`                      | -        | Validation messages to display                           |
| `name`        | `string`                          | -                         | -        | The `name` attribute of the input element                |
| `noLabel`     | `boolean`                         | `false`                   | -        | Hide the label area                                      |
| `noMessages`  | `boolean`                         | `false`                   | -        | Hide the messages area                                   |
| `placeholder` | `string`                          | -                         | -        | Placeholder text                                         |
| `readonly`    | `boolean`                         | `false`                   | -        | Readonly mode (no remove or new file selection)          |
| `required`    | `boolean`                         | `false`                   | -        | Mark as required                                         |
| `rules`       | `Rule<FileDropValueType>[]`       | `[]`                      | -        | Custom validation rules                                  |
| `state`       | `UIState`                         | `'idle'`                  | -        | Input state (idle, success, info, error, warning)        |
| `width`       | `string \| number \| Breakpoints` | -                         | -        | Component width                                          |
| `height`      | `string \| number \| Breakpoints` | -                         | -        | Component height                                         |

## Types

```typescript
export type FileDropValueType = File[];

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
>
> - `chip` uses [VsChipStyleSet](../vs-chip/README.md#types).
> - `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types).

## Events

| Event               | Payload   | Description                                                        |
| ------------------- | --------- | ------------------------------------------------------------------ |
| `update:modelValue` | `File[]`  | Emitted when the v-model value changes                             |
| `update:changed`    | `File[]`  | Emitted when files are selected via the dialog (v-model:changed)   |
| `update:valid`      | `boolean` | Emitted when the validation state updates                          |
| `drop`              | `File[]`  | Emitted when files are drag-and-dropped                            |

## Slots

| Slot       | Props                   | Description                                         |
| ---------- | ----------------------- | --------------------------------------------------- |
| `default`  | `{ dragging: boolean }` | Custom content (dragging state provided as slot prop) |
| `label`    | -                       | Custom label content                                |
| `messages` | -                       | Custom message content                              |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Drag-and-drop support**: Drag files to upload or click to open the file dialog
- **Single/multiple file upload**: Choose single or multiple file upload via the `multiple` prop
- **File type restriction**: Allow only specific file types via the `accept` prop
- **File count limit**: Limit the number of files via `min`/`max` props
- **Individual file removal**: Display selected files as chips with individual removal
- **Validation rules**: Custom validation rules and built-in validation (required, min, max, accept, multiple)
- **Drag state detection**: Provides visual feedback while dragging files
- **File size display**: Shows selected file sizes in a human-readable format
