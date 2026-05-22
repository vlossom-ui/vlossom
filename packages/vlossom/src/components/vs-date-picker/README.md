# VsDatePicker

A native-first date picker component with form validation and format-validated string `modelValue`.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Four input types: `date`, `datetime-local`, `time`, `month` — backed by native `<input type>`.
- `modelValue` is always a format-validated string. The format is derived from `type`.
- Form validation with `required`, `min`/`max` (string), `canSelectDate`, and format-mismatch detection.
- Built-in clear button and calendar icon button; `showPicker()` feature detection on `open()`.
- When `type` changes, `modelValue` is auto-padded/trimmed to the new format where possible; otherwise cleared.

## Basic Usage

```html
<template>
    <vs-date-picker v-model="date" label="Date" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref('');
</script>
```

### Input Types

```html
<template>
    <vs-date-picker v-model="date" type="date" label="Date" />
    <vs-date-picker v-model="datetime" type="datetime-local" label="Datetime" />
    <vs-date-picker v-model="time" type="time" label="Time" />
    <vs-date-picker v-model="month" type="month" label="Month" />
</template>
```

### Min / Max + CanSelectDate

```html
<template>
    <vs-date-picker
        v-model="date"
        type="date"
        min="2026-01-01"
        max="2026-12-31"
        :can-select-date="canSelectDate"
    />
</template>

<script setup>
const holidays = ['2026-05-05'];
const canSelectDate = (value) => !holidays.includes(value);
</script>
```

## Data Model

- **`modelValue` is always a string** matching the format derived from `type`:
  - `type='date'` → `'YYYY-MM-DD'` (e.g. `'2026-05-18'`)
  - `type='datetime-local'` → `'YYYY-MM-DDTHH:mm'` (e.g. `'2026-05-18T15:30'`)
  - `type='time'` → `'HH:mm'` (e.g. `'15:30'`)
  - `type='month'` → `'YYYY-MM'` (e.g. `'2026-05'`)
- The default value is `''`.
- Time-zone interpretation is intentionally delegated to the consumer. Use dayjs / Temporal / a custom adapter when you need to convert to/from an instant.

## Format Validation

- When the user types or programmatically sets `modelValue`, the string is checked against the regex for the current `type`.
- A mismatched format emits `invalid` (`{ input }`) and the displayed input is blanked out; `modelValue` itself is **not** auto-rewritten.
- `canSelectDate` is also checked before committing user input; rejection emits `invalid` and the value is not committed.

## Type Switching

When the consumer changes the `type` prop while `modelValue` is non-empty, the value is auto-converted where possible:

| from → to | result |
| --- | --- |
| `date` → `datetime-local` | `${v}T00:00` |
| `date` → `month` | `v.slice(0, 7)` |
| `datetime-local` → `date` | `v.slice(0, 10)` |
| `datetime-local` → `time` | `v.slice(11, 16)` |
| `datetime-local` → `month` | `v.slice(0, 7)` |
| `month` → `date` | `${v}-01` |
| `month` → `datetime-local` | `${v}-01T00:00` |
| `time` → anything else | `''` (no date info) |
| `date` → `time` | `''` (no time info) |
| `month` → `time` | `''` (no time info) |

## Limitations

- **`format` prop is not supported.** Native pickers respect the browser/OS locale; the library cannot override this. Use a custom rendering layer if you need a specific visual format.
- **`open()` (showPicker)** requires a user gesture in some browsers. Calling it programmatically (outside an event handler) may silently fall back to `focus()`.
- **Validation constraints are rule-based.** `min`, `max`, and `canSelectDate` validate the selected value but are not forwarded to the native picker UI.

### Picker Trigger

The native calendar opens when:
- the input area is clicked, or
- the trailing calendar icon button is pressed, or
- `dpRef.value.open()` is invoked inside a user-gesture handler.

When `disabled` or `readonly` is set, all three triggers are no-ops.

## Custom Rules

```html
<template>
    <vs-date-picker
        v-model="date"
        type="date"
        required
        :rules="[v => (!!v && new Date(v).getUTCDay() !== 0) || 'Sunday is not allowed']"
    />
</template>
```

Default rules can be turned off via `noDefaultRules`.

## Props

