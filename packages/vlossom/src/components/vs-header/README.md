> 한국어: [README.ko.md](./README.ko.md)

# VsHeader

A component for the header area of a web application. When used inside `vs-layout`, state is automatically managed through the layout store.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Header

```html
<template>
    <vs-header>
        <h1>My App</h1>
        <nav>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
        </nav>
    </vs-header>
</template>
```

### With vs-layout

```html
<template>
    <vs-layout>
        <vs-header position="fixed" :style-set="{ component: { height: '4rem', backgroundColor: '#2196f3', color: '#ffffff' } }">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h1>My App</h1>
                <nav>
                    <button>Home</button>
                    <button>About</button>
                    <button>Contact</button>
                </nav>
            </div>
        </vs-header>
        <vs-container>
            <!-- Padding is automatically adjusted when header is fixed -->
            <main>Main Content</main>
        </vs-container>
    </vs-layout>
</template>
```

### Primary Header

```html
<template>
    <vs-header primary>
        <h1>Emphasized Header</h1>
    </vs-header>
</template>
```

### Fixed Header

```html
<template>
    <vs-header position="fixed" :style-set="{ component: { height: '4rem', zIndex: 1000 } }">
        <div>Always pinned to the top</div>
    </vs-header>
</template>
```

### Custom Tag

```html
<template>
    <vs-header tag="div">
        <span>Header rendered as a div tag</span>
    </vs-header>
</template>
```

## Props

| Prop          | Type                                                          | Default      | Required | Description                                          |
| ------------- | ------------------------------------------------------------- | ------------ | -------- | ---------------------------------------------------- |
| `colorScheme` | `ColorScheme`                                                 | -            | -        | Color scheme for the component                       |
| `styleSet`    | `string \| VsHeaderStyleSet`                                  | -            | -        | Custom style configuration object                    |
| `position`    | `'relative' \| 'absolute' \| 'fixed' \| 'sticky' \| 'static'` | `'relative'` | -        | CSS position value                                   |
| `height`      | `string`                                                      | -            | -        | Header height                                        |
| `primary`     | `boolean`                                                     | `false`      | -        | Apply emphasized primary style                       |
| `tag`         | `string`                                                      | `'header'`   | -        | HTML tag to render as (default: header)              |

## Types

```typescript
interface VsHeaderStyleSet extends VsBarStyleSet {}
```

> [!NOTE]
>
> Supports all styling props from VsBar. See [VsBar README](../vs-bar/README.md#types) for details.

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                           |
| --------- | ------------------------------------- |
| `default` | Content to display inside the header  |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Semantic HTML**: Uses `<header>` tag by default for semantic markup (changeable via `tag` prop)
- **Layout integration**: Automatically registers state in the layout store when used as a child of `vs-layout`
- **Auto padding adjustment**: `vs-container` automatically adjusts padding when `position` is `fixed`, `absolute`, or `sticky`
- **Primary style**: Apply an emphasized primary style when needed
