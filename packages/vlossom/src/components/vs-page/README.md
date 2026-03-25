> 한국어: [README.ko.md](./README.ko.md)

# VsPage

A page component for composing the main content area of a page. Provides a header area with title and description slots, and offers responsive padding optimized for various screen sizes.

**Available Version**: 2.0.0+

## Basic Usage

### Default Page

```html
<template>
    <vs-page>
        <template #title>
            <h1>Page Title</h1>
        </template>
        <template #description>
            <p>This page uses the Vlossom page component.</p>
        </template>
        <section>
            <p>Page content goes here.</p>
        </section>
    </vs-page>
</template>
```

### StyleSet Example

```html
<template>
    <vs-page
        :style-set="{
            component: {
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                padding: '3rem 4rem',
            },
            title: {
                padding: '0 0 1.5rem 0',
            },
            description: {
                padding: '0 0 2rem 0',
            },
        }"
    >
        <template #title>
            <h1>Custom Style Page</h1>
        </template>
        <template #description>
            <p>A page with customized padding and background color.</p>
        </template>
        <section>
            <p>Page content</p>
        </section>
    </vs-page>
</template>
```

## Props

| Prop       | Type                       | Default | Required | Description                       |
| ---------- | -------------------------- | ------- | -------- | --------------------------------- |
| `styleSet` | `string \| VsPageStyleSet` | -       | -        | Custom style configuration object |

## Types

```typescript
interface VsPageStyleSet {
    component?: CSSProperties;
    title?: CSSProperties;
    description?: CSSProperties;
    content?: CSSProperties;
}
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot          | Description                   |
| ------------- | ----------------------------- |
| `default`     | Main content area of the page |
| `title`       | Page title (optional)         |
| `description` | Page description (optional)   |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Responsive padding**: Uses TailwindCSS Container Query to automatically adjust padding by screen size
    - Default: `2rem 3rem`
    - Below 1024px: `1.8rem 2.5rem`
    - Below 768px: `1.4rem 2rem`
    - Below 640px: `1rem 1.5rem`
- **Structured layout**: Semantic structure with clear separation of title, description, and content
- **Optional slots**: title and description can be used optionally as needed
