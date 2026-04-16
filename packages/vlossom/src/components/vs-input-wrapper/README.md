# VsInputWrapper

A layout wrapper for form inputs that provides a label, validation messages area, and responsive layout support.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Wraps any form input with a consistent label and message layout.
- Supports horizontal shake animation on validation failure.
- Can render as a `fieldset`/`legend` pair for accessible grouped inputs.
- Integrates with `vs-message` for displaying state-aware validation messages.
- Responsive layout via `width` and `grid` props.

## Basic Usage

```html
<template>
    <vs-input-wrapper label="Username">
        <input type="text" placeholder="Enter username" />
    </vs-input-wrapper>
</template>
```

### With Messages

```html
<template>
    <vs-input-wrapper
        label="Email"
        :messages="[{ state: 'error', text: 'Invalid email address' }]"
    >
        <input type="email" />
    </vs-input-wrapper>
</template>
```

### Group Label (fieldset)

```html
<template>
    <vs-input-wrapper label="Shipping Address" :group-label="true">
        <input type="text" placeholder="Street" />
        <input type="text" placeholder="City" />
    </vs-input-wrapper>
</template>
```

### Required Field

```html
<template>
    <vs-input-wrapper label="Password" :required="true">
        <input type="password" />
    </vs-input-wrapper>
</template>
```

## Props

| Prop         | Type                                | Default | Required | Description                                                           |
| ------------ | ----------------------------------- | ------- | -------- | --------------------------------------------------------------------- |
| `styleSet`   | `string \| VsInputWrapperStyleSet`  | -       | -        | Custom style set for the component.                                   |
| `width`      | `string \| number \| Breakpoints`   | -       | -        | Width of the component.                                               |
| `grid`       | `string \| number \| Breakpoints`   | -       | -        | Grid column span for layout.                                          |
| `disabled`   | `boolean`                           | `false` | -        | Applies disabled styling to the label and messages.                   |
| `hidden`     | `boolean`                           | `false` | -        | Hides the entire component.                                           |
| `id`         | `string`                            | `''`    | -        | The `id` linked to the label's `for` attribute.                       |
| `label`      | `string`                            | `''`    | -        | Label text displayed above the input.                                 |
| `noLabel`    | `boolean`                           | `false` | -        | Hides the label area.                                                 |
| `noMessages` | `boolean`                           | `false` | -        | Hides the messages area.                                              |
| `required`   | `boolean`                           | `false` | -        | Shows a required star (*) indicator next to the label.                |
| `groupLabel` | `boolean`                           | `false` | -        | Renders the wrapper as `fieldset`/`legend` for grouped inputs.        |
| `messages`   | `StateMessage[]`                    | `[]`    | -        | Array of state+text messages displayed below the input.               |
| `shake`      | `boolean`                           | `false` | -        | Triggers a horizontal shake animation (e.g., on validation failure).  |

## Types

```typescript
interface VsInputWrapperStyleSet {
    component?: CSSProperties;
    label?: CSSProperties;
    messages?: CSSProperties;
    message?: VsMessageStyleSet;
}
```

> [!NOTE]
> `message` uses `VsMessageStyleSet`. See the [VsMessage README](../vs-message/README.md) for details.

### StyleSet Example

```html
<template>
    <vs-input-wrapper
        label="Styled Wrapper"
        :style-set="{
            component: { padding: '1rem', backgroundColor: '#f9f9f9' },
            label: { color: '#333', fontWeight: '600' },
            messages: { marginTop: '0.5rem' },
            message: { component: { fontSize: '0.75rem' } },
        }"
    >
        <input type="text" />
    </vs-input-wrapper>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot       | Description                                              |
| ---------- | -------------------------------------------------------- |
| `default`  | The form input or content to wrap.                       |
| `label`    | Custom label content replacing the default label text.   |
| `messages` | Custom messages content replacing the default messages.  |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
