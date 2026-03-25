> 한국어: [README.ko.md](./README.ko.md)

# VsFocusTrap

A focus trap component that confines keyboard focus to a specific area. Used to improve keyboard accessibility in modals, popups, dropdowns, and similar patterns.

**Available Version**: 2.0.0+

## Basic Usage

### Default Focus Trap

```html
<template>
    <vs-focus-trap>
        <div>
            <!-- First element to receive focus on Tab -->
            <input type="text" placeholder="First input" />
            <!-- Second element to receive focus on Tab -->
            <button>Button</button>
            <!-- Third element to receive focus on Tab -->
            <input type="text" placeholder="Second input" />
        </div>
    </vs-focus-trap>
</template>
```

### Disable Focus Lock

```html
<template>
    <vs-focus-trap disabled>
        <div>
            <input type="text" placeholder="First focusable element inside" />
            <!-- When Tab is pressed on the last focusable element inside,
                 focus moves to the next focusable element outside (not back inside) -->
            <button>Last focusable element inside</button>
        </div>
    </vs-focus-trap>
</template>
```

## Notes

- **Single child element**: The focus trap must contain exactly one child element.
- **Focusable elements**: The component works correctly only when it contains focusable elements (`button`, `input`, `a`, `[tabindex]`, etc.).
- **Keyboard cycle**: Tab and Shift+Tab cycle focus only within the trap. When `disabled` is `true`, cycling is disabled.

## Props

| Prop       | Type      | Default | Required | Description               |
| ---------- | --------- | ------- | -------- | ------------------------- |
| `disabled` | `boolean` | `false` | -        | Disable the focus trap    |

## Types

```typescript
// No StyleSet for this component
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| `default` | A single child element to apply the focus trap to (must be exactly one) |

## Methods

| Method  | Parameters | Description                                         |
| ------- | ---------- | --------------------------------------------------- |
| `focus` | -          | Activate the focus trap and set focus               |
| `blur`  | -          | Deactivate the focus trap and restore previous focus |

## Features

- **Automatic focus management**: Automatically sets focus when the component mounts and restores the previous focus when it unmounts
- **Keyboard cycle**: Tab/Shift+Tab cycles focus only within the component
- **Flexible focus control**: Optionally disable focus lock via the `disabled` prop