| Prop                | Type                                                                  | Default                       | Required | Description                                                                                  |
| ------------------- | --------------------------------------------------------------------- | ----------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `colorScheme`       | `string`                                                              | -                             | -        | Color scheme.                                                                                |
| `styleSet`          | `string \| VsDatePickerStyleSet`                                      | -                             | -        | Custom style set.                                                                            |
| `modelValue`        | `string`                                                              | `''`                          | -        | v-model — format-validated string.                                                           |
| `type`              | `'date' \| 'datetime-local' \| 'time' \| 'month'`                     | `'date'`                      | -        | Native input type; also determines the `modelValue` format.                                  |
| `min`               | `string \| undefined`                                                 | `undefined`                   | -        | Earliest valid value (rule-based, string comparison — e.g., `'2026-05-18' < '2026-12-31'`).  |
| `max`               | `string \| undefined`                                                 | `undefined`                   | -        | Latest valid value (rule-based, string comparison — e.g., `'2026-05-18' < '2026-12-31'`).    |
| `canSelectDate`     | `(value: string) => boolean \| undefined`                             | `undefined`                   | -        | Callback that returns `true` for selectable values and `false` for values to reject; emits `invalid` when rejected. |
| `noClear`           | `boolean`                                                             | `false`                       | -        | Hides the clear button.                                                                      |
| `label`             | `string`                                                              | `''`                          | -        | Label text.                                                                                  |
| `placeholder`       | `string`                                                              | `''`                          | -        | Placeholder.                                                                                 |
| `disabled`          | `boolean`                                                             | `false`                       | -        | Disables the component.                                                                      |
| `readonly`          | `boolean`                                                             | `false`                       | -        | Makes the component read-only.                                                               |
| `required`          | `boolean`                                                             | `false`                       | -        | Adds `required` rule.                                                                        |
| `noLabel`           | `boolean`                                                             | `false`                       | -        | Hide label slot.                                                                             |
| `noMessages`        | `boolean`                                                             | `false`                       | -        | Hide messages slot.                                                                          |
| `hidden`            | `boolean`                                                             | `false`                       | -        | Hide the whole component.                                                                    |
| `id`                | `string`                                                              | `''`                          | -        | `id` attribute for the input.                                                                |
| `name`              | `string`                                                              | `''`                          | -        | `name` attribute for the input.                                                              |
| `messages`          | `Message[]`                                                           | `[]`                          | -        | External messages.                                                                           |
| `rules`             | `Rule[]`                                                              | `[]`                          | -        | Custom validation rules.                                                                     |
| `noDefaultRules`    | `boolean`                                                             | `false`                       | -        | Disable built-in rules (required, min, max, notDisabled).                                    |
| `state`             | `UIState`                                                             | `'idle'`                      | -        | External validation state.                                                                   |
| `width`             | `string \| number \| Breakpoints`                                     | -                             | -        | Width.                                                                                       |
| `grid`              | `string \| number \| Breakpoints`                                     | -                             | -        | Grid column span.                                                                            |
| `changed`           | `boolean`                                                             | `false`                       | -        | v-model — changed flag.                                                                      |
| `valid`             | `boolean`                                                             | `false`                       | -        | v-model — valid flag.                                                                        |

## Types

```typescript
import type { CSSProperties } from 'vue';
import type { VsInputStyleSet } from 'vlossom';
import type { VsInputWrapperStyleSet } from 'vlossom';

type VsDatePickerType = 'date' | 'datetime-local' | 'time' | 'month';

type VsDatePickerFormat = 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm' | 'HH:mm' | 'YYYY-MM';

type VsDatePickerValueType = string;

interface VsDatePickerStyleSet extends CSSProperties {
    $wrapper?: VsInputWrapperStyleSet;
    $input?: VsInputStyleSet;
}
```

## Events

| Event               | Payload              | Description                                                              |
| ------------------- | -------------------- | ------------------------------------------------------------------------ |
| `update:modelValue` | `string`             | Emitted when modelValue changes.                                         |
| `update:changed`    | `boolean`            | Emitted when the changed flag updates.                                   |
| `update:valid`      | `boolean`            | Emitted when the valid flag updates.                                     |
| `change`            | `string`             | Emitted after the value is committed.                                    |
| `focus`             | `FocusEvent`         | Emitted when the input receives focus.                                   |
| `blur`              | `FocusEvent`         | Emitted when the input loses focus.                                      |
| `clear`             | -                    | Emitted when the clear button is pressed.                                |
| `invalid`           | `{ input: string }`  | Emitted on format mismatch or when `canSelectDate` rejects the value.    |

## Slots

| Slot                 | Description                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| `label`              | Custom label content replacing the default label.                                 |
| `prepend`            | Content displayed to the left inside the date input box.                          |
| `append`             | Content displayed to the right inside the date input box.                         |
| `messages`           | Custom messages content below the input.                                          |

## Methods

| Method            | Parameters | Description                                                                  |
| ----------------- | ---------- | ---------------------------------------------------------------------------- |
| `focus`           | -          | Focuses the date input element.                                              |
| `blur`            | -          | Blurs the date input element.                                                |
| `validate`        | -          | Triggers validation and returns the result.                                  |
| `clear`           | -          | Clears the value (modelValue → `''`).                                        |
| `open`            | -          | Opens the native picker via `showPicker()` (falls back to `focus()`).        |
