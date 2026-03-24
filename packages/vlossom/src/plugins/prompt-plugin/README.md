> 한국어: [README.ko.md](./README.ko.md)

# Prompt Plugin

A plugin that shows a modal-based input dialog and returns the user-entered value as a `Promise`. Uses `modal-plugin` and `VsInput` internally to handle validation in a single step.

## Usage

The Prompt plugin is accessed via the `useVlossom()` hook.

```ts
import { useVlossom } from '@/framework';

const $vs = useVlossom();
const value = await $vs.prompt.open('Please enter your name.');
```

## API

### open(content, options?)

Displays an input dialog and returns the submitted value.

**Parameters**

- `content`: `string | Component` — Content to display in the dialog body
- `options`: `PromptModalOptions` — Options to control the input field, buttons, and styles (optional)

**Returns**

- `Promise<VsInputValueType | null>` — The input value when OK is clicked; `null` when cancelled or dismissed.

**Example**

```ts
const result = await $vs.prompt.open('Please enter a team name.', {
    inputPlaceholder: 'e.g. Vlossom',
    inputLabel: 'Team Name',
    inputRules: [(value) => (value ? '' : 'Team name is required.')],
    buttonOkText: 'Save',
    buttonCancelText: 'Later',
    colorScheme: 'indigo',
});

if (result !== null) {
    // Use the input value
}
```

## Types

```ts
interface PromptModalOptions extends ModalOptions {
    styleSet?: VsPromptStyleSet;
    colorScheme?: ColorScheme;

    inputType?: VsInputType;
    inputPlaceholder?: string;
    inputRules?: Rule<VsInputValueType>[];
    inputInitialValue?: VsInputValueType;
    inputLabel?: string;
    inputMessages?: Message<VsInputValueType>[];

    buttonOkText?: string;
    buttonCancelText?: string;
    swapButtons?: boolean;
}
```

## Example

```vue
<template>
    <vs-button @click="handlePrompt">Create Project</vs-button>
</template>

<script setup lang="ts">
import { useVlossom } from '@/framework';

const $vs = useVlossom();

async function handlePrompt() {
    const projectName = await $vs.prompt.open('Please enter a project name.', {
        inputPlaceholder: 'Project name',
        inputLabel: 'Project Name',
        inputRules: [
            (value) => (value ? '' : 'Project name is required.'),
            (value) => {
                if (typeof value === 'string' && value.trim().length >= 2) {
                    return '';
                }
                return 'Please enter at least 2 characters.';
            },
        ],
        buttonOkText: 'Create',
        buttonCancelText: 'Cancel',
    });

    if (projectName) {
        console.log('Project to create:', projectName);
    }
}
</script>
```
