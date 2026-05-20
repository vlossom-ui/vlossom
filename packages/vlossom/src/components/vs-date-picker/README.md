# VsDatePicker

A native-first date picker component with timezone select integration, form validation, and UTC-based modelValue.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Four input types: `date`, `datetime-local`, `time`, `month` — backed by native `<input type>`.
- Optional timezone select (`<vs-select>`) integrated inline; displayed date/time is preserved on timezone change.
- `modelValue` is always a UTC `Date` instant — safe to `.toISOString()` for server transport.
- Form validation with `required`, `min`/`max` (`Date`), `canSelectDate`, and parse-failure detection.
- Built-in clear button and calendar icon button; `showPicker()` feature detection on `open()`.

## Basic Usage

```html
<template>
    <vs-date-picker v-model="date" label="Date" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(null);
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

### With Timezone Select

```html
<template>
    <vs-date-picker
        v-model="datetime"
        type="datetime-local"
        timezone
        @timezone-change="onTimezoneChange"
    />
</template>

<script setup>
import { ref } from 'vue';
const datetime = ref(null);
function onTimezoneChange({ from, to }) {
    console.log(`tz changed: ${from} → ${to}`);
}
</script>
```

### Custom Timezone Options

```html
<template>
    <vs-date-picker
        v-model="datetime"
        type="datetime-local"
        timezone
        :timezone-options="[
            { value: 'Asia/Seoul', label: 'Seoul (UTC+09:00)' },
            { value: 'Asia/Tokyo', label: 'Tokyo (UTC+09:00)' },
            { value: 'America/New_York', label: 'New York' },
        ]"
    />
</template>
```

### Min / Max + CanSelectDate

```html
<template>
    <vs-date-picker
        v-model="date"
        type="date"
        :min="minDate"
        :max="maxDate"
        :can-select-date="canSelectDate"
    />
</template>

<script setup>
import { ref } from 'vue';
const minDate = new Date('2026-01-01T00:00:00Z');
const maxDate = new Date('2026-12-31T00:00:00Z');
const holidays = [new Date('2026-05-05T00:00:00Z')];
const canSelectDate = (date) => !holidays.some((holiday) => holiday.toISOString().slice(0, 10) === date.toISOString().slice(0, 10));
</script>
```

## Data Model

- **`modelValue` is always a UTC `Date` instant** (`Date | null`).
- When `timezone={false}` (default), all input is interpreted as UTC date/time — the rendered input shows the UTC time literally.
- When `timezone={true}`, the input shows date/time in the currently selected timezone. The modelValue stays in UTC.
- Server payload: `date.toISOString()` always produces a consistent UTC ISO 8601 string.

## Timezone

| Behavior | Detail |
| --- | --- |
| Default | `timezone={false}` — no select UI, internal tz fixed to `'Etc/UTC'`. |
| Initial value | When enabled, `currentTimezone === timezoneOptions[0].value`. |
| On change | Displayed date/time is **preserved**; UTC is **recalculated**. (Use case: "Move this 3 PM meeting from Seoul to NY.") |
| Invalid tz | Emits `invalid` (reason: `'timezone'`); `currentTimezone` stays put. |
| Read current tz | `dpRef.value.currentTimezone` (string). |

Default options: 12 IANA zones (`Etc/UTC`, Los Angeles, New York, London, Paris, Dubai, Kolkata, Shanghai, Tokyo, Seoul, Sydney, Auckland).

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
        :rules="[v => !!v && v.getUTCDay() !== 0 || 'Sunday is not allowed']"
    />
</template>
```

Default rules can be turned off via `noDefaultRules`. To replace the built-in `invalidValueCheck` message, override with your own rule.

## Props

