> 한국어: [README.ko.md](./README.ko.md)

# VsDrawer

A slide-in panel that can be placed on any side of the screen. Supports responsive behavior that integrates with `vs-layout` when the `responsive` prop is enabled.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Drawer

```html
<template>
    <vs-button @click="isOpen = true">Open Drawer</vs-button>

    <vs-drawer v-model="isOpen">
        <template #header>
            <h3>Drawer Title</h3>
        </template>

        <div>Drawer content goes here.</div>

        <template #footer>
            <vs-button @click="isOpen = false">Close</vs-button>
        </template>
    </vs-drawer>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### Placement Options

```html
<template>
    <vs-drawer v-model="leftOpen" placement="left">Left drawer</vs-drawer>
    <vs-drawer v-model="rightOpen" placement="right">Right drawer</vs-drawer>
    <vs-drawer v-model="topOpen" placement="top">Top drawer</vs-drawer>
    <vs-drawer v-model="bottomOpen" placement="bottom">Bottom drawer</vs-drawer>
</template>
```

### Responsive Mode (with vs-layout)

```html
<template>
    <vs-layout>
        <vs-drawer
            v-model="isOpen"
            placement="left"
            size="250px"
            responsive
        >
            <nav>Navigation items</nav>
        </vs-drawer>
        <vs-container>
            <!-- Main area automatically adjusts padding when drawer is responsive -->
            <main>Main content</main>
        </vs-container>
    </vs-layout>
</template>
```

### Custom Size

```html
<template>
    <vs-drawer v-model="isOpen" size="400px">
        Wide drawer content
    </vs-drawer>
</template>
```

### StyleSet Example

```html
<template>
    <vs-drawer
        v-model="isOpen"
        :style-set="{
            variables: {
                size: '320px',
            },
            component: {
                boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
            },
            header: {
                padding: '1.5rem',
                borderBottom: '1px solid #eee',
            },
            content: {
                padding: '1.5rem',
                backgroundColor: '#fafafa',
            },
            footer: {
                padding: '1rem',
                borderTop: '1px solid #eee',
            },
        }"
    >
        <template #header><h2>Settings</h2></template>
        <p>Settings content</p>
        <template #footer><vs-button @click="isOpen = false">Close</vs-button></template>
    </vs-drawer>
</template>
```

## Props

| Prop          | Type                          | Default   | Required | Description                                                   |
| ------------- | ----------------------------- | --------- | -------- | ------------------------------------------------------------- |
| `modelValue`  | `boolean`                     | `false`   | -        | Show/hide state (v-model)                                     |
| `colorScheme` | `ColorScheme`                 | -         | -        | Color scheme for the component                                |
| `styleSet`    | `string \| VsDrawerStyleSet`  | -         | -        | Custom style configuration object                             |
| `dimClose`    | `boolean`                     | `false`   | -        | Close drawer when dimmed background is clicked                |
| `dimmed`      | `boolean`                     | `true`    | -        | Show dimmed background                                        |
| `escClose`    | `boolean`                     | `false`   | -        | Close drawer when ESC key is pressed                          |
| `focusLock`   | `boolean`                     | `true`    | -        | Lock keyboard focus inside the drawer                         |
| `hideScroll`  | `boolean`                     | `true`    | -        | Hide page scrollbar when drawer is open                       |
| `placement`   | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | - | Side to slide the drawer from                    |
| `responsive`  | `boolean`                     | `false`   | -        | Integrate with vs-layout for responsive layout adjustment     |
| `size`        | `string`                      | -         | -        | Drawer size (width for left/right, height for top/bottom)     |

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
>
> `dimmed` uses [VsDimmedStyleSet](../vs-dimmed/README.md#types).

## Events

| Event               | Payload   | Description                             |
| ------------------- | --------- | --------------------------------------- |
| `update:modelValue` | `boolean` | Emitted when the v-model value changes  |
| `open`              | -         | Emitted when the drawer opens           |
| `close`             | -         | Emitted when the drawer closes          |

## Slots

| Slot      | Description                              |
| --------- | ---------------------------------------- |
| `default` | Main body content of the drawer          |
| `header`  | Fixed header at the top of the drawer    |
| `footer`  | Fixed footer at the bottom of the drawer |

## Methods

| Method        | Parameters | Description              |
| ------------- | ---------- | ------------------------ |
| `openDrawer`  | -          | Open the drawer          |
| `closeDrawer` | -          | Close the drawer         |
