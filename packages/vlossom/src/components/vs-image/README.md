> 한국어: [README.ko.md](./README.ko.md)

# VsImage

An image display component. Supports lazy loading, fallback images, and skeleton loading states.

**Available Version**: 2.0.0+

## Basic Usage

### Default Image

```html
<template>
    <vs-image
        src="https://example.com/image.jpg"
        alt="Example Image"
    />
</template>
```

### Lazy Loading

```html
<template>
    <vs-image
        src="https://example.com/image.jpg"
        alt="Lazy Image"
        :lazy="true"
    />
</template>
```

### Fallback Image

```html
<template>
    <vs-image
        src="https://example.com/image.jpg"
        fallback="https://example.com/fallback.jpg"
        alt="Image with fallback"
    />
</template>
```

### Skeleton Loading State

```html
<template>
    <vs-image
        src="https://example.com/image.jpg"
        alt="Image with skeleton"
    >
        <template #skeleton>
            Loading...
        </template>
    </vs-image>
</template>
```

### StyleSet Example

```html
<template>
    <vs-image
        src="https://example.com/image.jpg"
        alt="Sized Image"
        :style-set="{
            variables: {
                width: '300px',
                height: '300px',
            },
        }"
    />
</template>
```

## Props

| Prop         | Type                        | Default | Required | Description                            |
| ------------ | --------------------------- | ------- | -------- | -------------------------------------- |
| `src`        | `string`                    | -       | ✅       | Image source URL                       |
| `alt`        | `string`                    | `''`    | -        | Alternative text for the image         |
| `fallback`   | `string`                    | `''`    | -        | Fallback image URL when loading fails  |
| `lazy`       | `boolean`                   | `false` | -        | Enable lazy loading                    |
| `noSkeleton` | `boolean`                   | `false` | -        | Disable skeleton display while loading |
| `styleSet`   | `string \| VsImageStyleSet` | -       | -        | Custom style configuration object      |

## Types

```typescript
import type { CSSProperties } from 'vue';
import type { VsSkeletonStyleSet } from '@/components/vs-skeleton/types';

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
>
> `skeleton` uses [VsSkeletonStyleSet](../vs-skeleton/README.md#types).

## Events

| Event   | Payload | Description                      |
| ------- | ------- | -------------------------------- |
| `error` | -       | Emitted when image loading fails |

## Slots

| Slot       | Description                                         |
| ---------- | --------------------------------------------------- |
| `skeleton` | Skeleton content displayed while loading (optional) |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Lazy loading**: Efficient lazy loading using IntersectionObserver
- **Fallback support**: Automatically shows fallback image when loading fails
- **Loading state**: Visualize loading state with skeleton UI
- **Accessibility**: Accessibility support via alt text
- **Responsive**: Flexible sizing and aspect ratio maintenance via object-fit
- **Error handling**: Emits `error` event when image loading fails
