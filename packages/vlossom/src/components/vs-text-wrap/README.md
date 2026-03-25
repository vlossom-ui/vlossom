> 한국어: [README.ko.md](./README.ko.md)

# VsTextWrap

A component that wraps text and provides copy and link actions.

**Available Version**: 2.0.0+

## Basic Usage

### Default Text Wrap

```html
<template>
    <vs-text-wrap>Text content</vs-text-wrap>
</template>
```

### With Copy Button

```html
<template>
    <vs-text-wrap copy @copied="handleCopied">
        Copyable text
    </vs-text-wrap>
</template>

<script setup lang="ts">
function handleCopied(text: string) {
    console.log('Copied text:', text);
}
</script>
```

### With Link Button

```html
<template>
    <vs-text-wrap link="https://example.com">
        https://example.com
    </vs-text-wrap>
</template>
```

### Custom Action Buttons

```html
<template>
    <vs-text-wrap copy>
        Text content
        <template #actions>
            <button @click="handleCustomAction">
                <svg><!-- Custom icon --></svg>
            </button>
        </template>
    </vs-text-wrap>
</template>
```

### Accessing Content Text

Access the `contentText` value via ref — useful for tooltips and other UI integration.

```html
<template>
    <vs-tooltip :content="textContent">
        <vs-text-wrap ref="textWrapRef" copy width="200px">
            This is a very long text that will be truncated with ellipsis
        </vs-text-wrap>
    </vs-tooltip>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const textWrapRef = ref();
const textContent = computed(() => textWrapRef.value?.contentText || '');
</script>
```

### StyleSet Example

```html
<template>
    <vs-text-wrap
        copy
        link="https://example.com"
        :style-set="{
            component: {
                width: '300px',
            },
            copyIcon: {
                width: '1.5rem',
                height: '1.5rem',
                color: '#ff5722',
            },
            linkIcon: {
                width: '1.5rem',
                height: '1.5rem',
                color: '#2196f3',
            },
        }"
    >
        Text with custom styles
    </vs-text-wrap>
</template>
```

> **Note**: `width` can also be set via prop, which takes priority over `styleSet`.

## Props

| Prop       | Type                           | Default | Required | Description                                      |
| ---------- | ------------------------------ | ------- | -------- | ------------------------------------------------ |
| `styleSet` | `string \| VsTextWrapStyleSet` | -       | -        | Custom style configuration object                |
| `copy`     | `boolean`                      | `false` | -        | Show copy button                                 |
| `link`     | `string`                       | `''`    | -        | Link URL (shows link button when provided)       |
| `width`    | `string \| number`             | `''`    | -        | Width of the text content area                   |

## Types

```typescript
interface VsTextWrapStyleSet {
    component?: CSSProperties;
    copyIcon?: CSSProperties;
    linkIcon?: CSSProperties;
}
```

## Events

| Event    | Payload        | Description                       |
| -------- | -------------- | --------------------------------- |
| `copied` | `text: string` | Emitted when the copy button is clicked |

## Slots

| Slot      | Props | Description                                     |
| --------- | ----- | ----------------------------------------------- |
| `default` | -     | Text content to display                         |
| `actions` | -     | Slot for adding custom action buttons           |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Copy feature**: Activate the copy button via the `copy` prop. Copies plain text only, stripping HTML tags
- **Link feature**: Activate the link button via the `link` prop. Opens the URL in a new tab on click
- **Icon styling**: Individually customize the color and size of copy/link icons via `copyIcon` and `linkIcon` in `styleSet`
- **Width control**: Set the width of the text area via the `width` prop; long text is displayed with an ellipsis
- **Copy feedback**: Changes to a check icon for 2 seconds after successful copy as visual feedback
