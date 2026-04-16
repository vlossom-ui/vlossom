> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsSkeleton

A skeleton loading placeholder component that displays an animated background while content is loading.

**Available Version**: 2.0.0+

## Feature

- Animated blinking background to indicate loading state
- Supports default slot content centered over the skeleton
- Customizable background, content area, and root element via `CSSProperties`
- Color scheme support for consistent theming

## Basic Usage

```html
<template>
    <vs-skeleton style="width: 200px; height: 200px; border-radius: 50%;" />
</template>
```

### With Content Slot

```html
<template>
    <vs-skeleton style="width: 100%; height: 4rem;">
        <span>Loading...</span>
    </vs-skeleton>
</template>
```

### Custom Size and Shape

```html
<template>
    <vs-skeleton
        :style-set="{
            component: { width: '150px', height: '150px', borderRadius: '50%' },
        }"
    />
</template>
```

## Props

| Prop          | Type                           | Default | Required | Description                          |
| ------------- | ------------------------------ | ------- | -------- | ------------------------------------ |
| `colorScheme` | `string`                       | -       | -        | Color scheme for the component       |
| `styleSet`    | `string \| VsSkeletonStyleSet`  | -       | -        | Custom style set for the component   |

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
    <vs-skeleton
        :style-set="{
            component: { width: '100%', height: '2rem', borderRadius: '0.5rem' },
            background: { backgroundColor: '#e0e0e0' },
            content: { color: '#999' },
        }"
    >
        Loading...
    </vs-skeleton>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                                          |
| --------- | ---------------------------------------------------- |
| `default` | Content displayed centered over the skeleton background |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
