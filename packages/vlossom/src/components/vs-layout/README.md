> 한국어: [README.ko.md](./README.ko.md)

# VsLayout

A layout component that manages the overall application structure. Dynamically adjusts padding based on each drawer's `responsive` prop to provide a responsive layout.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Layout

```html
<template>
    <vs-layout>
        <vs-header>Header Content</vs-header>
        <vs-container>Main Content</vs-container>
        <vs-drawer>Drawer Content</vs-drawer>
        <vs-footer>Footer Content</vs-footer>
    </vs-layout>
</template>
```

### Responsive Drawer Layout

```html
<template>
    <vs-layout>
        <vs-drawer placement="left" size="250px" open responsive>
            <!-- Left drawer content -->
        </vs-drawer>

        <vs-container>
            <!-- Main content -->
        </vs-container>

        <vs-drawer placement="right" size="300px" open responsive>
            <!-- Right drawer content -->
        </vs-drawer>
    </vs-layout>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |

## Types

```typescript
// No StyleSet for this component
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | Content to place inside the layout      |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Cohesive layout**: Easily compose layouts using `vs-header`, `vs-container`, `vs-drawer`, and `vs-footer` together
- **Layout store**: Provides layout state to child components via `LAYOUT_STORE_KEY` using `provide`
- **Dynamic padding adjustment**: When a drawer's `responsive` prop is enabled, `vs-container` padding automatically adjusts based on open drawers
