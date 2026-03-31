# VsInnerScroll

A layout component that provides a scrollable content area with optional sticky header and footer sections.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Provides a vertically scrollable body area that fills available height.
- Supports optional sticky `header` and `footer` slots outside the scroll area.
- Applies scroll shadow styling via the `v-scroll-shadow` directive.
- Can hide the scrollbar with the `hideScroll` prop.
- Exposes `hasScroll` to programmatically check if content overflows.

## Basic Usage

```html
<template>
    <vs-inner-scroll style="height: 300px;">
        <p v-for="i in 20" :key="i">Line {{ i }}</p>
    </vs-inner-scroll>
</template>
```

### With Header and Footer

```html
<template>
    <vs-inner-scroll style="height: 400px;">
        <template #header>
            <div class="p-4 font-bold">Header</div>
        </template>

        <p v-for="i in 20" :key="i">Line {{ i }}</p>

        <template #footer>
            <div class="p-4">Footer</div>
        </template>
    </vs-inner-scroll>
</template>
```

### Hide Scrollbar

```html
<template>
    <vs-inner-scroll style="height: 200px;" :hide-scroll="true">
        <p v-for="i in 10" :key="i">Line {{ i }}</p>
    </vs-inner-scroll>
</template>
```

## Props

| Prop         | Type                                | Default | Required | Description                                    |
| ------------ | ----------------------------------- | ------- | -------- | ---------------------------------------------- |
| `styleSet`   | `string \| VsInnerScrollStyleSet`   | -       | -        | Custom style set for the component.            |
| `hideScroll` | `boolean`                           | `false` | -        | Hides the scrollbar while keeping scrollability. |

## Types

```typescript
interface VsInnerScrollStyleSet {
    component?: CSSProperties;
    header?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-inner-scroll
        style="height: 400px;"
        :style-set="{
            component: { backgroundColor: '#f5f5f5' },
            header: { padding: '1rem', borderBottom: '1px solid #ddd' },
            content: { padding: '1rem' },
            footer: { padding: '0.5rem', borderTop: '1px solid #ddd' },
        }"
    >
        <template #header>
            <h3>Title</h3>
        </template>
        <p v-for="i in 20" :key="i">Line {{ i }}</p>
        <template #footer>
            <span>Footer text</span>
        </template>
    </vs-inner-scroll>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                                      |
| --------- | ------------------------------------------------ |
| `default` | Scrollable content area.                         |
| `header`  | Sticky header displayed above the scroll area.   |
| `footer`  | Sticky footer displayed below the scroll area.   |

## Methods

| Method      | Parameters | Description                                         |
| ----------- | ---------- | --------------------------------------------------- |
| `hasScroll` | -          | Returns `true` if the content overflows the container. |
