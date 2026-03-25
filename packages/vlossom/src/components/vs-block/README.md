> 한국어: [README.ko.md](./README.ko.md)

# VsBlock

A block container component for clearly separating and grouping content. Displays title and body content in distinct areas, with responsive padding via Container Query.

**Available Version**: 2.0.0+

## Basic Usage

### Default Block

```html
<template>
    <vs-block>
        <p>Content inside the block.</p>
    </vs-block>
</template>
```

### Block with Title

```html
<template>
    <vs-block>
        <template #title>
            <h2>Block Title</h2>
        </template>
        <p>Block body content.</p>
        <p>Multiple lines of content can be included.</p>
    </vs-block>
</template>
```

### Used with VsGrid

```html
<template>
    <!-- Each block occupies 1 column in a 3-column grid -->
    <vs-grid grid-size="3" column-gap="16px" row-gap="16px">
        <vs-block grid="1">
            <template #title>Card 1</template>
            <p>First card content</p>
        </vs-block>
        <vs-block grid="1">
            <template #title>Card 2</template>
            <p>Second card content</p>
        </vs-block>
        <vs-block grid="2">
            <template #title>Wide Card</template>
            <p>A wide card spanning 2 columns</p>
        </vs-block>
    </vs-grid>
</template>
```

### Responsive Grid

```html
<template>
    <vs-grid grid-size="12">
        <vs-block :grid="{ xs: 12, sm: 6, md: 4, lg: 3 }">
            <template #title>Responsive Block</template>
            <p>A block that changes size based on screen width.</p>
            <ul>
                <li>Mobile (xs): full width</li>
                <li>Tablet (sm): half width</li>
                <li>Desktop (md): 1/3 width</li>
                <li>Large screen (lg): 1/4 width</li>
            </ul>
        </vs-block>
    </vs-grid>
</template>
```

## Props

| Prop          | Type                              | Default | Required | Description                                  |
| ------------- | --------------------------------- | ------- | -------- | -------------------------------------------- |
| `colorScheme` | `ColorScheme`                     | -       | -        | Color scheme for the component               |
| `styleSet`    | `string \| VsBlockStyleSet`       | -       | -        | Custom style configuration object            |
| `grid`        | `string \| number \| Breakpoints` | -       | -        | Grid column span (supports responsive values) |
| `width`       | `string \| number`                | -       | -        | Block width                                  |
| `height`      | `string \| number`                | -       | -        | Block height                                 |

## Types

```typescript
interface VsBlockStyleSet {
    variables?: {
        border?: string;
    };
    component?: CSSProperties;
    title?: CSSProperties;
    content?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-block :style-set="{
        variables: {
            border: '2px solid #3498db',
        },
        component: {
            backgroundColor: '#ecf0f1',
            borderRadius: '12px',
        },
        title: {
            backgroundColor: '#3498db',
            color: '#ffffff',
            padding: '1rem 1.5rem',
        },
    }">
        <template #title>Custom Block</template>
        Block content
    </vs-block>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                         |
| --------- | ----------------------------------- |
| `title`   | Title displayed at the top of block |
| `default` | Main content of the block body      |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Clear content separation**: Visually separates the title and body to clarify information structure
- **Container Query responsive**: Padding is automatically adjusted based on container size for optimal layout on all screen sizes
- **Responsive grid support**: Use the `grid` prop with `VsGrid` to specify different column counts by screen size for flexible layouts
- **Independent styling**: Customize the title and body areas with different styles
