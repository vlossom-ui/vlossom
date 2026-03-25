> 한국어: [README.ko.md](./README.ko.md)

# VsSkeleton

A skeleton UI component displayed while content is loading. Communicates the loading state to users with a smooth pulse animation.

**Available Version**: 2.0.0+

## Basic Usage

### Default Skeleton

```html
<template>
    <div class="w-[200px] h-[100px]">
        <vs-skeleton />
    </div>
</template>
```

### Skeleton with Text

```html
<template>
    <div class="w-[200px] h-[100px]">
        <vs-skeleton>Loading...</vs-skeleton>
    </div>
</template>
```

## Props

| Prop          | Type                           | Default | Required | Description                       |
| ------------- | ------------------------------ | ------- | -------- | --------------------------------- |
| `colorScheme` | `ColorScheme`                  | -       | -        | Color scheme for the component    |
| `styleSet`    | `string \| VsSkeletonStyleSet` | -       | -        | Custom style configuration object |

## Slots

| Slot      | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `default` | Text or content to display on top of the skeleton (optional) |

## Types

```typescript
interface VsSkeletonStyleSet {
    background?: CSSProperties;
    content?: CSSProperties;
    component?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <div class="w-[200px] h-[100px]">
        <vs-skeleton
            :style-set="{
                component: {
                    borderRadius: '12px',
                },
                background: {
                    backgroundColor: '#e0e0e0',
                },
                content: {
                    color: '#999999',
                },
            }"
        >
            Loading...
        </vs-skeleton>
    </div>
</template>
```

## Features

- **Smooth animation**: Represents loading state with a 1-second pulse animation
- **Responsive size**: Automatically adjusts to the parent container size (default 100%)
- **Flexible content**: Show loading text or icons via the slot
- **Customizable**: Fine-grained style control via styleSet
