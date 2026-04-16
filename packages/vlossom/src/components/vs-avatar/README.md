> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsAvatar

A circular or rounded display element for showing user profile images, initials, or icons.

**Available Version**: 2.0.0+

## Feature

- Accepts image elements, text initials, or icon content via the default slot
- Supports `object-fit` customization for images via the `objectFit` CSS variable
- Color scheme support for background and border styling
- Fixed default size (3.6rem × 3.6rem) with full override via `component` CSSProperties

## Basic Usage

```html
<template>
    <vs-avatar>
        <img src="/profile.png" alt="User Avatar" />
    </vs-avatar>
</template>
```

### Text Initials

```html
<template>
    <vs-avatar>JD</vs-avatar>
</template>
```

### With Color Scheme

```html
<template>
    <vs-avatar color-scheme="blue">
        <img src="/profile.png" alt="User" />
    </vs-avatar>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | Color scheme for the component |
| `styleSet` | `string \| VsAvatarStyleSet` | | | Custom style set |

## Types

```typescript
interface VsAvatarStyleSet {
    variables?: {
        objectFit?: CSSProperties['objectFit'] & {};
    };
    component?: CSSProperties;
}
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
                borderRadius: '50%',
            },
        }"
    >
        <img src="/profile.png" alt="User" />
    </vs-avatar>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Avatar content — image, initials, or icon |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
