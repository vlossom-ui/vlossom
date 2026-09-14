> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useFileRules

**Available Version**: 2.1.0+

Returns validation rule functions for file inputs — required, max/min count, and accepted types.

## Feature

- `requiredCheck` — fails when required is true and no files are selected
- `maxCheck` — fails when file count exceeds `max` (skipped when `max` is not provided)
- `minCheck` — fails when file count is below `min` (skipped when `min` is not provided)
- `acceptCheck` — validates each file against the `accept` string (MIME type, wildcard, or extension)

## Basic Usage

```html
<script setup>
import { ref } from 'vue';
import { useFileRules } from '@/composables';

const accept = ref('image/*');
const required = ref(true);

const { requiredCheck, acceptCheck } = useFileRules(accept, required);
</script>
```

## Args

| Arg        | Type                       | Default | Required | Description                                          |
| ---------- | -------------------------- | ------- | -------- | ---------------------------------------------------- |
| `accept`   | `Ref<string>`              | —       | Yes      | Accepted file types (MIME types, wildcards, extensions) |
| `required` | `Ref<boolean>`             | —       | Yes      | Whether at least one file is required                |
| `max`      | `Ref<number \| string>`    | —       | No       | Maximum number of files allowed                      |
| `min`      | `Ref<number \| string>`    | —       | No       | Minimum number of files required                     |

## Return Methods

| Method                   | Parameters   | Description                                                              |
| ------------------------ | ------------ | ------------------------------------------------------------------------ |
| `requiredCheck`          | `File[]`     | Returns an error message when required is true and no files are selected |
| `maxCheck`               | `File[]`     | Returns an error message when file count exceeds `max`                   |
| `minCheck`               | `File[]`     | Returns an error message when file count is below `min`                  |
| `acceptCheck`            | `File[]`     | Returns an error message when any file does not match the accept string  |
