> 한국어: [README.ko.md](./README.ko.md)

# VsDivider

A divider component that visually separates content areas. Supports horizontal and vertical orientations with responsive behavior via Container Query.

**Available Version**: 2.0.0+

## Basic Usage

### Horizontal Divider (Default)

```html
<template>
    <div>
        <p>First content</p>
        <vs-divider />
        <p>Second content</p>
    </div>
</template>
```

### Vertical Divider

```html
<template>
    <div class="flex items-center h-20">
        <span>Menu 1</span>
        <vs-divider vertical />
        <span>Menu 2</span>
        <vs-divider vertical />
        <span>Menu 3</span>
    </div>
</template>
```

### Responsive Divider

Automatically switches from vertical (desktop) to horizontal (mobile). The parent element must include `container-type` style (e.g., vs-container).

```html
<template>
    <div class="navigation">
        <span>Home</span>
        <vs-divider vertical responsive />
        <span>About</span>
        <vs-divider vertical responsive />
        <span>Contact</span>
    </div>
</template>
<style>
.navigation {
    ...;
    container-type: inline-size;
}
</style>
```

## Props

| Prop          | Type                          | Default | Required | Description                                          |
| ------------- | ----------------------------- | ------- | -------- | ---------------------------------------------------- |
| `colorScheme` | `ColorScheme`                 | -       | -        | Color scheme for the component                       |
| `styleSet`    | `string \| VsDividerStyleSet` | -       | -        | Custom style configuration object                    |
| `vertical`    | `boolean`                     | `false` | -        | Vertical divider (false: horizontal, true: vertical) |
| `responsive`  | `boolean`                     | `false` | -        | Responsive mode — switches orientation at 768px      |

## Types

```typescript
interface VsDividerStyleSet {
    variables?: {
        border?: string;
        horizontal?: {
            width?: string;
            margin?: string;
        };
        vertical?: {
            height?: string;
            margin?: string;
        };
    };
    component?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <!-- CSS variable styling using variables -->
    <vs-divider
        :style-set="{
            variables: {
                border: '2px solid #333',
                horizontal: {
                    width: '80%',
                    margin: '1rem 0',
                },
            },
        }"
    />

    <!-- Direct styling using component -->
    <vs-divider
        :style-set="{
            component: {
                opacity: 0.8,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            },
        }"
    />

    <!-- Using variables and component together -->
    <vs-divider
        vertical
        :style-set="{
            variables: {
                border: '1px dashed #e91e63',
                vertical: {
                    height: '4rem',
                    margin: '0 1rem',
                },
            },
            component: {
                opacity: 0.6,
            },
        }"
    />
</template>
```

## Features

- **Multiple orientations**: Supports both horizontal and vertical dividers
- **Container Query responsive**: Automatically switches orientation based on container size
- **Accessibility**: Serves a semantic role for visual separation
- **Customizable**: Flexible style changes via CSS variables and styleSet

## Container Query Behavior

When the `responsive` prop is `true`, the component behaves as follows:

- **Above 768px**: Maintains vertical divider
- **768px or below**: Automatically switches to horizontal divider

```css
/* Responsive behavior CSS */
@container (max-width: 768px) {
    .vs-divider.vs-vertical.vs-divider-responsive {
        /* vertical → horizontal divider conversion */
    }
}
```
