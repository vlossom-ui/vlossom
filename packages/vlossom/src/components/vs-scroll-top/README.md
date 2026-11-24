> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsScrollTop

A button that appears once the page scrolls past a set distance and scrolls the scroll container (`window` by default) back to the top when clicked.

**Available Version**: 2.4.0+

## Feature

- Appears automatically after scrolling past `threshold` and hides again when scrolled back up
- Supports inner scroll containers selected with `target`, not only `window`
- Uses `position: absolute` by default; set `fixed` to pin it to the viewport
- Sits at the bottom right by default; move it with `styleSet`
- Delegates the default button's behavior and look to `VsButton` (`primary`, `outline`, `ghost`, `size`)
- Replace the whole button with the `default` slot (`scrollToTop` is provided as a slot prop)
- `noAnimation` turns off both the fade animation and smooth scrolling
- Respects the user's OS `prefers-reduced-motion` setting and scrolls instantly
- Provides a localized aria-label by default (`VS_ARIA_SCROLL_TOP`)

## Basic Usage

```html
<template>
    <vs-scroll-top fixed />
</template>
```

### Inner Scroll Container

```html live
<template>
    <div style="position: relative">
        <div id="scroll-area" style="height: 300px; overflow-y: auto">
            <p v-for="i in 50" :key="i">Line {{ i }}</p>
        </div>
        <vs-scroll-top target="#scroll-area" />
    </div>
</template>
```

### Custom Threshold

```html
<template>
    <vs-scroll-top fixed :threshold="500" primary />
</template>
```

### Custom Button

```html
<template>
    <vs-scroll-top fixed v-slot="{ scrollToTop }">
        <vs-button outline aria-label="Scroll to top" @click="scrollToTop">TOP</vs-button>
    </vs-scroll-top>
</template>
```

## Props

| Prop          | Type                            | Default | Required | Description                                                                                      |
| ------------- | ------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------ |
| `colorScheme` | `ColorScheme`                   |         |          | Color scheme for the component                                                                   |
| `styleSet`    | `string \| VsScrollTopStyleSet` |         |          | Custom style set for the component                                                               |
| `ghost`       | `boolean`                       | `false` |          | Applies ghost style to the default button                                                        |
| `outline`     | `boolean`                       | `false` |          | Applies outline style to the default button                                                      |
| `primary`     | `boolean`                       | `false` |          | Applies primary style to the default button                                                      |
| `size`        | `Size`                          | `'md'`  |          | Default button size (`xs` to `xl`)                                                               |
| `fixed`       | `boolean`                       | `false` |          | Pins the button to the viewport with `position: fixed`                                           |
| `noAnimation` | `boolean`                       | `false` |          | Turns off the fade animation and smooth scrolling (always applied with `prefers-reduced-motion`) |
| `target`      | `string`                        | `''`    |          | CSS selector of the scroll container. Uses `window` when empty                                   |
| `threshold`   | `number \| string`              | `200`   |          | Scroll distance (px) at which the button appears. `0` always shows it                            |

## Types

```typescript
interface VsScrollTopStyleSet extends CSSProperties {
    $button?: VsButtonStyleSet;
}

interface VsScrollTopRef extends ComponentPublicInstance<typeof VsScrollTop> {
    scrollToTop: () => void;
}
```

> [!NOTE]
> The root `CSSProperties` apply to the wrapper that handles positioning. The defaults are `right: 2rem` and `bottom: 2rem`.
> `$button` is the `VsButtonStyleSet` applied to the default button. See the [VsButton docs](../vs-button/README.md) for details.

### StyleSet Example

```html
<template>
    <vs-scroll-top
        fixed
        :style-set="{
            right: 'auto',
            left: '1rem',
            bottom: '5rem',
            $button: {
                borderRadius: '50%',
                width: '3rem',
                height: '3rem',
            },
        }"
    />
</template>
```

## Events

| Event  | Payload | Description |
| ------ | ------- | ----------- |
| (none) |         |             |

## Slots

| Slot      | Description                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `default` | Replaces the whole button. Receives `{ scrollToTop: () => void }` as slot props. Defaults to a `VsButton` with an `ArrowUpIcon` |

## Methods

| Method        | Parameters | Description                                                                                        |
| ------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `scrollToTop` | -          | Scrolls the target container to the top (instantly with `noAnimation` or `prefers-reduced-motion`) |

## Caution

- The default is `position: absolute`, so set `fixed` when you use it for `window` scrolling. Otherwise the button scrolls with the document.
- When you use `target`, place the button in a `position: relative` wrapper **outside** the scroll container. If you put it inside the container, the button scrolls with it.
- `target` is looked up only once, at mount time. If the target element renders later, remount `vs-scroll-top` with it by using `v-if` or `key`. If no element matches, the button is not rendered even with `threshold: 0`.
- To move the button to the left or top, reset the default with `right: 'auto'` or `bottom: 'auto'`. Otherwise both values apply.
- With the `default` slot, `ghost`, `outline`, `primary`, `size`, `$button`, and the default aria-label do not apply. Set the click handling (`scrollToTop`) and accessibility attributes in the slot content yourself.
- After a click scrolls the page back above `threshold`, the button is removed, so keyboard focus moves to `body`. If keyboard users need focus at the top, move it yourself after calling `scrollToTop` (for example, in the `default` slot).
