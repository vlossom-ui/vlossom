> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsBlock

A content block component with an optional title area and a scrollable content region.

**Available Version**: 2.0.0+

## Feature

- Optional title slot rendered in a separated header area
- Scrollable content area powered by `VsInnerScroll`
- Responsive width via `width` and `grid` props
- `height` prop controls the block's total height
- Separate style control for `title` and `content` areas via CSSProperties

## Basic Usage

```html
<template>
    <vs-block>
        <p>Block content goes here.</p>
    </vs-block>
</template>
```

### With Title

```html
<template>
    <vs-block>
        <template #title>Block Title</template>
        <p>Block content goes here.</p>
    </vs-block>
</template>
```

### Fixed Height

```html
<template>
    <vs-block height="300px">
        <template #title>Scrollable Block</template>
        <p v-for="i in 20" :key="i">Line {{ i }}</p>
    </vs-block>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | Color scheme for the component |
| `styleSet` | `string \| VsBlockStyleSet` | | | Custom style set |
| `width` | `string \| number \| Breakpoints` | | | Width of the component |
| `grid` | `string \| number \| Breakpoints` | | | Grid column span |
| `height` | `string \| number` | | | Height of the block |

## Types

```typescript
interface VsBlockStyleSet {
    variables?: {
        border?: string;
    };
    component?: CSSProperties;
    title?: CSSProperties;
    content?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-block
        :style-set="{
            variables: {
                border: '2px solid #6200ea',
            },
            component: {
                borderRadius: '1rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            },
            title: {
                backgroundColor: '#6200ea',
                color: '#ffffff',
                padding: '1rem 1.5rem',
            },
            content: {
                padding: '1.5rem',
            },
        }"
    >
        <template #title>Styled Block</template>
        <p>Content with custom styling.</p>
    </vs-block>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Main content of the block |
| `title` | Content rendered in the title header area |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
