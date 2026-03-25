> 한국어: [README.ko.md](./README.ko.md)

# VsExpandable

A component that provides smooth expand/collapse animation for content. Enhances user experience with fluid transitions, and can be used in accordions, dropdowns, toggle menus, and other UI patterns.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Expandable Content

```html
<template>
    <div>
        <button @click="isOpen = !isOpen">
            {{ isOpen ? 'Collapse' : 'Expand' }}
        </button>
        <vs-expandable :open="isOpen">
            <div>
                <p>Expandable content.</p>
                <p>This content is shown or hidden with animation.</p>
            </div>
        </vs-expandable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### StyleSet Example

```html
<template>
    <div>
        <button @click="isOpen = !isOpen">
            {{ isOpen ? 'Collapse' : 'Expand' }}
        </button>
        <vs-expandable
            :open="isOpen"
            :style-set="{
                component: {
                    backgroundColor: '#f0f0f0',
                    padding: '2rem',
                    borderRadius: '8px',
                },
            }"
        >
            <div>
                <p>Expandable content with custom styles.</p>
            </div>
        </vs-expandable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

## Props

| Prop       | Type                             | Default | Required | Description                       |
| ---------- | -------------------------------- | ------- | -------- | --------------------------------- |
| `open`     | `boolean`                        | `false` | ✓        | Control expand/collapse state     |
| `styleSet` | `string \| VsExpandableStyleSet` | -       | -        | Custom style configuration object |

## Types

```typescript
interface VsExpandableStyleSet {
    component?: CSSProperties;
}
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                         |
| --------- | ----------------------------------- |
| `default` | Content to expand or collapse       |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Smooth animation**: Natural expand/collapse effect using height and opacity
- **Dynamic height calculation**: Automatically calculates height and applies animation based on content size
- **Performance optimization**: Sets `height: auto` after transition completes to guarantee responsive behavior
- **Versatile usage**: Can be used in accordions, dropdowns, toggle menus, and other UI patterns