| Prop                | Type                                                                  | Default                       | Required | Description                                                                                  |
| ------------------- | --------------------------------------------------------------------- | ----------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `colorScheme`       | `string`                                                              | -                             | -        | Color scheme.                                                                                |
| `styleSet`          | `string \| VsDatePickerStyleSet`                                      | -                             | -        | Custom style set.                                                                            |
| `modelValue`        | `Date \| null`                                                        | `null`                        | -        | v-model — UTC instant.                                                                       |
| `type`              | `'date' \| 'datetime-local' \| 'time' \| 'month'`                     | `'date'`                      | -        | Native input type.                                                                           |
| `min`               | `Date \| undefined`                                                   | `undefined`                   | -        | Earliest valid instant (rule-based).                                                         |
| `max`               | `Date \| undefined`                                                   | `undefined`                   | -        | Latest valid instant (rule-based).                                                           |
| `canSelectDate`     | `(date: Date) => boolean \| undefined`                                | `undefined`                   | -        | Callback that returns `true` for selectable dates and `false` for dates to reject; emits `invalid` when rejected. |
| `noClear`           | `boolean`                                                             | `false`                       | -        | Hides the clear button.                                                                      |
| `timezone`          | `boolean`                                                             | `false`                       | -        | Render an inline timezone select.                                                            |
| `timezoneOptions`   | `TimezoneOption[]`                                                    | `DEFAULT_TIMEZONE_OPTIONS`    | -        | Options for the timezone select. The first entry is the initial value.                       |
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
| `noDefaultRules`    | `boolean`                                                             | `false`                       | -        | Disable built-in rules (required, min, max, notDisabled, invalidValue).                      |
| `state`             | `UIState`                                                             | `'idle'`                      | -        | External validation state.                                                                   |
| `width`             | `string \| number \| Breakpoints`                                     | -                             | -        | Width.                                                                                       |
| `grid`              | `string \| number \| Breakpoints`                                     | -                             | -        | Grid column span.                                                                            |
| `changed`           | `boolean`                                                             | `false`                       | -        | v-model — changed flag.                                                                      |
| `valid`             | `boolean`                                                             | `false`                       | -        | v-model — valid flag.                                                                        |

## Types

```typescript
import type { CSSProperties } from 'vue';
import type { VsInputWrapperStyleSet } from 'vlossom';
import type { VsSelectStyleSet } from 'vlossom';

type VsDatePickerType = 'date' | 'datetime-local' | 'time' | 'month';

type VsDatePickerValueType = Date | null;

interface TimezoneOption {
    value: string;          // IANA tz identifier (e.g. 'Asia/Seoul')
    label: string;          // Display label
    group?: string;         // Optional grouping for the select
    disabled?: boolean;     // Disable this option in the select
}

interface VsDatePickerStyleSet extends CSSProperties {
    $wrapper?: VsInputWrapperStyleSet;
    $input?: CSSProperties;
    $prepend?: CSSProperties;
    $append?: CSSProperties;
    $clearButton?: CSSProperties;
    $iconButton?: CSSProperties;
    $timezoneSelect?: VsSelectStyleSet;
    $datePicker?: CSSProperties;
    $row?: CSSProperties;
}
```

`DEFAULT_TIMEZONE_OPTIONS` is exported for convenience and contains 12 IANA timezones.

## Events

| Event               | Payload                                  | Description                                                              |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------ |
| `update:modelValue` | `Date \| null`                           | Emitted when modelValue changes.                                         |
| `update:changed`    | `boolean`                                | Emitted when the changed flag updates.                                   |
| `update:valid`      | `boolean`                                | Emitted when the valid flag updates.                                     |
| `change`            | `Date \| null`                           | Emitted after the value is committed.                                    |
| `focus`             | `FocusEvent`                             | Emitted when the input receives focus.                                   |
| `blur`              | `FocusEvent`                             | Emitted when the input loses focus.                                      |
| `clear`             | -                                        | Emitted when the clear button is pressed.                                |
| `invalid`           | `{ reason: 'parse' \| 'disabled' \| 'timezone'; input: string }` | Emitted on parse failure, disabled date selection, or invalid timezone. |
| `timezone-change`   | `{ from: string; to: string }`           | Emitted when the timezone select value changes (valid only).             |

## Slots

| Slot                 | Description                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| `label`              | Custom label content replacing the default label.                                 |
| `prepend`            | Content displayed to the left inside the date input box.                          |
| `append`             | Content displayed to the right inside the date input box.                         |
| `messages`           | Custom messages content below the input.                                          |
| `timezone-option`    | Custom rendering for a single option inside the timezone `<vs-select>`.           |

## Methods

| Method            | Parameters | Description                                                                  |
| ----------------- | ---------- | ---------------------------------------------------------------------------- |
| `focus`           | -          | Focuses the date input element.                                              |
| `blur`            | -          | Blurs the date input element.                                                |
| `validate`        | -          | Triggers validation and returns the result.                                  |
| `clear`           | -          | Clears the value (modelValue → null). Timezone is preserved.                 |
| `open`            | -          | Opens the native picker via `showPicker()` (falls back to `focus()`).        |
| `currentTimezone` | -          | (Property) Read-only string of the currently selected IANA timezone.         |
