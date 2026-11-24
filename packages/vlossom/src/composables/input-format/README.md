> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useInputFormat

**Available Version**: 2.4.0+

Applies an input format to a text input element. Only characters that fit a fixed format such as a phone number, date, or business registration number are accepted, and separators are inserted automatically.

## Feature

- Works with both native `<input>` and `<textarea>`. The `format` prop of `VsInput` is built on this composable.
- Separates the displayed value from the model value. The screen shows the formatted value, while the model stores either the formatted value or only the characters the user typed.
- Input is handled through the `beforeinput` event. Typing, pasting, deleting, and overwriting a selection all go through one path, and it works with mobile virtual keyboards.

## Basic Usage

```html
<template>
    <input :value="displayValue" v-on="formatListeners" />
</template>

<script setup>
import { ref } from 'vue';
import { useInputFormat } from '@/composables';

const phone = ref(''); // '010-1234-5678'
const format = ref('999-9999-9999');

const { displayValue, formatListeners } = useInputFormat(phone, format);
</script>
```

The ref passed as `value` is the model. Bind `:value="displayValue"` and `v-on="formatListeners"` to the input element instead of `v-model`.

### Format Syntax

| Character | Meaning                                                 |
| --------- | ------------------------------------------------------- |
| `9`       | Digit (`0-9`)                                           |
| `a`       | Letter (`A-Z`, `a-z`)                                   |
| `*`       | Letter or digit                                         |
| `?`       | Everything after this character is optional             |
| Others    | Separator. Inserted automatically and cannot be edited. |

| Example               | Format                   | Completed value      |
| --------------------- | ------------------------ | -------------------- |
| Mobile phone number   | `999-9999-9999`          | `010-1234-5678`      |
| Date                  | `9999-99-99`             | `2026-11-24`         |
| Business registration | `999-99-99999`           | `123-45-67890`       |
| Extension (optional)  | `(999) 999-9999? x99999` | `(555) 123-4567 x89` |
| Serial number         | `a*-999-a999`            | `A1-234-B567`        |

### Advanced Options

```html
<template>
    <input :value="displayValue" v-on="formatListeners" />
    <p v-if="isComplete">Completed: {{ rawValue }}</p>
</template>

<script setup>
import { ref } from 'vue';
import { useInputFormat } from '@/composables';

const birthday = ref(''); // '19900131'
const format = ref('9999/99/99');
const formatOptions = ref({ slotChar: 'yyyy/mm/dd', autoClear: false, raw: true });

const { displayValue, rawValue, isComplete, formatListeners } = useInputFormat(birthday, format, formatOptions);
</script>
```

### Input Behavior

- Characters that do not fit the format token are not accepted.
- Separator positions are skipped automatically.
- Focusing an empty input shows the slot template (`___-____-____`) and moves the caret to the first slot. Blurring without typing anything returns to an empty value.
- Slots that are not filled yet are shown with `slotChar`. The model never contains `slotChar`; it holds only up to the last typed character.

    | Displayed value | Model (`raw: false`) | Model (`raw: true`) |
    | --------------- | -------------------- | ------------------- |
    | `___-____-____` | `''`                 | `''`                |
    | `010-12__-____` | `'010-12'`           | `'01012'`           |
    | `010-1234-5678` | `'010-1234-5678'`    | `'01012345678'`     |

- `Backspace` and `Delete` remove only editable characters and pull the following characters forward. Selecting only separators removes nothing.
- Typing in the middle pushes the following characters back. Characters that no longer fit their new slot are dropped.
- Pasting fills in only the valid characters in order (e.g. `'010 1234 5678'` → `'010-1234-5678'`).
- The optional part after `?` is shown only as far as the user has typed.
- When the input loses focus before the format is complete, the value is cleared if `autoClear` is `true`, and kept up to the typed part if `false`.
- When the model is changed from outside, it is displayed in the format and the model is normalized to the form that matches `raw`. For example, with `raw: false`, setting `'01012345678'` changes it to `'010-1234-5678'`.
- When `format` or `formatOptions` changes, the currently typed characters are re-fitted to the new format.

## Args

| Arg             | Type                               | Default | Required | Description                                                                                                    |
| --------------- | ---------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `value`         | `Ref<string \| null \| undefined>` | —       | Yes      | Model value. The composable writes to this ref as the user types. `null` and `undefined` are treated as empty. |
| `format`        | `Ref<string>`                      | —       | Yes      | Format string. When empty, no format is applied and the input is reflected to the model as is.                 |
| `formatOptions` | `Ref<VsInputFormatOptions>`        | —       | No       | Advanced options. Omitted items use their defaults.                                                            |

### VsInputFormatOptions

| Option      | Type      | Default | Description                                                                                                                      |
| ----------- | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `slotChar`  | `string`  | `'_'`   | Character shown in unfilled slots. A single character is repeated for every slot; a string as long as `format` is used per slot. |
| `autoClear` | `boolean` | `true`  | If `true`, clears the value when the input loses focus while incomplete. If `false`, keeps what was typed.                       |
| `raw`       | `boolean` | `false` | If `true`, the model stores only the characters the user typed, without separators.                                              |

## Types

```typescript
interface VsInputFormatOptions {
    slotChar?: string;
    autoClear?: boolean;
    raw?: boolean;
}

interface VsInputFormatListeners {
    beforeinput: (event: InputEvent) => void;
    input: (event: Event) => void;
    focus: (event: FocusEvent) => void;
    blur: (event: FocusEvent) => void;
}
```

## Return Refs

| RefType           | Type                     | Description                                                                                     |
| ----------------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| `displayValue`    | `ComputedRef<string>`    | Value to show on screen. Bind to the `value` of the input element. May contain slot characters. |
| `formattedValue`  | `ComputedRef<string>`    | Formatted value without slot characters (e.g. `'010-12'`).                                      |
| `rawValue`        | `ComputedRef<string>`    | Only the characters the user typed, without separators (e.g. `'01012'`).                        |
| `isComplete`      | `ComputedRef<boolean>`   | `true` when every required slot before `?` is filled.                                           |
| `formatListeners` | `VsInputFormatListeners` | Event handler object to bind to the input element with `v-on`.                                  |

## Return Methods

None.

## Hooks

None. The event listeners are attached only to the element that `formatListeners` is bound to, so there is nothing to clean up.

## Cautions

- Do not use `v-model` on the input element together with this composable. Manage the model with the ref passed as `value`, and bind `:value="displayValue"` to the input element.
- You may also bind handlers with the same names as `formatListeners` (`@focus`, `@blur`, etc.) directly. Vue calls both handlers.
- `<input>` works only when `type` is `text`, `tel`, `search`, `url`, or `password`. `number` and `email` do not support the caret position API, so a warning is logged and the format is not applied.
- In a `<textarea>`, a line break is not a format token and cannot be typed. Put it in the format as a separator if you need one.
- The model is always a string. It does not become a `number` even if the format accepts digits only.
- IME composition input (e.g. Korean) does not match any format token, so it is removed when the composition ends.
- Do not use a `slotChar` that is the same kind of character as a format token (e.g. `x` for an `a` format). It can be mistaken for typed input when the browser bypasses `beforeinput` (autofill, IME).
- Undo and redo are not supported inside a formatted input.
- `9`, `a`, `*`, and `?` cannot be used as separators.
