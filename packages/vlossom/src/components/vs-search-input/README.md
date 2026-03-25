> 한국어: [README.ko.md](./README.ko.md)

# VsSearchInput

A search input component built on top of `vs-input`. Provides case-sensitive and regex search toggle buttons, with debounced `search` event emission (400ms).

**Available Version**: 2.0.0+

## Basic Usage

### Default Search Input

```html
<template>
    <vs-search-input placeholder="Enter search term" @search="onSearch" />
</template>

<script setup>
function onSearch(value) {
    console.log('Search:', value);
}
</script>
```

### Toggle Buttons

```html
<template>
    <!-- Case-sensitive toggle -->
    <vs-search-input placeholder="Search..." use-case-sensitive @search="onSearch" />

    <!-- Regex toggle -->
    <vs-search-input placeholder="Search..." use-regex @search="onSearch" />

    <!-- Both toggles -->
    <vs-search-input placeholder="Search..." use-case-sensitive use-regex @search="onSearch" />
</template>
```

### Using v-model

```html
<template>
    <vs-search-input
        v-model="searchText"
        v-model:case-sensitive="isCaseSensitive"
        v-model:regex="isRegex"
        use-case-sensitive
        use-regex
        @search="onSearch"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchText = ref('');
const isCaseSensitive = ref(false);
const isRegex = ref(false);

function onSearch(value: string) {
    console.log('Search:', value);
}
</script>
```

### Using the match Method

```html
<template>
    <vs-search-input
        ref="searchInputRef"
        placeholder="Search..."
        use-case-sensitive
        use-regex
        @search="onSearch"
    />
    <div>
        <div v-for="item in filteredItems" :key="item">{{ item }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { VsSearchInputRef } from '@/components/vs-search-input/types';

const searchInputRef = ref<VsSearchInputRef | null>(null);
const items = ['Apple', 'Banana', 'Cherry', 'Date'];
const filteredItems = ref([...items]);

function onSearch(value: string) {
    if (!searchInputRef.value) return;
    filteredItems.value = items.filter((item) => searchInputRef.value!.match(item));
}
</script>
```

## Props

| Prop               | Type                              | Default | Required | Description                           |
| ------------------ | --------------------------------- | ------- | -------- | ------------------------------------- |
| `colorScheme`      | `ColorScheme`                     | -       | -        | Color scheme for the component        |
| `styleSet`         | `string \| VsSearchInputStyleSet` | -       | -        | Custom style configuration object     |
| `useCaseSensitive` | `boolean`                         | `false` | -        | Show the case-sensitive toggle button |
| `useRegex`         | `boolean`                         | `false` | -        | Show the regex toggle button          |
| `disabled`         | `boolean`                         | `false` | -        | Disable the component                 |
| `readonly`         | `boolean`                         | `false` | -        | Set to readonly mode                  |
| `placeholder`      | `string`                          | `''`    | -        | Placeholder text                      |
| `width`            | `string \| number \| Breakpoints` | -       | -        | Component width                       |
| `grid`             | `string \| number \| Breakpoints` | -       | -        | Grid layout size                      |
| `modelValue`       | `string`                          | `''`    | -        | v-model binding (search text)         |
| `caseSensitive`    | `boolean`                         | `false` | -        | v-model:case-sensitive binding        |
| `regex`            | `boolean`                         | `false` | -        | v-model:regex binding                 |

## Types

```typescript
interface VsSearchInputStyleSet {
    variables?: {
        height?: string;
    };
    input?: VsInputStyleSet;
    toggle?: VsToggleStyleSet;
}

interface VsSearchInputRef {
    focus: () => void;
    blur: () => void;
    select: () => void;
    match: (text: string) => boolean;
    clear: () => void;
}
```

> [!NOTE]
>
> - `input` uses [VsInputStyleSet](../vs-input/README.md#types).
> - `toggle` uses [VsToggleStyleSet](../vs-toggle/README.md#types).

## Events

| Event                  | Payload          | Description                                     |
| ---------------------- | ---------------- | ----------------------------------------------- |
| `search`               | `value: string`  | Emitted on input with debounce (400ms)          |
| `update:modelValue`    | `value: string`  | Emitted when the v-model binding updates        |
| `update:caseSensitive` | `value: boolean` | Emitted when the v-model:case-sensitive updates |
| `update:regex`         | `value: boolean` | Emitted when the v-model:regex updates          |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method   | Parameters     | Return    | Description                                     |
| -------- | -------------- | --------- | ----------------------------------------------- |
| `match`  | `text: string` | `boolean` | Check if the given text matches the search term |
| `focus`  | -              | -         | Set focus on the input field                    |
| `blur`   | -              | -         | Remove focus from the input field               |
| `select` | -              | -         | Select all text in the input field              |
| `clear`  | -              | -         | Clear the input value                           |

## Features

- **Based on vs-input**: Inherits all features and styles from vs-input
- **Debounce applied**: Optimizes performance by emitting the `search` event every 400ms
- **v-model support**: Supports v-model binding for `modelValue`, `caseSensitive`, and `regex`
- **Case-sensitive toggle**: Provides a case-sensitive toggle button via the `use-case-sensitive` prop
- **Regex search**: Provides a regex search toggle button via the `use-regex` prop
- **match method**: Provides text matching functionality accessible via ref
- **Type safety**: Ensures type safety via TypeScript
