> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsTextWrap

A container component that wraps text content and provides copy-to-clipboard and external link action buttons.

**Available Version**: 2.0.0+

## Feature

- Copy-to-clipboard button with visual feedback (icon changes on success)
- External link button that opens a URL in a new tab
- Custom action slot for additional buttons
- Configurable width with CSS variable support
- Lightweight wrapper with no required props

## Basic Usage

```html
<template>
    <vs-text-wrap copy>
        <p>This text can be copied to the clipboard.</p>
    </vs-text-wrap>
</template>
```

### With Link Button

```html
<template>
    <vs-text-wrap link="https://vlossom.dev">
        Visit our website
    </vs-text-wrap>
</template>
```

### Copy and Link Together

```html
<template>
    <vs-text-wrap copy link="https://vlossom.dev" :width="400">
        <code>npm install vlossom</code>
    </vs-text-wrap>
</template>
```

### Custom Actions Slot

```html
<template>
    <vs-text-wrap>
        <p>Content here</p>
        <template #actions>
            <button @click="doSomething">Custom Action</button>
        </template>
    </vs-text-wrap>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `styleSet` | `string \| VsTextWrapStyleSet` | | | Custom style set for the component |
| `copy` | `boolean` | `false` | | Shows the copy-to-clipboard button |
| `link` | `string` | `''` | | URL to open in a new tab when the link button is clicked |
| `width` | `string \| number` | `''` | | Width of the component |

## Types

```typescript
interface VsTextWrapStyleSet {
    component?: CSSProperties;
    copyIcon?: CSSProperties;
    linkIcon?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-text-wrap
        copy
        :style-set="{
            component: { backgroundColor: '#f5f5f5', borderRadius: '0.5rem', padding: '1rem' },
            copyIcon: { color: '#1976d2', fontSize: '1.2rem' },
            linkIcon: { color: '#4caf50' },
        }"
    >
        <p>Styled content</p>
    </vs-text-wrap>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `copied` | `string` | Emitted when text is successfully copied to the clipboard |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Main text content to display |
| `actions` | Additional action buttons displayed before the copy/link buttons |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Caution

The `link` prop only accepts `http:` or `https:` URLs. Invalid or unsafe URLs are ignored with a console warning.
