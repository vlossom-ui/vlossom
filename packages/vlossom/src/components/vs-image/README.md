# VsImage

A component for displaying images with support for lazy loading, fallback images, and a skeleton placeholder while loading.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Displays an image with configurable `src`, `alt`, and `fallback` props.
- Shows a skeleton placeholder while the image is loading.
- Supports lazy loading via the Intersection Observer API.
- Automatically switches to the `fallback` image on load error.
- Fires an `error` event when an image fails to load.

## Basic Usage

```html
<template>
    <vs-image src="https://example.com/image.png" alt="Example image" />
</template>
```

### Lazy Loading

Defer image loading until the element enters the viewport.

```html
<template>
    <vs-image src="https://example.com/image.png" alt="Lazy image" :lazy="true" />
</template>
```

### Fallback Image

Provide a fallback image URL that is shown when the primary source fails.

```html
<template>
    <vs-image
        src="https://example.com/broken.png"
        fallback="https://example.com/fallback.png"
        alt="Image with fallback"
    />
</template>
```

### No Skeleton

Disable the skeleton placeholder during loading.

```html
<template>
    <vs-image src="https://example.com/image.png" alt="No skeleton" :no-skeleton="true" />
</template>
```

## Props

| Prop        | Type                           | Default | Required | Description                                           |
| ----------- | ------------------------------ | ------- | -------- | ----------------------------------------------------- |
| `styleSet`  | `string \| VsImageStyleSet`    | -       | -        | Custom style set for the component.                   |
| `alt`       | `string`                       | `''`    | -        | Alt text for the image element.                       |
| `fallback`  | `string`                       | `''`    | -        | Fallback image URL shown when the primary src fails.  |
| `lazy`      | `boolean`                      | `false` | -        | Enables lazy loading using the Intersection Observer. |
| `noSkeleton`| `boolean`                      | `false` | -        | Disables the skeleton placeholder during loading.     |
| `src`       | `string`                       | `''`    | `true`   | The source URL of the image.                          |

## Types

```typescript
interface VsImageStyleSet {
    variables?: {
        width?: string;
        height?: string;
    };
    skeleton?: VsSkeletonStyleSet;
    component?: CSSProperties;
}
```

> [!NOTE]
> `skeleton` uses `VsSkeletonStyleSet`. See the [VsSkeleton README](../vs-skeleton/README.md) for details.

### StyleSet Example

```html
<template>
    <vs-image
        src="https://example.com/image.png"
        alt="Styled image"
        :style-set="{
            variables: { width: '200px', height: '200px' },
            component: { borderRadius: '8px', objectFit: 'cover' },
            skeleton: { component: { borderRadius: '8px' } },
        }"
    />
</template>
```

## Events

| Event   | Payload | Description                              |
| ------- | ------- | ---------------------------------------- |
| `error` | -       | Emitted when the image fails to load.    |

## Slots

| Slot       | Description                                         |
| ---------- | --------------------------------------------------- |
| `skeleton` | Custom content displayed inside the skeleton state. |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
