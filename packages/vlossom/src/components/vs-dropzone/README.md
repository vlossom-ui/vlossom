> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsDropzone

A component that turns the whole wrapped area into a file drop target. It holds no value and only reports the drag state and the dropped files.

**Available Version**: 2.3.0+

## Feature

- Uses the whole area wrapped by the default slot as a drop target
- Shows an overlay over the area only while files are dragged (thick dashed border, corners that follow `radiusRatio`)
- Reacts only to file drags, not to text or link drags
- Keeps the drag state while the pointer moves across child elements
- Only the innermost dropzone reacts when dropzones are nested

## Basic Usage

```html live
<template>
    <vs-dropzone @drop="onDrop">
        <div style="padding: 3rem; text-align: center">Drop files on this area</div>
    </vs-dropzone>
    <p>Dropped files: {{ fileNames }}</p>
</template>

<script setup>
import { ref } from 'vue';
const fileNames = ref('');
function onDrop(files) {
    fileNames.value = files.map((file) => file.name).join(', ');
}
</script>
```

### Custom Overlay

Use the `overlay` slot to set the content shown while dragging.

```html live
<template>
    <vs-dropzone>
        <div style="padding: 3rem">Drop files anywhere on this area</div>

        <template #overlay>
            <strong>Release to upload</strong>
        </template>
    </vs-dropzone>
</template>
```

### Whole Modal as a Drop Target

Wrap a modal form with `VsDropzone` to receive files dropped anywhere on the form.

```html live
<template>
    <vs-button @click="isOpen = true">Open Modal</vs-button>

    <vs-modal v-model="isOpen">
        <vs-dropzone @drop="(files) => (form.attachments = files)">
            <vs-form>
                <vs-input v-model="form.title" label="Title" />
                <vs-file-drop v-model="form.attachments" label="Attachments" multiple />
            </vs-form>

            <template #overlay>
                <strong>Release to attach</strong>
            </template>
        </vs-dropzone>
    </vs-modal>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
const form = ref({ title: '', attachments: [] });
</script>
```

### Using the Drag State

Use the `dragging` value of the default slot to render the drag state yourself. Use `no-overlay` when the default overlay is not needed.

```html live
<template>
    <vs-dropzone no-overlay>
        <template #default="{ dragging }">
            <div :style="{ padding: '3rem', background: dragging ? '#e8f4fd' : 'transparent' }">
                {{ dragging ? 'Release!' : 'Drag files here' }}
            </div>
        </template>
    </vs-dropzone>
</template>
```

## Props

| Prop          | Type                           | Default | Required | Description                                     |
| ------------- | ------------------------------ | ------- | -------- | ----------------------------------------------- |
| `colorScheme` | `string`                       |         |          | Color scheme of the default overlay             |
| `styleSet`    | `string \| VsDropzoneStyleSet` |         |          | Custom style set for the component              |
| `disabled`    | `boolean`                      | `false` |          | Prevent drag state changes and the `drop` event |
| `noOverlay`   | `boolean`                      | `false` |          | Do not show the overlay while dragging          |

## Types

```typescript
interface VsDropzoneStyleSet extends CSSProperties {
    $overlay?: CSSProperties;
}
```

### StyleSet Example

```html live
<template>
    <vs-dropzone
        :style-set="{
            $overlay: {
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                borderColor: '#0066cc',
                borderRadius: '12px',
            },
        }"
    >
        <div style="padding: 3rem">Try dragging a file</div>
    </vs-dropzone>
</template>
```

## Events

| Event             | Payload                             | Description                                           |
| ----------------- | ----------------------------------- | ----------------------------------------------------- |
| `drop`            | `(files: File[], event: DragEvent)` | Emitted when files are dropped on the area            |
| `change-dragging` | `boolean`                           | Emitted when a file drag starts or ends over the area |

## Slots

| Slot      | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| `default` | Content that becomes the drop target. Receives `{ dragging: boolean }` |
| `overlay` | Content of the overlay that covers the area while dragging             |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Caution

- `VsDropzone` does not provide a file dialog, `v-model`, or validation. Use it with [VsFileDrop](../vs-file-drop/README.md) or [VsFileInput](../vs-file-input/README.md) when you need a form input.
- The drop target is as large as the wrapped content. To cover a larger area, size the content or set the size through `styleSet`.
- The overlay covers the root element with `position: absolute`, and the root element has `position: relative`.
- The corners of the default overlay follow the global `radiusRatio` option. Set `$overlay.borderRadius` to match the corners of the wrapped content.
- Files are not filtered by type (as `accept` would). Every dropped file is passed to the `drop` event, so check file types where you receive them.
- Dropping a folder does not expand the files inside it. Use `event.dataTransfer.items` from the `drop` event when you need the folder structure.
- The browser default of opening a dropped file is prevented on the area even while `disabled`.
- Drag and drop is a pointer-only interaction. Provide another way to select files for keyboard users.
