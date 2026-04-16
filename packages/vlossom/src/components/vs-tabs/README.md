> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsTabs

A tab navigation component with animated indicator, scroll buttons, and vertical layout support.

**Available Version**: 2.0.0+

## Feature

- Animated active tab indicator that tracks the selected tab
- Automatic or manual scroll buttons for overflow tab lists
- Vertical tab layout support
- Keyboard navigation between tabs
- Dense and primary visual variants
- Responsive width and grid layout support

## Basic Usage

```html
<template>
    <vs-tabs v-model="activeTab" :tabs="tabs" />
</template>

<script setup>
import { ref } from 'vue';
const activeTab = ref(0);
const tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
</script>
```

### Custom Tab Content

```html
<template>
    <vs-tabs v-model="activeTab" :tabs="tabs">
        <template #tab="{ tab, index }">
            <span>{{ index + 1 }}. {{ tab }}</span>
        </template>
    </vs-tabs>
</template>
```

### Vertical Tabs

```html
<template>
    <vs-tabs v-model="activeTab" :tabs="tabs" vertical />
</template>
```

### With Disabled Tabs

```html
<template>
    <vs-tabs v-model="activeTab" :tabs="tabs" :disabled="(tab) => tab === 'Tab 2'" />
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsTabsStyleSet` | | | Custom style set for the component |
| `dense` | `boolean` | `false` | | Reduces tab height |
| `disabled` | `boolean \| (tab: string, index: number) => boolean` | `false` | | Disables all or specific tabs |
| `grid` | `string \| number \| Breakpoints` | | | Grid column span |
| `height` | `string \| number` | `'auto'` | | Height of the tab bar |
| `modelValue` | `number` | `0` | | Index of the active tab, v-model |
| `primary` | `boolean` | `false` | | Applies primary color styling |
| `scrollButtons` | `'hide' \| 'show' \| 'auto'` | `'auto'` | | Controls scroll button visibility |
| `tabs` | `string[]` | `[]` | | Tab labels |
| `vertical` | `boolean` | `false` | | Renders tabs vertically |
| `width` | `string \| number \| Breakpoints` | | | Component width |

## Types

```typescript
interface VsTabsStyleSet {
    variables?: {
        gap?: string;
        divider?: CSSProperties['border'] & {};
    };
    tab?: CSSProperties;
    activeTab?: CSSProperties;
    scrollButton?: Omit<VsButtonStyleSet, 'loading'>;
}
```

> [!NOTE]
> `scrollButton` uses [`VsButtonStyleSet`](../vs-button/README.md) (excluding `loading`).

### StyleSet Example

```html
<template>
    <vs-tabs
        v-model="activeTab"
        :tabs="tabs"
        :style-set="{
            variables: { gap: '0.5rem', divider: '2px solid #e0e0e0' },
            tab: { borderRadius: '0.25rem', padding: '0.5rem 1.25rem' },
            activeTab: { backgroundColor: '#1976d2', color: '#ffffff' },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `number` | Emitted when the active tab index changes |
| `change` | `number` | Emitted when the selected tab changes |

## Slots

| Slot | Description |
| ---- | ----------- |
| `tab` | Custom tab item content. Receives `{ tab: string, index: number }` |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `goPrev` | | Navigates to the previous tab |
| `goNext` | | Navigates to the next tab |
