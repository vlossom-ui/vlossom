# VsLayout

A root layout container that provides the layout store context required by `VsHeader`, `VsFooter`, and other layout-aware components.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Provides the layout store and a layout context marker via `provide` for descendant layout components.
- Enables position tracking for descendants that opt in with the `layout` prop (`VsHeader`, `VsFooter`, `VsDrawer`, `VsContainer`).
- Takes up the full width and height of its parent element.
- Simple wrapper with no additional props or styling.

## Basic Usage

Descendants must explicitly opt in with the `layout` prop to participate in layout-store coordination. The opt-in works through any number of intermediate wrapper components, but does **not** propagate through another layout primitive (the inner one is barriered to prevent unintended coupling).

```html
<template>
    <vs-layout>
        <vs-header layout>My App Header</vs-header>
        <vs-container layout>
            <slot />
        </vs-container>
        <vs-footer layout>Footer</vs-footer>
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

`VsLayout` must wrap any page or section that uses the `layout` prop on `VsHeader`, `VsFooter`, `VsDrawer`, or `VsContainer`. Without a `VsLayout` ancestor, the `layout` prop has no effect and those components fall back to standalone behavior.
