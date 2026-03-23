> 한국어: [README.ko.md](./README.ko.md)

# VsContainer

A container component for the main content area. Supports CSS Container Queries. When used inside `vs-layout`, automatically adjusts padding based on header and footer positions to prevent content overlap.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Standalone Container

```html
<template>
    <vs-container>
        <h1>Main Content</h1>
        <p>Content inside the container.</p>
    </vs-container>
</template>
```

### With vs-layout

```html
<template>
    <vs-layout>
        <vs-header height="80px" fixed>Header Content</vs-header>
        <vs-container>
            <!-- Padding is automatically adjusted when header/footer is fixed/absolute/sticky -->
            <main>Main Content</main>
        </vs-container>
        <vs-footer height="40px" absolute>Footer Content</vs-footer>
    </vs-layout>
</template>
```

### Custom Tag

```html
<template>
    <vs-container tag="main">
        <article>Article Content</article>
    </vs-container>
</template>
```

## Props

| Prop  | Type     | Default | Required | Description              |
| ----- | -------- | ------- | -------- | ------------------------ |
| `tag` | `string` | `div`   | -        | HTML tag to render as    |

## Types

```typescript
// No StyleSet for this component
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                            |
| --------- | -------------------------------------- |
| `default` | Content to place inside the container  |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
