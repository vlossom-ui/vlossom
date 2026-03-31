> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsAccordion

A collapsible content panel that shows or hides its content through a toggle interaction.

**Available Version**: 2.0.0+

## Feature

- Toggle open/closed state by clicking the title area or pressing Enter/Space
- Supports `v-model` binding to control and observe the open state externally
- Keyboard accessible — fully navigable via Enter and Space keys
- Responsive width control via `width` and `grid` props
- Customizable arrow indicator via CSS variables (`arrowColor`, `arrowSize`, `arrowSpacing`)

## Basic Usage

```html
<template>
    <vs-accordion>
        <template #title>Section Title</template>
        This is the accordion content.
    </vs-accordion>
</template>
```

### With v-model

```html
<template>
    <vs-accordion v-model="isOpen">
        <template #title>Controlled Accordion</template>
        Content is shown when isOpen is true.
    </vs-accordion>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### Primary Style

```html
<template>
    <vs-accordion primary>
        <template #title>Primary Accordion</template>
        Content with primary color scheme on the title bar.
    </vs-accordion>
</template>
```

### Disabled

```html
<template>
    <vs-accordion disabled>
        <template #title>Disabled Accordion</template>
        This accordion cannot be toggled.
    </vs-accordion>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | Color scheme for the component |
| `styleSet` | `string \| VsAccordionStyleSet` | | | Custom style set |
| `width` | `string \| number \| Breakpoints` | | | Width of the component |
| `grid` | `string \| number \| Breakpoints` | | | Grid column span |
| `disabled` | `boolean` | `false` | | Disables toggle interaction |
| `open` | `boolean` | `false` | | Initial open state |
| `primary` | `boolean` | `false` | | Applies primary color scheme |
| `modelValue` | `boolean` | `false` | | v-model binding for open state |

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
> `content` uses `VsExpandableStyleSet`. See the [VsExpandable documentation](../vs-expandable/README.md) for details.

### StyleSet Example

```html
<template>
    <vs-accordion
        :style-set="{
            variables: {
                arrowColor: '#6200ea',
                arrowSize: '0.5rem',
                arrowSpacing: '4%',
                border: '2px solid #6200ea',
            },
            component: { borderRadius: '0.75rem' },
            title: { fontWeight: 'bold', padding: '1rem' },
        }"
    >
        <template #title>Custom Styled Accordion</template>
        Content goes here.
    </vs-accordion>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `boolean` | Emitted when the open state changes |
| `toggle` | `boolean` | Emitted after toggling; payload is the new open state |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Main collapsible content |
| `title` | Content rendered inside the title bar |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `toggle` | — | Toggles the accordion open/closed state |

## Caution

- Using both `open` and `v-model` simultaneously is not recommended. `v-model` takes precedence during reactivity updates.
