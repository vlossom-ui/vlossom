# VsImage

A component for displaying images with support for lazy loading, fallback images, and a skeleton placeholder while loading.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Displays an image with configurable `src`, `alt`, and `fallback` props.
- Shows a skeleton placeholder while the image is loading.
- Supports lazy loading via the Intersection Observer API.
- Automatically switches to the `fallback` image on load error.
- Supports custom fallback UI with the `fallback` prop or `fallback` slot. If both are provided, the prop takes priority.
- Displays the no image icon when neither the `fallback` prop nor slot is provided, or when the fallback image fails to load.
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

Provide fallback UI shown when the primary source fails, using either the `fallback` prop or the `fallback` slot. If both are provided, the prop takes priority.

**Prop usage example**

```html
<template>
    <vs-image
        src="https://example.com/broken.png"
        fallback="https://example.com/fallback.png"
        alt="Image with fallback"
    />
</template>
```

**Slot usage example**

```html
<template>
    <vs-image src="https://example.com/broken.png" alt="Custom fallback">
        <template #fallback>
            <div>Image could not be loaded.</div>
        </template>
    </vs-image>
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

| Prop         | Type                        | Default | Required | Description                                                                                            |
| ------------ | --------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `styleSet`   | `string \| VsImageStyleSet` | -       | -        | Custom style set for the component.                                                                    |
| `alt`        | `string`                    | `''`    | -        | Alt text for the image element.                                                                        |
| `fallback`   | `string`                    | `''`    | -        | Fallback image URL shown when the primary src fails. If omitted or failed, the no image icon is shown. |
| `lazy`       | `boolean`                   | `false` | -        | Enables lazy loading using the Intersection Observer.                                                  |
| `noSkeleton` | `boolean`                   | `false` | -        | Disables the skeleton placeholder during loading.                                                      |
| `src`        | `string`                    | `''`    | `true`   | The source URL of the image.                                                                           |
| `width`      | `string \| number`          | -       | -        | Width of the image component.                                                                          |
| `height`     | `string \| number`          | -       | -        | Height of the image component.                                                                         |

## Types

```typescript
interface VsImageStyleSet extends CSSProperties {
    $image?: CSSProperties;
    $skeleton?: VsSkeletonStyleSet;
}
```

> [!NOTE]
> `$image` applies styles to the inner `<img>` element.
> `$skeleton` uses `VsSkeletonStyleSet`. See the [VsSkeleton README](../vs-skeleton/README.md) for details.

### StyleSet Example

```html
<template>
    <vs-image
        src="https://example.com/image.png"
        alt="Styled image"
        width="200px"
        height="200px"
        :style-set="{
            borderRadius: '8px',
            $image: { objectFit: 'cover', borderRadius: '8px' },
            $skeleton: { borderRadius: '8px' },
        }"
    />
</template>
```

## Events

| Event   | Payload | Description                           |
| ------- | ------- | ------------------------------------- |
| `error` | -       | Emitted when the image fails to load. |

## Slots

| Slot       | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| `skeleton` | Custom content displayed inside the skeleton state.          |
| `fallback` | Custom fallback UI used when no `fallback` prop is provided. |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
