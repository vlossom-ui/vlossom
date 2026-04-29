> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsDrawer

A slide-in panel component that overlays content from any edge of the screen with optional dimmed backdrop and focus trapping.

**Available Version**: 2.0.0+

## Feature

- Supports four placement directions: `left`, `right`, `top`, `bottom`
- Optional dimmed backdrop with click-to-close support
- Focus trapping for accessible keyboard navigation
- Opt-in `VsLayout` integration via the `layout` prop — when set, offsets header/footer heights automatically and registers itself for container padding
- Smooth slide-in/out transition animation
- Controllable via `v-model` or programmatic `openDrawer` / `closeDrawer` methods

## Basic Usage

```html
<template>
    <vs-button @click="open = true">Open Drawer</vs-button>
    <vs-drawer v-model="open" placement="left">
        <template #header>Header</template>
        <p>Drawer content goes here.</p>
        <template #footer>Footer</template>
    </vs-drawer>
</template>

<script setup>
import { ref } from 'vue';
const open = ref(false);
</script>
```

### Right-side Drawer with Dimmed Backdrop

```html
<template>
    <vs-button @click="drawerOpen = true">Open Right Drawer</vs-button>
    <vs-drawer v-model="drawerOpen" placement="right" dimmed dim-close>
        <p>Click the backdrop to close.</p>
    </vs-drawer>
</template>

<script setup>
import { ref } from 'vue';
const drawerOpen = ref(false);
</script>
```

### Fixed Drawer with Custom Size

```html
<template>
    <vs-drawer v-model="open" placement="top" :size="'30%'" fixed>
        <p>Top drawer at 30% height.</p>
    </vs-drawer>
</template>
```

### Inside VsLayout

Set the `layout` prop to register the drawer with the layout store. Combine with `pushContainer` to push the sibling `VsContainer` aside instead of overlaying it. Wrapping the drawer in another component is supported.

```html
<template>
    <vs-layout>
        <vs-drawer v-model="open" layout push-container placement="left" size="240px">
            <p>Sidebar</p>
        </vs-drawer>
        <vs-container layout>
            <p>Content</p>
        </vs-container>
    </vs-layout>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsDrawerStyleSet` | | | Custom style set for the component |
| `callbacks` | `OverlayCallbacks` | `{}` | | Callback functions for overlay events |
| `dimClose` | `boolean` | `false` | | Close the drawer when the dimmed backdrop is clicked |
| `dimmed` | `boolean` | `false` | | Show a dimmed backdrop behind the drawer |
| `escClose` | `boolean` | `false` | | Close the drawer when the Escape key is pressed |
| `focusLock` | `boolean` | `false` | | Trap focus inside the drawer while it is open |
| `hideScroll` | `boolean` | `false` | | Hide the scrollbar inside the drawer |
| `id` | `string` | `''` | | HTML id attribute for the drawer |
| `fixed` | `boolean` | `false` | | Use `position: fixed` instead of `absolute` |
| `open` | `boolean` | `false` | | Open the drawer on mount |
| `layout` | `boolean` | `false` | | Opt in to `VsLayout` integration. Requires a `VsLayout` ancestor; without one this prop has no effect |
| `pushContainer` | `boolean` | `false` | | When used with `layout`, push the sibling `VsContainer` to make room for the drawer instead of overlaying it |
| `placement` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | | Edge from which the drawer slides in |
| `size` | `string \| number` | | | Width (left/right) or height (top/bottom) of the drawer panel. Accepts size tokens (`xs`, `sm`, `md`, `lg`, `xl`) or CSS values |
| `modelValue` | `boolean` | `false` | | v-model binding to control open state |

## Types

```typescript
interface VsDrawerStyleSet {
    variables?: {
        size?: string;
    };
    component?: CSSProperties;
    dimmed?: VsDimmedStyleSet;
    header?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
}
```

> [!NOTE]
> `dimmed` uses [VsDimmedStyleSet](../vs-dimmed/README.md).

### StyleSet Example

```html
<template>
    <vs-drawer
        v-model="open"
        :style-set="{
            variables: { size: '400px' },
            component: { backgroundColor: '#1a1a2e' },
            header: { padding: '1.5rem', borderBottom: '1px solid #eee' },
            content: { padding: '1.5rem' },
            footer: { padding: '1rem', borderTop: '1px solid #eee' },
        }"
    >
        <template #header>My Header</template>
        <p>Content area</p>
        <template #footer>My Footer</template>
    </vs-drawer>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `boolean` | Emitted when the open state changes |
| `open` | - | Emitted when the drawer opens |
| `close` | - | Emitted when the drawer closes |
| `click-dimmed` | - | Emitted when the dimmed backdrop is clicked |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Main content of the drawer |
| `header` | Header area of the drawer |
| `footer` | Footer area of the drawer |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `openDrawer` | - | Programmatically opens the drawer |
| `closeDrawer` | - | Programmatically closes the drawer |
