> 한국어: [README.ko.md](./README.ko.md)

# VsInputWrapper

A wrapper component for input fields. Provides label, required indicator, messages, responsive layout, and shake animation for a consistent input field UI.

**Available Version**: 2.0.0+

## Basic Usage

### Default Input Wrapper

```html
<template>
    <vs-input-wrapper label="Name">
        <input type="text" placeholder="Enter your name" />
    </vs-input-wrapper>
</template>
```

### Required Field

```html
<template>
    <vs-input-wrapper label="Email" required>
        <input type="email" placeholder="Enter your email" />
    </vs-input-wrapper>
</template>
```

### With Messages

```html
<template>
    <vs-input-wrapper
        label="Password"
        :messages="[
            { state: 'error', text: 'Password must be at least 8 characters.' }
        ]"
    >
        <input type="password" placeholder="Enter password" />
    </vs-input-wrapper>
</template>
```

### Group Label (fieldset/legend)

```html
<template>
    <vs-input-wrapper label="Personal Info" group-label>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
    </vs-input-wrapper>
</template>
```

### Hide Label and Messages

```html
<template>
    <vs-input-wrapper no-label no-messages>
        <input type="text" placeholder="Input without label and messages" />
    </vs-input-wrapper>
</template>
```

### StyleSet Example

```html
<template>
    <vs-input-wrapper
        label="Name"
        :messages="[{ state: 'info', text: 'Please enter your real name.' }]"
        :style-set="{
            label: {
                fontSize: '18px',
                fontWeight: 'bold',
            },
            messages: {
                marginTop: '8px',
            },
        }"
    >
        <input type="text" />
    </vs-input-wrapper>
</template>
```

## Props

| Prop          | Type                               | Default | Required | Description                            |
| ------------- | ---------------------------------- | ------- | -------- | -------------------------------------- |
| `disabled`    | `boolean`                          | `false` | -        | Disable the wrapper                    |
| `hidden`      | `boolean`                          | `false` | -        | Hide the input wrapper                 |
| `id`          | `string`                           | `''`    | -        | Unique ID for the input wrapper        |
| `label`       | `string`                           | `''`    | -        | Label text for the input field         |
| `noLabel`     | `boolean`                          | `false` | -        | Disable label display                  |
| `noMessages`  | `boolean`                          | `false` | -        | Disable message display                |
| `required`    | `boolean`                          | `false` | -        | Show required indicator (red asterisk) |
| `groupLabel`  | `boolean`                          | `false` | -        | Render label as fieldset/legend        |
| `messages`    | `StateMessage<UIState>[]`          | `[]`    | -        | Array of messages to display           |
| `shake`       | `boolean`                          | `false` | -        | Trigger shake animation                |
| `width`       | `string \| number \| Breakpoints`  | -       | -        | Responsive width                       |
| `grid`        | `string \| number \| Breakpoints`  | -       | -        | Grid layout size                       |
| `colorScheme` | `ColorScheme`                      | -       | -        | Color scheme for the component         |
| `styleSet`    | `string \| VsInputWrapperStyleSet` | -       | -        | Custom style configuration object      |

## Types

```typescript
import type { VsMessageStyleSet } from '@/components/vs-message/types';

interface StateMessage<T extends string = UIState> {
    state: T;
    text: string;
}

type UIState = 'idle' | 'info' | 'success' | 'warning' | 'error';

interface VsInputWrapperStyleSet {
    component?: CSSProperties;
    label?: CSSProperties;
    messages?: CSSProperties; // message list area style
    message?: VsMessageStyleSet;
}
```

> [!NOTE]
>
> `message` uses [VsMessageStyleSet](../vs-message/README.md#types).

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot       | Description                                   |
| ---------- | --------------------------------------------- |
| `default`  | Input field component (input, textarea, etc.) |
| `label`    | Custom label content                          |
| `messages` | Custom message content                        |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Label management**: Automatic label rendering and custom label slot support
- **Required indicator**: Visually mark required fields via the `required` prop
- **Message system**: Display state-specific messages (info, success, warning, error)
- **Style system**: Fine-grained style control via `colorScheme` and `styleSet`
- **Responsive layout**: Responsive width and grid based on VsResponsive
- **Shake animation**: Visual feedback on validation failure
- **Accessibility**: Supports fieldset/legend structure for screen reader compatibility
- **Customizable**: Full customization via label and message slots
