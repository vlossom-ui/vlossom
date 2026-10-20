> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsBreadcrumb

A breadcrumb component that shows the path to the current page and reports ancestor clicks as an event.

**Available Version**: 2.3.0+

## Feature

- Renders a semantic `nav > ol > li` breadcrumb from a string array; the last item is the current page (`aria-current="page"`)
- Does not navigate by itself: clicking an ancestor emits `click-path` with the clicked path and the full path, so you decide what happens (router, new tab, in-app action)
- Disables ancestors with a boolean or a per-item function
- Collapses the middle of a deep path with `showingLength` and expands it with the ellipsis button
- Truncates long labels with an ellipsis; limit item width with `$item.minWidth` / `$item.maxWidth`
- Customizable item content and separator via slots, and color scheme / style set support

## Basic Usage

```html live
<template>
    <vs-breadcrumb :paths="paths" @click-path="onClick" />
    <p>Clicked: {{ clicked }}</p>
</template>

<script setup>
import { ref } from 'vue';

const paths = ['Home', 'Components', 'Breadcrumb'];
const clicked = ref('-');

function onClick(clickedPaths) {
    clicked.value = clickedPaths.join(' / ');
}
</script>
```

### With a Router

`VsBreadcrumb` does not depend on `vue-router`. Keep the route of each path yourself and navigate in the `click-path` handler.

```html
<template>
    <vs-breadcrumb :paths="paths" @click-path="(clickedPaths) => router.push(routes[clickedPaths.length - 1])" />
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const paths = ['Home', 'Components', 'Breadcrumb'];
const routes = ['/', '/components', '/components/breadcrumb'];
</script>
```

### Disabled

```html live
<template>
    <vs-breadcrumb :paths="['Home', 'Components', 'Breadcrumb']" :disabled="(path, index) => index === 0" />
</template>
```

### Collapse

When `paths` has more items than `showingLength`, the first item and the last `showingLength - 1` items stay visible and the rest collapse into an ellipsis button.

```html live
<template>
    <vs-breadcrumb
        :paths="['Home', 'Documentation', 'Components', 'Navigation', 'Breadcrumb', 'Examples']"
        :showing-length="3"
    />
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
        <template #path="{ path, isCurrent }">
            <span :style="{ textTransform: isCurrent ? 'uppercase' : 'none' }">{{ path }}</span>
        </template>
    </vs-breadcrumb>
</template>
```

## Props

| Prop            | Type                                                    | Default | Required | Description                                                                  |
| --------------- | ------------------------------------------------------- | ------- | -------- | ---------------------------------------------------------------------------- |
| `colorScheme`   | `string`                                                | -       | -        | Color scheme for the component                                               |
| `styleSet`      | `string \| VsBreadcrumbStyleSet`                        | -       | -        | Custom style set for the component                                           |
| `disabled`      | `boolean \| ((path: string, index: number) => boolean)` | `false` | -        | Disables ancestor items; a boolean for all or a per-item function            |
| `paths`         | `string[]`                                              | `[]`    | -        | Path labels from the root to the current page. The last item is the current page |
| `showingLength` | `number`                                                | -       | -        | Number of visible items before the middle collapses (integer, 2 or more). Leave unset to never collapse |

## Types

```typescript
interface VsBreadcrumbStyleSet extends CSSProperties {
    $list?: CSSProperties;
    $item?: CSSProperties;
    $link?: CSSProperties;
    $current?: CSSProperties;
    $separator?: CSSProperties;
    $ellipsisButton?: CSSProperties;
}
```

> [!NOTE]
> `$item` styles each list item (including the collapsed item), `$link` styles ancestor buttons, `$current` styles the current page label, and `$ellipsisButton` styles the expand button.

### StyleSet Example

```html live
<template>
    <vs-breadcrumb
        :paths="['Home', 'Components', 'Breadcrumb']"
        :style-set="{
            $list: { gap: '0.25rem 0.75rem' },
            $link: { color: '#6366f1' },
            $current: { color: '#1e1b4b', fontWeight: '700' },
            $separator: { color: '#a5b4fc' },
        }"
    />
</template>
```

## Events

| Event   | Payload                                       | Description                                                                                  |
| ------- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `click-path` | `(clickedPaths: string[], paths: string[])`   | Emitted when an ancestor is clicked. Not emitted for the current item, disabled items, or the expand button |

## Slots

| Slot        | Description                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------- |
| `path`      | Content of each item; receives `{ path, index, isCurrent, isDisabled }`                     |
| `separator` | Separator after each item; receives `{ index }` (the index of the item before the separator) |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Caution

- `VsBreadcrumb` does not navigate. Handle navigation in the `click-path` handler.
- The last item of `paths` is always the current page and is not clickable.
- The `path` slot replaces only the content inside each item, so the click behavior stays.
- Clicks on the ancestor and expand buttons do not propagate to parent elements.
- After the ellipsis button expands the path, the path collapses again when `paths` changes.
