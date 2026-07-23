# VsDatePicker

A native-first date picker component with form validation and format-validated string `modelValue`.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Four input types: `date`, `datetime-local`, `time`, `month` — backed by native `<input type>`.
- `modelValue` is always a format-validated string. The format is derived from `type`.
- Form validation with `required`, `min`/`max` (string), and format-mismatch detection.
- Built-in clear button and a calendar/clock icon; the native picker opens on click, Enter/Space, or the `open()` method (`showPicker()`).

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

### Min / Max

```html
<template>
    <vs-date-picker
        v-model="date"
        type="date"
        min="2026-01-01"
        max="2026-12-31"
    />
</template>
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

## Type Switching

`VsDatePicker` does not convert `modelValue` automatically when `type` changes at runtime.

If the current `modelValue` does not match the new `type` format, the displayed input is blanked out and the original `modelValue` is preserved. When changing `type` dynamically, update `modelValue` to match the new type format in the same consumer flow.

```html
<vs-date-picker v-model="value" :type="type" />
```

```typescript
type = 'month';
value = '2026-05';
```

## Limitations

- **`format` prop is not supported.** Native pickers respect the browser/OS locale; the library cannot override this. Use a custom rendering layer if you need a specific visual format.
- **`open()` (`showPicker()`)** requires a user gesture in most browsers. Calling it outside a user-gesture handler may be ignored by the browser.
- **Validation constraints are rule-based.** `min` and `max` validate the selected value but are not forwarded to the native picker UI.

### Picker Trigger

The native calendar opens when:

- the input area (including the calendar icon) is clicked, or
- the **Enter** or **Space** key is pressed while the field is focused (whether reached by click or by Tab), or
- `dpRef.value.open()` is invoked inside a user-gesture handler.

The picker closes when a value is selected or the field loses focus. When `disabled` or `readonly` is set, all triggers are no-ops.

> **Placeholder note**: native `date`/`time` inputs ignore the `placeholder` attribute. While the field is empty and the picker is closed it is rendered as a `text` input so the `placeholder` is visible, then switched to the native picker type when the picker opens. Because of this, `focusPlaceholder` (shown while the picker is open) has no visible effect on `date`/`time` types — the native picker UI is shown instead.

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

| Prop             | Type                                              | Default     | Required | Description                                                                                                         |
| ---------------- | ------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `colorScheme`    | `string`                                          | -           | -        | Color scheme.                                                                                                       |
| `styleSet`       | `string \| VsDatePickerStyleSet`                  | -           | -        | Custom style set.                                                                                                   |
| `modelValue`     | `string`                                          | `''`        | -        | v-model — format-validated string.                                                                                  |
| `type`           | `'date' \| 'datetime-local' \| 'time' \| 'month'` | `'date'`    | -        | Native input type; also determines the `modelValue` format.                                                         |
| `min`            | `string \| undefined`                             | `undefined` | -        | Earliest valid value (rule-based, string comparison — e.g., `'2026-05-18' < '2026-12-31'`).                         |
| `max`            | `string \| undefined`                             | `undefined` | -        | Latest valid value (rule-based, string comparison — e.g., `'2026-05-18' < '2026-12-31'`).                           |
| `noClear`        | `boolean`                                         | `false`     | -        | Hides the clear button.                                                                                             |
| `size`           | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`            | `'md'`      | -        | Input height, padding, font, and icon size.                                                                         |
| `label`          | `string`                                          | `''`        | -        | Label text.                                                                                                         |
| `placeholder`    | `string`                                          | `''`        | -        | Placeholder.                                                                                                        |
| `focusPlaceholder` | `string`                                        | `''`        | -        | Placeholder shown while the picker is open; falls back to `placeholder` otherwise. See the Placeholder note above.  |
| `disabled`       | `boolean`                                         | `false`     | -        | Disables the component.                                                                                             |
| `readonly`       | `boolean`                                         | `false`     | -        | Makes the component read-only.                                                                                      |
| `required`       | `boolean`                                         | `false`     | -        | Adds `required` rule.                                                                                               |
| `noLabel`        | `boolean`                                         | `false`     | -        | Hide label slot.                                                                                                    |
| `noMessages`     | `boolean`                                         | `false`     | -        | Hide messages slot.                                                                                                 |
| `hidden`         | `boolean`                                         | `false`     | -        | Hide the whole component.                                                                                           |
| `id`             | `string`                                          | `''`        | -        | `id` attribute for the input.                                                                                       |
| `name`           | `string`                                          | `''`        | -        | `name` attribute for the input.                                                                                     |
| `messages`       | `Message[]`                                       | `[]`        | -        | External messages.                                                                                                  |
| `rules`          | `Rule[]`                                          | `[]`        | -        | Custom validation rules.                                                                                            |
| `noDefaultRules` | `boolean`                                         | `false`     | -        | Disable built-in rules (required, min, max).                                                                        |
| `state`          | `UIState`                                         | `'idle'`    | -        | External validation state.                                                                                          |
| `width`          | `string \| number \| Breakpoints`                 | -           | -        | Width.                                                                                                              |
| `grid`           | `string \| number \| Breakpoints`                 | -           | -        | Grid column span.                                                                                                   |
| `changed`        | `boolean`                                         | `false`     | -        | v-model — changed flag.                                                                                             |
| `valid`          | `boolean`                                         | `false`     | -        | v-model — valid flag.                                                                                               |

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

| Event               | Payload             | Description                                                           |
| ------------------- | ------------------- | --------------------------------------------------------------------- |
| `update:modelValue` | `string`            | Emitted when modelValue changes.                                      |
| `update:changed`    | `boolean`           | Emitted when the changed flag updates.                                |
| `update:valid`      | `boolean`           | Emitted when the valid flag updates.                                  |
| `change`            | `string`            | Emitted after the value is committed.                                 |
| `focus`             | `FocusEvent`        | Emitted when the input receives focus.                                |
| `blur`              | `FocusEvent`        | Emitted when the input loses focus.                                   |
| `clear`             | `string`            | Emitted with the previous value when the value is cleared.             |
| `invalid`           | `{ input: string }` | Emitted on format mismatch.                                           |

## Slots

| Slot       | Description                                               |
| ---------- | --------------------------------------------------------- |
| `label`    | Custom label content replacing the default label.         |
| `prepend`  | Content displayed to the left inside the date input box.  |
| `append`   | Content displayed to the right inside the date input box. |
| `messages` | Custom messages content below the input.                  |

## Methods

| Method     | Parameters | Description                                                           |
| ---------- | ---------- | --------------------------------------------------------------------- |
| `focus`    | -          | Focuses the date input element.                                       |
| `blur`     | -          | Blurs the date input element.                                         |
| `validate` | -          | Triggers validation and returns the result.                           |
| `clear`    | -          | Clears the value (modelValue → `''`).                                 |
| `reset`    | -          | Resets the value to its initial value.                                |
| `open`     | -          | Opens the native picker via `showPicker()`. Call from within a user-gesture handler. |
