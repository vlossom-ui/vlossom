> 한국어: [README.ko.md](./README.ko.md)

# VsDivider

A divider component that visually separates content areas. Supports horizontal and vertical orientations with responsive behavior via Container Query.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

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
    container-type: inline-size;
}
</style>
```

### StyleSet Example

```html
<template>
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

## Props

| Prop          | Type                          | Default | Required | Description                                              |
| ------------- | ----------------------------- | ------- | -------- | -------------------------------------------------------- |
| `colorScheme` | `ColorScheme`                 | -       | -        | Color scheme for the component                           |
| `styleSet`    | `string \| VsDividerStyleSet` | -       | -        | Custom style configuration object                        |
| `vertical`    | `boolean`                     | `false` | -        | Vertical divider (false: horizontal, true: vertical)     |
| `responsive`  | `boolean`                     | `false` | -        | Responsive mode — switches orientation at 768px          |

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

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
