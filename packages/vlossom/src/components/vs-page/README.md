> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsPage

A layout component that provides a structured page container with title, description, and content areas.

**Available Version**: 2.0.0+

## Feature

- Provides a structured layout with title, description, and main content slots
- Responsive padding that adjusts automatically based on container width
- Supports direct CSS styling for each section (component, title, description, content)
- Lightweight wrapper with no extra dependencies

## Basic Usage

```html
<template>
    <vs-page>
        <template #title>Page Title</template>
        <template #description>This is a page description.</template>
        <p>Main content goes here.</p>
    </vs-page>
</template>
```

### Without Slots

```html
<template>
    <vs-page>
        <p>Only content, no title or description.</p>
    </vs-page>
</template>
```

## Props

| Prop       | Type                      | Default | Required | Description                      |
| ---------- | ------------------------- | ------- | -------- | -------------------------------- |
| `styleSet` | `string \| VsPageStyleSet` | -       | -        | Custom style set for the component |

## Types

```typescript
interface VsPageStyleSet {
    component?: CSSProperties;
    title?: CSSProperties;
    description?: CSSProperties;
    content?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-page
        :style-set="{
            component: { backgroundColor: '#f9f9f9', padding: '2rem' },
            title: { color: '#333', fontSize: '1.5rem', fontWeight: 'bold' },
            description: { color: '#666', fontSize: '0.9rem' },
            content: { paddingTop: '1rem' },
        }"
    >
        <template #title>Styled Page</template>
        <template #description>With custom styling applied.</template>
        <p>Content area</p>
    </vs-page>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot          | Description                        |
| ------------- | ---------------------------------- |
| `default`     | Main content area                  |
| `title`       | Page title area (optional)         |
| `description` | Page description area (optional)   |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
