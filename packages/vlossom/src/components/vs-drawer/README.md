> 한국어: [README.ko.md](./README.ko.md)

# VsDrawer

A sidebar drawer component that slides in from the edge of the screen. Can be used for navigation menus, sidebars, filter panels, and more. When used with `vs-layout`, it supports responsive layout integration.

**Available Version**: 2.0.0+

## Basic Usage

### Default Drawer

```html
<template>
    <div>
        <vs-button @click="drawerOpen = true">Open Drawer</vs-button>
        <vs-drawer v-model="drawerOpen">
            <h3>Drawer Content</h3>
            <p>Place your sidebar content here.</p>
        </vs-drawer>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const drawerOpen = ref(false);
</script>
```

### Various Placement Options

```html
<template>
    <div>
        <vs-drawer v-model="leftDrawer" placement="left">
            <h3>Left Drawer</h3>
        </vs-drawer>

        <vs-drawer v-model="rightDrawer" placement="right">
            <h3>Right Drawer</h3>
        </vs-drawer>

        <vs-drawer v-model="topDrawer" placement="top">
            <h3>Top Drawer</h3>
        </vs-drawer>

        <vs-drawer v-model="bottomDrawer" placement="bottom">
            <h3>Bottom Drawer</h3>
        </vs-drawer>
    </div>
</template>
```

### Size Adjustment

```html
<template>
    <div>
        <!-- Predefined sizes (xs, sm, md, lg, xl) -->
        <vs-drawer v-model="smallDrawer" size="sm">Small Drawer</vs-drawer>
        <vs-drawer v-model="mediumDrawer" size="md">Medium Drawer</vs-drawer>
        <vs-drawer v-model="largeDrawer" size="lg">Large Drawer</vs-drawer>

        <!-- Custom size -->
        <vs-drawer v-model="customDrawer" size="350px">Custom Size Drawer</vs-drawer>
        <vs-drawer v-model="percentDrawer" size="30%">Percent Size Drawer</vs-drawer>
    </div>
</template>
```

### Using with vs-layout

When placed inside `vs-layout`, two behaviors happen automatically:

1. **Drawer position correction**: If `vs-header` / `vs-footer` is positioned `absolute` or `fixed`, the drawer automatically adjusts its top/bottom padding or `top` offset to prevent overlap.
2. **vs-container padding adjustment**: When `layout-responsive` is set on the drawer, `vs-container`'s padding in that direction is automatically added when the drawer opens.

```html
<template>
    <vs-layout>
        <vs-header position="absolute" primary>Header</vs-header>

        <!-- layout-responsive: Drawer opens → paddingLeft added to vs-container -->
        <!-- Header absolute → paddingTop auto-applied to vs-container without layout-responsive -->
        <vs-drawer placement="left" layout-responsive size="280px" open>
            <template #header>
                <h2>Navigation</h2>
            </template>

            <nav>
                <a href="#">Home</a>
                ...
            </nav>

            <template #footer>
                <small>© 2024 My App</small>
            </template>
        </vs-drawer>

        <vs-container>
            <main>Main Content</main>
        </vs-container>

        <vs-footer position="absolute" primary>Footer</vs-footer>
    </vs-layout>
</template>
```

### Fixed Position Drawer

```html
<template>
    <vs-drawer v-model="fixedDrawer" fixed>
        <!-- Fixed on screen regardless of page scroll -->
        <h3>Fixed Drawer</h3>
    </vs-drawer>
</template>
```

## Props

