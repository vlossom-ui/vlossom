> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsSearchInput

A search input component with optional case-sensitive and regex toggle buttons.

**Available Version**: 2.0.0+

## Feature

- Debounced `search` event emission (400ms) to reduce unnecessary triggers
- Optional case-sensitive toggle via `useCaseSensitive`
- Optional regular expression toggle via `useRegex`
- Built-in `match(text)` utility method for filtering lists
- Programmatic control with `focus`, `blur`, `select`, and `clear` methods
- Responsive layout via `width` and `grid` props

## Basic Usage

```html
<template>
    <vs-search-input v-model="query" @search="onSearch" />
</template>

<script setup>
import { ref } from 'vue';
const query = ref('');
function onSearch(value) {
    console.log('search:', value);
}
</script>
```

### With Case Sensitive and Regex Toggles

```html
<template>
    <vs-search-input
        v-model="query"
        v-model:case-sensitive="caseSensitive"
        v-model:regex="regex"
        use-case-sensitive
        use-regex
        @search="onSearch"
    />
</template>
```

### Using match() for Filtering

```html
<template>
    <vs-search-input ref="searchRef" v-model="query" />
    <ul>
        <li v-for="item in filteredItems" :key="item">{{ item }}</li>
    </ul>
</template>

<script setup>
import { ref, computed } from 'vue';
const searchRef = ref(null);
const query = ref('');
const items = ['Apple', 'Banana', 'Cherry'];
const filteredItems = computed(() => items.filter(item => searchRef.value?.match(item) ?? true));
</script>
```

## Props

| Prop               | Type                            | Default | Required | Description                                          |
| ------------------ | ------------------------------- | ------- | -------- | ---------------------------------------------------- |
| `colorScheme`      | `string`                        | -       | -        | Color scheme for the component                       |
| `styleSet`         | `string \| VsSearchInputStyleSet` | -     | -        | Custom style set for the component                   |
| `width`            | `string \| number \| Breakpoints` | -     | -        | Responsive width                                     |
| `grid`             | `string \| number \| Breakpoints` | -     | -        | Grid column span                                     |
| `disabled`         | `boolean`                       | `false` | -        | Disables the input                                   |
| `placeholder`      | `string`                        | `''`    | -        | Placeholder text                                     |
| `readonly`         | `boolean`                       | `false` | -        | Makes the input read-only                            |
| `useCaseSensitive` | `boolean`                       | `false` | -        | Shows the case-sensitive toggle button               |
| `useRegex`         | `boolean`                       | `false` | -        | Shows the regex toggle button                        |
| `modelValue`       | `string`                        | `''`    | -        | Search text value (v-model)                          |
| `caseSensitive`    | `boolean`                       | `false` | -        | Case-sensitive state (v-model:caseSensitive)         |
| `regex`            | `boolean`                       | `false` | -        | Regex mode state (v-model:regex)                     |

## Types

```typescript
interface VsSearchInputStyleSet {
    variables?: {
        height?: string;
    };
    input?: VsInputStyleSet;
    toggle?: VsToggleStyleSet;
}
```

> [!NOTE]
> `input` uses [VsInputStyleSet](../vs-input/README.md#types) and `toggle` uses [VsToggleStyleSet](../vs-toggle/README.md#types).

### StyleSet Example

```html
<template>
    <vs-search-input
        v-model="query"
        :style-set="{
            variables: { height: '2.5rem' },
            input: { component: { borderRadius: '1rem' } },
        }"
    />
</template>
```

## Events

| Event                  | Payload   | Description                                         |
| ---------------------- | --------- | --------------------------------------------------- |
| `search`               | `string`  | Emitted (debounced) when the search text changes    |
| `update:modelValue`    | `string`  | Emitted when the search text changes                |
| `update:caseSensitive` | `boolean` | Emitted when the case-sensitive toggle changes      |
| `update:regex`         | `boolean` | Emitted when the regex toggle changes               |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method    | Parameters       | Description                                               |
| --------- | ---------------- | --------------------------------------------------------- |
| `match`   | `text: string`   | Returns `true` if the text matches the current search query |
| `select`  | -                | Selects all text in the input                             |
| `focus`   | -                | Focuses the input                                         |
| `blur`    | -                | Blurs the input                                           |
| `clear`   | -                | Clears the search text                                    |
