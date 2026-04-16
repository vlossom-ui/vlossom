> For English documentation, see [README.md](./README.md).

# useOverlayDom

**Available Version**: 2.0.0+

대상 DOM 요소에 크기, 포인터 이벤트, z-index를 설정할 수 있는 절대 위치 오버레이 `<div>` 요소를 생성하고 추가합니다.

## Feature

- 너비, 높이, pointer-events, z-index를 커스터마이징할 수 있는 절대 위치 오버레이 `<div>`를 생성합니다
- 오버레이를 한 번만 추가합니다 — 같은 id를 가진 요소가 이미 존재하면 재사용됩니다
- 간편한 사용을 위한 단일 `appendOverlayDom` 메서드를 제공합니다

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

인자 없음 — `useOverlayDom`은 파라미터를 받지 않습니다.

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

| RefType | 타입 | 설명 |
| ------- | ---- | ---- |

## Return Methods

| 메서드             | 파라미터                                                               | 설명                                                                                               |
| ------------------ | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `appendOverlayDom` | `targetElement: Element, overlayId: string, overlayStyle?: OverlayStyle` | `overlayId`를 DOM id로 사용하여 `targetElement`에 새 오버레이 `<div>`를 추가합니다. 요소(신규 또는 기존)를 반환합니다. |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- `appendOverlayDom`에 전달하는 `overlayId` 파라미터는 `#` 접두사를 포함해야 합니다(예: `'#my-overlay'`). `#`은 요소의 `id` 속성을 설정할 때 내부적으로 제거됩니다.
- 오버레이는 `position: absolute; top: 0; left: 0`으로 위치합니다. 오버레이가 올바르게 위치하려면 부모 요소에 `static`이 아닌 `position`이 있어야 합니다.
