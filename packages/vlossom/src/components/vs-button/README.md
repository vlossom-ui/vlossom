> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsButton

A versatile button component supporting multiple visual variants and a built-in loading state.

**Available Version**: 2.0.0+

## Feature

- Multiple style variants: `primary`, `outline`, `ghost`, `circle`
- Built-in loading state with an inline `VsLoading` spinner
- Five size options: `xs`, `sm`, `md` (default), `lg`, `xl`
- Responsive mode that stretches the button to fill its container
- Accessible focus management — removes focus automatically when `loading` is activated

## Basic Usage

```html
<template>
    <vs-button @click="handleClick">Click Me</vs-button>
</template>
```

### Primary

```html
<template>
    <vs-button primary>Primary Button</vs-button>
</template>
```

### Loading State

```html
<template>
    <vs-button :loading="isLoading" @click="submit">Submit</vs-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isLoading = ref(false);

async function submit() {
    isLoading.value = true;
    await doSomething();
    isLoading.value = false;
}
</script>
```

### Outline and Ghost

```html
<template>
    <vs-button outline>Outline</vs-button>
    <vs-button ghost>Ghost</vs-button>
</template>
```

### Sizes

```html
<template>
    <vs-button size="xs">XS</vs-button>
    <vs-button size="sm">SM</vs-button>
    <vs-button>MD (default)</vs-button>
    <vs-button size="lg">LG</vs-button>
    <vs-button size="xl">XL</vs-button>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | Color scheme for the component |
| `styleSet` | `string \| VsButtonStyleSet` | | | Custom style set |
| `circle` | `boolean` | `false` | | Renders the button as a circle |
| `disabled` | `boolean` | `false` | | Disables the button |
| `ghost` | `boolean` | `false` | | Applies ghost (transparent background) style |
| `loading` | `boolean` | `false` | | Shows a loading spinner and disables interaction |
| `outline` | `boolean` | `false` | | Applies outlined style |
| `primary` | `boolean` | `false` | | Applies primary color scheme |
| `responsive` | `boolean` | `false` | | Stretches button to fill container width |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | | Button size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | | HTML button type attribute |

## Types

```typescript
interface VsButtonStyleSet {
    variables?: {
        padding?: string;
    };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}
```

> [!NOTE]
> `loading` uses `VsLoadingStyleSet`. See the [VsLoading documentation](../vs-loading/README.md) for details.

### StyleSet Example

```html
<template>
    <vs-button
        :style-set="{
            variables: {
                padding: '0.5rem 2rem',
            },
            component: {
                borderRadius: '2rem',
                fontWeight: 'bold',
            },
            loading: {
                component: { width: '25%', height: '50%' },
            },
        }"
    >
        Custom Button
    </vs-button>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Button label content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
