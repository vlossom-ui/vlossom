> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# Prompt Plugin

**Available Version**: 2.0.0+

Displays a modal dialog with an input field and OK / Cancel buttons. Returns a `Promise` that resolves to the entered value on confirmation, or `null` on cancellation.

## Feature

- Opens a modal overlay with custom string or Vue component content
- Renders a `VsInput` field with configurable input props
- Returns the input value on OK (or Enter key) and `null` on Cancel (or Escape key)
- Validates input before resolving — if validation fails, the modal stays open
- Supports custom button text, button order swap, gap and alignment
- Built on top of the Modal Plugin — all `ModalOptions` are inherited

## Basic Usage

Inject `$vsPrompt` in your component and call `open`:

```html
<template>
    <vs-button @click="askName">Ask for Name</vs-button>
</template>

<script setup>
import { inject } from 'vue';

const $vsPrompt = inject('$vsPrompt');

async function askName() {
    const name = await $vsPrompt.open('Please enter your name:');
    if (name !== null) {
        console.log('Name entered:', name);
    }
}
</script>
```

### With Input Configuration and Initial Value

```html
<script setup>
import { inject } from 'vue';

const $vsPrompt = inject('$vsPrompt');

async function askAge() {
    const age = await $vsPrompt.open('Enter your age:', {
        okText: 'Submit',
        cancelText: 'Skip',
        input: {
            type: 'number',
            placeholder: 'e.g. 25',
            initialValue: 18,
        },
        styleSet: {
            buttonsAlign: 'right',
        },
    });
    console.log('Age:', age);
}
</script>
```

## Methods

| Method | Parameters                                                                      | Description                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open` | `content: string \| Component, options?: PromptModalOptions` | Opens a prompt modal with the given content and options. Returns `Promise<string \| number \| null>` resolving to the input value on OK or `null` on Cancel. |

## Types

```typescript
interface VsPromptStyleSet extends VsModalNodeStyleSet {
    input?: Omit<VsInputStyleSet, 'append' | 'prepend'>;
    buttonsGap?: string | number;
    buttonsAlign?: Alignment;
    okButton?: Omit<VsButtonStyleSet, 'loading'>;
    cancelButton?: Omit<VsButtonStyleSet, 'loading'>;
}

interface PromptModalOptions extends ModalOptions {
    styleSet?: VsPromptStyleSet;
    colorScheme?: ColorScheme;
    input?: PropsOf<VsComponent.VsInput> & { initialValue?: VsInputValueType };
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

interface PromptPlugin {
    open(content: string | Component, options?: PromptModalOptions): Promise<VsInputValueType>;
}
```

> [!NOTE]
> `VsPromptStyleSet` extends `VsModalNodeStyleSet`. Refer to the [VsModal component docs](../../components/vs-modal/README.md) for available modal style options.
> `PromptModalOptions` extends `ModalOptions` from the [Modal Plugin](../modal-plugin/README.md).
> `input` accepts any props valid for `VsInput` in addition to an `initialValue`.

## Caution

- The prompt plugin depends on the Modal Plugin. Ensure both are registered when setting up the Vlossom plugin.
- If the input fails validation on OK/Enter, the modal remains open and the promise is not yet resolved.
- Pressing Escape or clicking outside the modal (if `dimClose` is enabled) resolves the promise with `null` and clears the input.
