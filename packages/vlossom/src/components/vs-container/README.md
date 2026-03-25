> 한국어: [README.ko.md](./README.ko.md)

# VsContainer

A container component responsible for the content area. Supports CSS Container Query.
When used as a child of `vs-layout`, it automatically adjusts padding based on the positions of the header and footer to prevent content overlap. When a `vs-drawer` inside the same `vs-layout` has `layout-responsive` set, it also responds to that drawer's open/close state.

**Available Version**: 2.0.0+

## Basic Usage

### Standalone container

```html
<template>
    <vs-container>
        <h1>Main Content</h1>
        <p>Content inside the container.</p>
    </vs-container>
</template>
```

### With vs-layout (header / footer auto-padding)

```html
<template>
    <vs-layout>
        <vs-header position="fixed">Header</vs-header>

        <!-- paddingTop / paddingBottom are automatically applied based on header/footer position -->
        <vs-container>
            <main>Main Content</main>
        </vs-container>

        <vs-footer position="absolute">Footer</vs-footer>
    </vs-layout>
</template>
```

### With vs-drawer (layout-responsive)

```html
<template>
    <vs-layout>
        <vs-header position="absolute">Header</vs-header>

        <!--
            layout-responsive on vs-drawer: when this drawer opens, vs-container
            automatically adds padding in the corresponding direction
            (e.g. paddingLeft when left drawer is open).
            Header/footer padding is applied to vs-container regardless.
        -->
        <vs-drawer placement="left" layout-responsive v-model="leftOpen" size="280px" />

        <vs-container>
            <main>Main Content</main>
        </vs-container>

        <vs-footer position="absolute">Footer</vs-footer>
    </vs-layout>
</template>
```

### Custom tag

```html
<template>
    <vs-container tag="main">
        <article>Article Content</article>
    </vs-container>
</template>
```

## Props

| Prop  | Type     | Default | Required | Description        |
| ----- | -------- | ------- | -------- | ------------------ |
| `tag` | `string` | `'div'` | -        | HTML tag to render |

## Types

```typescript
// No StyleSet for this component
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                           |
| --------- | ------------------------------------- |
| `default` | Content to place inside the container |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Auto padding adjustment**: When used as a child of `vs-layout`, automatically adds padding when headers and footers use `absolute`, `fixed`, or `sticky` positioning to prevent content overlap
- **Drawer responsive padding**: When `layout-responsive` is set on a drawer, padding in that direction on `vs-container` is automatically adjusted when that drawer opens. Top/bottom drawers also factor in header/footer heights
- **Container Query**: Supports `container-type: inline-size` for responsive design
- **Flexible tag**: Render as `div`, `main`, `section`, and other HTML tags via the `tag` prop
