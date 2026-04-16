> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useOverlayDom

**Available Version**: 2.0.0+

Creates and appends a positioned overlay `<div>` element to a target DOM element, with configurable size, pointer events, and z-index.

## Feature

- Creates an absolutely positioned overlay `<div>` with customizable width, height, pointer-events, and z-index
- Appends the overlay only once — if an element with the same id already exists it is reused
- Provides a single `appendOverlayDom` method for straightforward usage

## Basic Usage

```html
<script setup>
import { onMounted } from 'vue';
import { useOverlayDom } from '@/composables';

const { appendOverlayDom } = useOverlayDom();

onMounted(() => {
    const container = document.querySelector('.vs-select');
    appendOverlayDom(container, '#vs-select-overlay', {
        zIndex: 6000,
        pointerEvents: 'auto',
    });
});
</script>
```

## Args

No arguments — `useOverlayDom` takes no parameters.

## Types

```typescript
interface OverlayStyle {
    width?: string;
    height?: string;
    pointerEvents?: string;
    zIndex?: number;
}
```

## Return Refs

| RefType | Type | Description |
| ------- | ---- | ----------- |

## Return Methods

| Method             | Parameters                                                          | Description                                                                                   |
| ------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `appendOverlayDom` | `targetElement: Element, overlayId: string, overlayStyle?: OverlayStyle` | Appends a new overlay `<div>` to `targetElement` using `overlayId` as its DOM id. Returns the element (new or existing). |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions

- The `overlayId` parameter passed to `appendOverlayDom` should include the `#` prefix (e.g. `'#my-overlay'`). The `#` is stripped internally when setting the element's `id` attribute.
- The overlay is positioned `absolute` with `top: 0; left: 0`. The parent element must have a non-static `position` for the overlay to be positioned correctly.
