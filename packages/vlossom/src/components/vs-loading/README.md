> 한국어: [README.ko.md](./README.ko.md)

# VsLoading

An inline animated loading indicator component.

**Available Version**: 2.0.0+

## Basic Usage

```vue
<template>
    <vs-loading />
    <vs-loading width="100px" height="50px" />
    <vs-loading :width="200" :height="100" />
</template>
```

## Props

| Prop          | Type                          | Default | Required | Description                              |
| ------------- | ----------------------------- | ------- | -------- | ---------------------------------------- |
| `colorScheme` | `ColorScheme`                 | -       | -        | Color scheme for the component           |
| `styleSet`    | `string \| VsLoadingStyleSet` | -       | -        | Custom style configuration object        |
| `width`       | `string \| number`            | -       | -        | Loading indicator width (default 8rem)   |
| `height`      | `string \| number`            | -       | -        | Loading indicator height (default 10rem) |

## Types

```typescript
interface VsLoadingStyleSet {
    variables?: {
        barWidth?: string;
        color?: string;
    };
    component?: CSSProperties;
}
```

### StyleSet Example

```vue
<template>
    <vs-loading
        :style-set="{
            variables: {
                barWidth: '15%',
                color: '#ff6b6b',
            },
            component: {
                width: '6rem',
                height: '8rem',
            },
        }"
    />
</template>
```
