# VsLayout

A root layout container that provides the layout store context required by `VsHeader`, `VsFooter`, and other layout-aware components.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Provides the layout store via `provide` for descendant layout components.
- Acts as the top-level container that enables `VsHeader` and `VsFooter` position tracking.
- Takes up the full width and height of its parent element.
- Simple wrapper with no additional props or styling.

## Basic Usage

```html
<template>
    <vs-layout>
        <vs-header>My App Header</vs-header>
        <main>
            <slot />
        </main>
        <vs-footer>Footer</vs-footer>
    </vs-layout>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |

## Types

```typescript
// No StyleSet interface — this component does not accept a styleSet prop.
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                          |
| --------- | ------------------------------------ |
| `default` | The content to render inside the layout. |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Caution

`VsLayout` must wrap any page or section that uses `VsHeader` or `VsFooter`. Without it, those components cannot register themselves in the layout store and will not function correctly.
