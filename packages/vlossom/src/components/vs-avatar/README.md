> 한국어: [README.ko.md](./README.ko.md)

# VsAvatar

An avatar component for displaying user profile images, initials, or icons. Supports various sizes and style customization.

**Available Version**: 2.0.0+

## Basic Usage

### Image Avatar

```html
<template>
    <vs-avatar>
        <img src="/path/to/avatar.jpg" alt="User Avatar" />
    </vs-avatar>
</template>
```

### StyleSet Example

```html
<template>
    <vs-avatar
        :style-set="{
            variables: {
                objectFit: 'cover',
            },
            component: {
                width: '5rem',
                height: '5rem',
                backgroundColor: '#e188e5',
                borderRadius: '50%',
            },
        }"
    >
        <img src="/path/to/avatar.jpg" alt="User Avatar" />
    </vs-avatar>
</template>
```

## Props

| Prop          | Type                         | Default | Required | Description                       |
| ------------- | ---------------------------- | ------- | -------- | --------------------------------- |
| `colorScheme` | `ColorScheme`                | -       | -        | Color scheme for the component    |
| `styleSet`    | `string \| VsAvatarStyleSet` | -       | -        | Custom style configuration object |

## Types

```typescript
interface VsAvatarStyleSet {
    variables?: {
        objectFit?: string;
    };
    component?: CSSProperties;
}
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                              |
| --------- | ---------------------------------------- |
| `default` | Avatar content (text, image, icon, etc.) |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Flexible content**: Supports text, images, icons, and more
- **Image optimization**: Maintain image aspect ratio using the `object-fit` property