| Prop               | Type                                     | Default  | Required | Description                                                                               |
| ------------------ | ---------------------------------------- | -------- | -------- | ----------------------------------------------------------------------------------------- |
| `colorScheme`      | `ColorScheme`                            | -        | -        | Color scheme for the component                                                            |
| `styleSet`         | `string \| VsDrawerStyleSet`             | -        | -        | Custom style configuration object                                                         |
| `callbacks`        | `OverlayCallbacks`                       | -        | -        | Callback functions called when overlay state changes                                      |
| `hideScroll`       | `boolean`                                | `false`  | -        | Whether to hide the scrollbar in the drawer content area while keeping scroll behavior    |
| `dimClose`         | `boolean`                                | `false`  | -        | Whether to close the drawer when the dimmed background is clicked                         |
| `dimmed`           | `boolean`                                | `false`  | -        | Whether to show a dimmed overlay over the background                                      |
| `escClose`         | `boolean`                                | `false`  | -        | Whether to close the drawer when the ESC key is pressed                                   |
| `focusLock`        | `boolean`                                | `false`  | -        | Whether to trap keyboard focus inside the drawer                                          |
| `id`               | `string`                                 | -        | -        | Unique identifier                                                                         |
| `fixed`            | `boolean`                                | `false`  | -        | Whether to use fixed position (`position: fixed`)                                         |
| `layoutResponsive` | `boolean`                                | `false`  | -        | Whether to auto-adjust `vs-container` padding when drawer opens/closes inside `vs-layout` |
| `open`             | `boolean`                                | `false`  | -        | Initial open state (uncontrolled mode)                                                    |
| `placement`        | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | -        | Which side the drawer slides in from                                                      |
| `size`             | `SizeProp`                               | `'sm'`   | -        | Drawer size (`'xs'`\|`'sm'`\|`'md'`\|`'lg'`\|`'xl'` or custom value)                      |
| `modelValue`       | `boolean`                                | `false`  | -        | Value for v-model binding                                                                 |

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

type SizeProp = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;
```

> [!NOTE]
>
> `dimmed` uses [VsDimmedStyleSet](../vs-dimmed/README.md#types).

### StyleSet Example

```html
<template>
    <vs-drawer
        v-model="drawerOpen"
        :style-set="{
            variables: {
                size: '400px',
            },
            content: {
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                borderRadius: '0 16px 16px 0',
                boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
            },
            header: {
                backgroundColor: '#334155',
                borderBottom: '1px solid #475569',
            },
            footer: {
                backgroundColor: '#334155',
                borderTop: '1px solid #475569',
            },
            dimmed: {
                component: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
            },
        }"
    >
        <h3>Custom Style Drawer</h3>
    </vs-drawer>
</template>
```

## Events

| Event               | Payload   | Description                                |
| ------------------- | --------- | ------------------------------------------ |
| `update:modelValue` | `boolean` | Emitted when the v-model value changes     |
| `open`              | -         | Emitted when the drawer opens              |
| `close`             | -         | Emitted when the drawer closes             |
| `click-dimmed`      | -         | Emitted when the dimmed overlay is clicked |

## Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | Main content area of the drawer         |
| `header`  | Header area at the top of the drawer    |
| `footer`  | Footer area at the bottom of the drawer |

## Methods

| Method        | Parameters | Description                        |
| ------------- | ---------- | ---------------------------------- |
| `openDrawer`  | -          | Programmatically opens the drawer  |
| `closeDrawer` | -          | Programmatically closes the drawer |

```html
<template>
    <vs-drawer ref="drawerRef" v-model="drawerOpen">
        <p>Drawer content</p>
    </vs-drawer>
    <vs-button @click="drawerRef.openDrawer()">Open</vs-button>
    <vs-button @click="drawerRef.closeDrawer()">Close</vs-button>
</template>

<script setup>
import { ref } from 'vue';
const drawerRef = ref(null);
const drawerOpen = ref(false);
</script>
```

## Features

- **Multiple placement support**: Slides in from 4 directions: `left`, `right`, `top`, `bottom`
- **Flexible sizing**: Supports predefined sizes (`xs`~`xl`) or custom pixel/percent values
- **Overlay features**: Dimmed background, close on background click, close on ESC key, etc.
- **Accessibility**: Keyboard navigation support via focus trap
- **Animation**: Smooth sliding animation effect
- **v-model support**: State management via two-way data binding
- **vs-layout integration**: Automatically adjusts drawer padding and offset based on header/footer position. With `layout-responsive`, `vs-container` padding also responds to drawer open/close
