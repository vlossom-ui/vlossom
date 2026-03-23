> 한국어: [README.ko.md](./README.ko.md)

# VsFooter

A component for the footer area of a web application. When used inside `vs-layout`, state is automatically managed through the layout store.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Footer

```html
<template>
    <vs-footer>
        <p>&copy; 2024 My App. All rights reserved.</p>
        <nav>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
        </nav>
    </vs-footer>
</template>
```

### With vs-layout

```html
<template>
    <vs-layout>
        <vs-container>
            <!-- Padding is automatically adjusted when footer is fixed -->
            <main>Main Content</main>
        </vs-container>
        <vs-footer position="fixed" :style-set="{ component: { height: '4rem', backgroundColor: '#1976d2', color: '#ffffff' } }">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <p>&copy; 2024 My App</p>
                <nav>
                    <button>Privacy</button>
                    <button>Terms</button>
                    <button>Contact</button>
                </nav>
            </div>
        </vs-footer>
    </vs-layout>
</template>
```

### Primary Footer

```html
<template>
    <vs-footer primary>
        <p>Emphasized Footer</p>
    </vs-footer>
</template>
```

### Fixed Footer

```html
<template>
    <vs-footer position="fixed" :style-set="{ component: { height: '4rem', zIndex: 1000 } }">
        <div>Always pinned to the bottom</div>
    </vs-footer>
</template>
```

### Custom Tag

```html
<template>
    <vs-footer tag="div">
        <span>Footer rendered as a div tag</span>
    </vs-footer>
</template>
```

## Props

| Prop          | Type                                                          | Default      | Required | Description                                          |
| ------------- | ------------------------------------------------------------- | ------------ | -------- | ---------------------------------------------------- |
| `colorScheme` | `ColorScheme`                                                 | -            | -        | Color scheme for the component                       |
| `styleSet`    | `string \| VsFooterStyleSet`                                  | -            | -        | Custom style configuration object                    |
| `position`    | `'relative' \| 'absolute' \| 'fixed' \| 'sticky' \| 'static'` | `'relative'` | -        | CSS position value                                   |
| `height`      | `string`                                                      | -            | -        | Footer height                                        |
| `primary`     | `boolean`                                                     | `false`      | -        | Apply emphasized primary style                       |
| `tag`         | `string`                                                      | `'footer'`   | -        | HTML tag to render as (default: footer)              |

## Types

```typescript
interface VsFooterStyleSet extends VsBarStyleSet {}
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
| `default` | Content to display inside the footer  |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
