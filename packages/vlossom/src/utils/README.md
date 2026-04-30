> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# Vlossom Utils

A collection of utility modules used internally by Vlossom and available for use in application code. Each utility is exported from the `vlossom` package.

**Available Version**: 2.0.0+

## Basic Usage

```typescript
import { arrayUtil, clipboardUtil, compareUtil, deviceUtil, domUtil, functionUtil, logUtil, objectUtil, propsUtil, stringUtil } from 'vlossom';
```

Or import individual utilities:

```typescript
import { stringUtil } from 'vlossom';

const id = stringUtil.createID();
const size = stringUtil.toStringSize(100); // '100px'
```

## Methods

### arrayUtil

| Category  | Method   | Parameters                       | Description                                                                                  |
| --------- | -------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| arrayUtil | `uniqBy` | `array: T[], field: keyof T`     | Returns a new array with duplicate items removed based on the value of the specified field.  |

### clipboardUtil

| Category      | Method  | Parameters          | Description                                                                                        |
| ------------- | ------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| clipboardUtil | `copy`  | `text: string`      | Copies `text` to the system clipboard. Returns `Promise<boolean>` — `true` on success, `false` on failure or if the Clipboard API is unsupported. |

### compareUtil

| Category    | Method          | Parameters                        | Description                                                                                                                          |
| ----------- | --------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| compareUtil | `compareValues` | `aValue: unknown, bValue: unknown` | Compares two values and returns a number: negative if `a < b`, positive if `a > b`, `0` if equal. Handles `null`, `string`, `number`, `Date`, `boolean`, and `object` types. |

### deviceUtil

| Category   | Method          | Parameters | Description                                                                                    |
| ---------- | --------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| deviceUtil | `isTouchDevice` | —          | Returns `true` if the current device supports touch input (checks `ontouchstart`, `maxTouchPoints`, and pointer media query). |

### domUtil

| Category | Method          | Parameters                  | Description                                                                                    |
| -------- | --------------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| domUtil  | `isBrowser`     | —                           | Returns `true` if the code is running in a browser environment (`window` is defined).          |
| domUtil  | `getClientRect` | `element: HTMLElement`      | Returns the `DOMRect` of the element via `getBoundingClientRect()`.                            |
| domUtil  | `isScrollableX` | `element: HTMLElement`      | Returns `true` if the element can scroll horizontally (based on `overflow-x` and content width). |
| domUtil  | `isScrollableY` | `element: HTMLElement`      | Returns `true` if the element can scroll vertically (based on `overflow-y` and content height). |

### functionUtil

| Category     | Method       | Parameters                                                                        | Description                                                                                                                   |
| ------------ | ------------ | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| functionUtil | `throttle`   | *(from radash)* `fn, interval`                                                    | Returns a throttled version of the function that executes at most once per `interval` milliseconds.                           |
| functionUtil | `debounce`   | *(from radash)* `fn, delay`                                                       | Returns a debounced version of the function that delays execution until `delay` milliseconds after the last invocation.       |
| functionUtil | `toCallable` | `maybeFn: undefined \| TResult \| ((...args: TArgs) => TResult)`   | Normalizes a value or function into a callable function. If `undefined`, returns a function that returns `undefined`. If a plain value, wraps it in a function. |

### logUtil

| Category | Method        | Parameters                                              | Description                                                                     |
| -------- | ------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| logUtil  | `error`       | `target: string, message: string`                       | Logs an error message prefixed with `[Vlossom] {target}:`.                      |
| logUtil  | `warning`     | `target: string, message: string`                       | Logs a warning message prefixed with `[Vlossom] {target}:`.                     |
| logUtil  | `propError`   | `componentName: string, property: string, message: string` | Logs an error for a component property using `error`.                           |
| logUtil  | `propWarning` | `componentName: string, property: string, message: string` | Logs a warning for a component property using `warning`.                        |

### objectUtil

| Category   | Method     | Parameters                           | Description                                                                                                |
| ---------- | ---------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| objectUtil | `assign`   | *(from radash)*                      | Deep assigns properties from source objects to a target object.                                            |
| objectUtil | `crush`    | *(from radash)*                      | Flattens a nested object into a single-level object with dot-notation keys.                                |
| objectUtil | `get`      | *(from radash)*                      | Safely retrieves a nested value from an object by dot-notation path.                                       |
| objectUtil | `isEmpty`  | *(from radash)*                      | Returns `true` if the value is an empty object, array, string, `null`, or `undefined`.                    |
| objectUtil | `isEqual`  | *(from radash)*                      | Performs a deep equality comparison between two values.                                                    |
| objectUtil | `isObject` | *(from radash)*                      | Returns `true` if the value is a plain object (not an array or null).                                      |
| objectUtil | `omit`     | *(from radash)*                      | Returns a copy of the object with the specified keys removed.                                              |
| objectUtil | `shake`    | *(from radash)*                      | Returns a copy of the object with all falsy values (or values matching a predicate) removed.               |

### propsUtil

| Category  | Method              | Parameters                                                  | Description                                                                                                   |
| --------- | ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| propsUtil | `checkValidNumber`  | `componentName: string, property: string, value: number \| string` | Validates that the value is a safe JavaScript number. Logs a prop error via `logUtil` and returns `false` if invalid. |

### stringUtil

| Category   | Method              | Parameters                   | Description                                                                                                        |
| ---------- | ------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| stringUtil | `createID`          | `size?: number` (default 10) | Generates a random alphabetic string ID of the given length. IDs never start with a digit.                        |
| stringUtil | `convertToString`   | `value: any`                 | Converts any value to a string. Objects are serialized with `JSON.stringify`; other types use `String()`.          |
| stringUtil | `toStringSize`      | `value: number \| string`    | Converts a bare number to a pixel string (e.g. `100` → `'100px'`). Strings with existing units are returned as-is. |
| stringUtil | `toFileSizeFormat`  | `bytes: number`              | Formats a byte count into a human-readable string (e.g. `1024` → `'1 KB'`).                                       |
| stringUtil | `hash`              | `str: string`                | Computes a short deterministic hash string prefixed with `vs-` (base-36 encoded).                                  |
| stringUtil | `kebabCase`         | *(from change-case)*         | Converts a string to kebab-case (e.g. `'fooBar'` → `'foo-bar'`).                                                  |

## Caution

- `clipboardUtil.copy` requires a secure context (HTTPS or localhost). It returns `false` and logs an error when the Clipboard API is unavailable.
- `functionUtil.throttle` and `functionUtil.debounce` are re-exported from [radash](https://radash-docs.vercel.app/). Refer to the radash documentation for the full API.
- `objectUtil` methods are re-exported from [radash](https://radash-docs.vercel.app/). Refer to the radash documentation for detailed behavior.
- `stringUtil.kebabCase` is re-exported from [change-case](https://github.com/blakeembrey/change-case).
