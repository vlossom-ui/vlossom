> 한국어: [README.ko.md](./README.ko.md)

# VsResponsive

A utility component for responsive design. Uses CSS Container Queries to automatically adjust width and grid layout based on container size.

**Available Version**: 2.0.0+

## Basic Usage

### Responsive Width

```html
<template>
    <vs-grid>
        <vs-responsive
            :width="{ sm: '50%', md: '33.33%', lg: '25%' }"
        >
            <div>contents</div>
        </vs-responsive>
    </vs-grid>
</template>
```

### Responsive Grid

```html
<template>
    <vs-grid>
        <vs-responsive :grid="{ sm: 12, md: 6, lg: 4, xl: 3 }">
            <div>grid contents</div>
        </vs-responsive>
    </vs-grid>
</template>
```

### Custom Tag

```html
<template>
    <vs-grid>
        <vs-responsive
            tag="article"
            :grid="{ sm: 12, md: 6 }"
        >
            <h2>My Article</h2>
            <p>Layout adjusts automatically based on screen size.</p>
        </vs-responsive>
    </vs-grid>
</template>
```

## Props

| Prop    | Type                              | Default | Required | Description                                        |
| ------- | --------------------------------- | ------- | -------- | -------------------------------------------------- |
| `width` | `string \| number \| Breakpoints` | -       | -        | Component width — single value or responsive object |
| `grid`  | `string \| number \| Breakpoints` | -       | -        | Grid column span — single value or responsive object |
| `tag`   | `string`                          | `div`   | -        | HTML tag to render as                              |

## Types

```typescript
interface Breakpoints {
    xs?: string | number; // 0px and above
    sm?: string | number; // 640px and above
    md?: string | number; // 768px and above
    lg?: string | number; // 1024px and above
    xl?: string | number; // 1280px and above
}
```

### Breakpoints Reference

| Breakpoint | Min Width | Description          |
| ---------- | --------- | -------------------- |
| `xs`       | 0px       | Default (mobile)     |
| `sm`       | 640px     | Small (tablet)       |
| `md`       | 768px     | Medium (tablet)      |
| `lg`       | 1024px    | Large (desktop)      |
| `xl`       | 1280px    | Extra large (desktop)|

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                    |
| --------- | ------------------------------ |
| `default` | Content of the responsive area |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **CSS Container Queries**: Responsive design using CSS Container Queries
- **Automatic class generation**: Automatically generates CSS classes based on breakpoints
- **CSS variable support**: Dynamically generates CSS variables for styling flexibility
- **Grid system integration**: Compose responsive grid layouts in conjunction with VsGrid
