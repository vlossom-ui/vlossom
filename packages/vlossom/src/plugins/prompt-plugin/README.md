> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# Prompt Plugin

**Available Version**: 2.0.0+

Displays a modal dialog with an input field and OK / Cancel buttons. Returns a `Promise` that resolves to the entered value on confirmation, or `null` on cancellation.

## Feature

- Opens a modal overlay with custom string or Vue component content
- Renders a `VsInput` field with configurable input props
- Returns the input value on OK (or Enter key) and `null` on Cancel (or Escape key)
- Validates input before resolving — if validation fails, the modal stays open
- Closes on Escape by default (`escClose: true`); set `escClose: false` to disable it
- Closes on browser Back by default (`backClose: true`) and resolves `null`
- Supports custom button text, button order swap, and button container styling via `$buttons` CSSProperties
- Built on top of the Modal Plugin — all `ModalOptions` except `beforeClose` are inherited

## Basic Usage

Get the Vlossom instance via `useVlossom()` and call `prompt.open`:

```html
<template>
    <vs-button @click="askName">Ask for Name</vs-button>
</template>

<script setup>
import { useVlossom } from 'vlossom';

const $vs = useVlossom();

async function askName() {
    const name = await $vs.prompt.open('Please enter your name:');
    if (name !== null) {
        console.log('Name entered:', name);
    }
}
</script>
```

### Using a Vue Component with Props

```html
<script setup>
import { useVlossom } from 'vlossom';
import PromptHeader from './PromptHeader.vue';

const $vs = useVlossom();

async function askWithCustomHeader() {
    const value = await $vs.prompt.open(PromptHeader, {
        componentProps: { label: 'Username', hint: 'lowercase only' },
        input: { placeholder: 'username' },
    });
}
</script>
```

### With Input Configuration and Initial Value

```html
<script setup>
import { useVlossom } from 'vlossom';

const $vs = useVlossom();

async function askAge() {
    const age = await $vs.prompt.open('Enter your age:', {
        okText: 'Submit',
        cancelText: 'Skip',
        input: {
            type: 'number',
            placeholder: 'e.g. 25',
            initialValue: 18,
        },
        styleSet: {
            $buttons: { justifyContent: 'end' },
        },
    });
    console.log('Age:', age);
}
</script>
```

## Methods

| Method | Parameters                                                   | Description                                                                                                                                                  |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `open` | `content: string \| Component, options?: PromptModalOptions` | Opens a prompt modal with the given content and options. Returns `Promise<string \| number \| null>` resolving to the input value on OK or `null` on Cancel. |

## Types

```typescript
interface VsPromptStyleSet extends VsModalNodeStyleSet {
    $input?: Omit<VsInputStyleSet, '$append' | '$prepend'>;
    $buttons?: CSSProperties;
    $okButton?: Omit<VsButtonStyleSet, '$loading'>;
    $cancelButton?: Omit<VsButtonStyleSet, '$loading'>;
}

interface PromptModalOptions extends Omit<ModalOptions, 'beforeClose'> {
    styleSet?: VsPromptStyleSet;
    colorScheme?: ColorScheme;
    input?: PropsOf<VsComponent.VsInput> & { initialValue?: VsInputValueType };
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

interface PromptPlugin {
    open(content: string, options?: Omit<PromptModalOptions, 'componentProps'>): Promise<VsInputValueType>;
    open(content: Component, options?: PromptModalOptions): Promise<VsInputValueType>;
}
```

> [!NOTE]
> `VsPromptStyleSet` extends `VsModalNodeStyleSet`. Refer to the [VsModal component docs](../../components/vs-modal/README.md) for available modal style options.
> `PromptModalOptions` extends `ModalOptions` from the [Modal Plugin](../modal-plugin/README.md), except `beforeClose`.
> `input` accepts any props valid for `VsInput` in addition to an `initialValue`.

## Caution

- The prompt plugin depends on the Modal Plugin. Ensure both are registered when setting up the Vlossom plugin.
- If the input fails validation on OK/Enter, the modal remains open and the promise is not yet resolved.
- Pressing Cancel or Escape clears the input and resolves the promise with `null`.
- Clicking outside the modal (if `dimClose` is enabled) or triggering browser Back resolves with `null`.
- Escape closing is enabled by default. Pass `escClose: false` to keep the modal open on Escape.
- Browser Back closing is enabled by default. Pass `backClose: false` to keep browser Back from closing the prompt dialog.
