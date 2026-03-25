> 한국어: [README.ko.md](./README.ko.md)

# VsBar

A flexible bar component that can be positioned anywhere. Useful as a navigation bar, toolbar, status bar, and more. Provides flexible positioning and semantic HTML tag options.

**Available Version**: 2.0.0+

## Basic Usage

### Default Bar

```html
<template>
    <vs-bar>
        BAR CONTENTS
    </vs-bar>
</template>
```

### Primary Style

```html
<template>
    <vs-bar primary>
        PRIMARY STYLE
    </vs-bar>
</template>
```

### Semantic HTML Tags

```html
<template>
    <!-- Navigation bar -->
    <vs-bar tag="nav">
        <a href="#home">Home</a>
        <a href="#about">About</a>
    </vs-bar>

    <!-- Header bar -->
    <vs-bar tag="header">
        <h1>Site Title</h1>
    </vs-bar>

    <!-- Footer bar -->
    <vs-bar tag="footer">
        <p>&copy; 2024 Company Name</p>
    </vs-bar>
</template>
```

### Positioning

```html
<template>
    <vs-bar position="fixed"><span>Fixed bar</span></vs-bar>
    <vs-bar position="absolute"><span>Absolute bar</span></vs-bar>
    <vs-bar position="sticky"><span>Sticky bar</span></vs-bar>
    <vs-bar position="static"><span>Static bar</span></vs-bar>
</template>
```

### StyleSet Example

```html
<template>
    <vs-bar :style-set="{
        component: {
            backgroundColor: '#2c3e50',
            padding: '1rem',
            color: '#ffffff',
        }
    }">
        Custom Bar
    </vs-bar>
</template>
```

## Props

| Prop          | Type                                                          | Default      | Required | Description                       |
| ------------- | ------------------------------------------------------------- | ------------ | -------- | --------------------------------- |
| `colorScheme` | `ColorScheme`                                                 | -            | -        | Color scheme for the component    |
| `styleSet`    | `string \| VsBarStyleSet`                                     | -            | -        | Custom style configuration object |
| `primary`     | `boolean`                                                     | `false`      | -        | Apply emphasized primary style    |
| `position`    | `'relative' \| 'absolute' \| 'fixed' \| 'sticky' \| 'static'` | `'relative'` | -        | CSS position value                |
| `tag`         | `string`                                                      | `'div'`      | -        | HTML tag to render as             |

## Types

```typescript
interface VsBarStyleSet {
    component?: CSSProperties;
}
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                       |
| --------- | --------------------------------- |
| `default` | Content to display inside the bar |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Flexible positioning**: Provides `relative`, `absolute`, `fixed`, `sticky`, `static` CSS position options via the `position` prop
- **Semantic HTML support**: Use appropriate HTML tags (`nav`, `header`, `footer`, `section`, etc.) via the `tag` prop
- **Primary style**: Apply an emphasized primary style when needed
