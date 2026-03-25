> 한국어: [README.ko.md](./README.ko.md)

# VsAccordion

A collapsible content area component. Click the title to expand or collapse the content. Supports keyboard accessibility and flexible style customization.

**Available Version**: 2.0.0+

## Basic Usage

### Default Accordion

```html
<template>
    <vs-accordion>
        <template #title>
            <h3>Accordion Title</h3>
        </template>
        <p>Accordion content. Click the title to expand or collapse this area.</p>
    </vs-accordion>
</template>
```

### Initially Open

```html
<template>
    <vs-accordion :open="true">
        <template #title>
            <h3>Initially Open Accordion</h3>
        </template>
        <p>This accordion starts in the open state.</p>
    </vs-accordion>
</template>
```

### Using v-model

```html
<template>
    <vs-accordion v-model="isOpen">
        <template #title>
            <h3>Accordion Controlled by v-model</h3>
        </template>
        <p>The open/close state can be controlled externally.</p>
    </vs-accordion>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
</script>
```

### Primary Style

```html
<template>
    <vs-accordion primary>
        <template #title>
            <h3>Primary Style Accordion</h3>
        </template>
        <p>An accordion with an emphasized style.</p>
    </vs-accordion>
</template>
```

### Disabled State

```html
<template>
    <vs-accordion disabled>
        <template #title>
            <h3>Disabled Accordion</h3>
        </template>
        <p>This accordion cannot be clicked.</p>
    </vs-accordion>
</template>
```

## Props

| Prop          | Type                            | Default | Required | Description                          |
| ------------- | ------------------------------- | ------- | -------- | ------------------------------------ |
| `colorScheme` | `ColorScheme`                   | -       | -        | Color scheme for the component       |
| `styleSet`    | `string \| VsAccordionStyleSet` | -       | -        | Custom style configuration object    |
| `disabled`    | `boolean`                       | `false` | -        | Disable the accordion                |
| `open`        | `boolean`                       | `false` | -        | Initial open state                   |
| `primary`     | `boolean`                       | `false` | -        | Apply emphasized primary style       |
| `modelValue`  | `boolean`                       | `false` | -        | v-model binding value                |

## Types

```typescript
interface VsAccordionStyleSet {
    variables?: {
        arrowColor?: string;
        arrowSize?: string;
        arrowSpacing?: string;
        border?: string;
    };
    component?: CSSProperties;
    title?: CSSProperties;
    content?: VsExpandableStyleSet;
}
```

> [!NOTE]
>
> `content` uses [VsExpandableStyleSet](../vs-expandable/README.md#types).

### StyleSet Example

```html
<template>
    <vs-accordion
        :style-set="{
            variables: {
                arrowColor: '#e91e63',
                arrowSize: '12px',
                arrowSpacing: '1.5rem',
                border: '2px solid #333',
            },
            title: {
                backgroundColor: '#f5f5f5',
                padding: '1rem 1.5rem',
            },
        }"
    >
        <template #title>
            <h3>Custom Style Accordion</h3>
        </template>
        <p>An accordion with custom styles applied.</p>
    </vs-accordion>
</template>
```

## Events

| Event               | Payload   | Description                              |
| ------------------- | --------- | ---------------------------------------- |
| `toggle`            | `boolean` | Emitted when the accordion is toggled    |
| `update:modelValue` | `boolean` | Emitted when the v-model value changes   |

## Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `default` | Accordion content (the collapsible area)         |
| `title`   | Accordion title (the clickable trigger area)     |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Keyboard accessibility**: Control the accordion with Enter and Space keys
- **v-model support**: Manage open/close state with two-way data binding
- **Flexible styling**: Customize the title and content areas independently
- **Responsive support**: Adapts to various screen sizes
- **Accessibility**: Designed for screen readers and keyboard users
