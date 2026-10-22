> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsBreadcrumb

A breadcrumb component that shows the path to the current page and reports ancestor clicks as an event.

**Available Version**: 2.3.0+

## Feature

- Renders a semantic `nav > ol > li` breadcrumb from a string array; the last item is the current page (`aria-current="page"`)
- Does not navigate by itself: clicking an ancestor emits `click-path` with the paths up to the clicked item and the clicked path, so you decide what happens (router, new tab, in-app action)
- Disables ancestors with a boolean or a per-item function
- Truncates long labels with an ellipsis; limit item width with `$item.minWidth` / `$item.maxWidth`
- Customizable item label and separator via slots, and color scheme / style set support

## Basic Usage

```html live
<template>
    <vs-breadcrumb :paths="paths" @click-path="onClickPath" />
    <p>Clicked: {{ clickedPathText }}</p>
</template>

<script setup>
import { ref } from 'vue';

const paths = ['Home', 'Components', 'Breadcrumb'];
const clickedPathText = ref('-');

function onClickPath(clickedPaths) {
    clickedPathText.value = clickedPaths.join(' / ');
}
</script>
```

### With a Router

`VsBreadcrumb` does not depend on `vue-router`. Keep the route of each path yourself and navigate in the `click-path` handler.

```html
<template>
    <vs-breadcrumb :paths="paths" @click-path="onClickPath" />
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const paths = ['Home', 'Components', 'Breadcrumb'];
const routes = ['/', '/components', '/components/breadcrumb'];

function onClickPath(clickedPaths) {
    router.push(routes[clickedPaths.length - 1]);
}
</script>
```

### Disabled

```html live
<template>
    <vs-breadcrumb :paths="['Home', 'Components', 'Breadcrumb']" :disabled="(path, index) => index === 0" />
</template>
```

### Long Labels

Labels stay on one line and are truncated with an ellipsis when there is not enough space. Set `minWidth` / `maxWidth` on `$item` to control item width.

```html live
<template>
    <vs-breadcrumb
        :paths="['Home', 'Documentation', 'Components', 'Navigation', 'Breadcrumb']"
        :style-set="{ $item: { maxWidth: '7rem' } }"
    />
</template>
```

### Custom Separator

```html live
<template>
    <vs-breadcrumb :paths="['Home', 'Components', 'Breadcrumb']">
        <template #separator>/</template>
    </vs-breadcrumb>
</template>
```

### Custom Item

```html live
<template>
    <vs-breadcrumb :paths="['Home', 'Components', 'Breadcrumb']">
        <template #item="{ path, isCurrent }">
            <span :style="{ textTransform: isCurrent ? 'uppercase' : 'none' }">{{ path }}</span>
        </template>
    </vs-breadcrumb>
</template>
```

## Props

| Prop          | Type                                                    | Default | Required | Description                                                                      |
| ------------- | ------------------------------------------------------- | ------- | -------- | -------------------------------------------------------------------------------- |
| `colorScheme` | `string`                                                | -       | -        | Color scheme for the component                                                   |
| `styleSet`    | `string \| VsBreadcrumbStyleSet`                        | -       | -        | Custom style set for the component                                               |
| `disabled`    | `boolean \| ((path: string, index: number) => boolean)` | `false` | -        | Disables ancestor items; a boolean for all or a per-item function                |
| `paths`       | `string[]`                                              | `[]`    | -        | Path labels from the root to the current page. The last item is the current page |

## Types

```typescript
interface VsBreadcrumbStyleSet extends CSSProperties {
    $list?: CSSProperties;
    $item?: CSSProperties & {
        $current?: CSSProperties;
    };
    $separator?: CSSProperties;
}
```

> [!NOTE]
> `$list` styles the list, `$item` styles each item label (ancestor buttons and the current page label), `$item.$current` is merged over `$item` for the current page only, and `$separator` styles each separator.

### StyleSet Example

```html live
<template>
    <vs-breadcrumb
        :paths="['Home', 'Components', 'Breadcrumb']"
        :style-set="{
            $list: { gap: '0.25rem 0.75rem' },
            $item: {
                color: '#6366f1',
                $current: { color: '#1e1b4b', fontWeight: '700' },
            },
            $separator: { color: '#a5b4fc' },
        }"
    />
</template>
```

## Events

| Event        | Payload                                  | Description                                                                                                                                         |
| ------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `click-path` | `(clickedPaths: string[], path: string)` | Emitted when an ancestor is clicked, with the paths up to the clicked item and the clicked path. Not emitted for the current item or disabled items |

## Slots

| Slot        | Description                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `item`      | Label inside each item (the ancestor button or the current page label); receives `{ path, index, isCurrent, isDisabled }` |
| `separator` | Separator after each item; receives `{ index }` (the index of the item before the separator)                              |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Caution

- `VsBreadcrumb` does not navigate. Handle navigation in the `click-path` handler.
- The last item of `paths` is always the current page and is not clickable.
- The `item` slot replaces only the label inside each item, so the click behavior stays. Do not put links or buttons in it, because ancestor labels render inside a `<button>`.
- Clicks on ancestor buttons do not propagate to parent elements.
