> For English documentation, see [README.md](./README.md).

# useVirtualScroll

**Available Version**: 2.1.0+

대량 목록에서 화면에 보이는 구간만 렌더하도록 계산해 주는 composable입니다. 실제로 스크롤되는 엘리먼트를 스스로 찾기 때문에, 목록이 직접 스크롤하든 조상이 스크롤하든 페이지가 스크롤하든 같은 방식으로 동작합니다.

## 기능

- 아이템이 아무리 많아도 화면에 보이는 구간과 약간의 overscan만 렌더
- 스크롤 컨테이너 자동 해석: 전달한 엘리먼트 → 가장 가까운 스크롤 조상 → window
- 아이템 오프셋이 콘텐츠 엘리먼트 기준이라, 스크롤 컨테이너가 목록보다 한참 위에서 시작해도 값이 어긋나지 않음
- `measureElement`로 가변 높이 아이템 지원
- 두 가지 렌더링 전략 지원 — 절대 위치(`start`)와 앞뒤 여백(`paddingStart` / `paddingEnd`)
- `scrollToIndex`, `scrollIntoView`가 현재 사용 중인 컨테이너를 스크롤

## 기본 사용법

절대 위치 — `totalSize` 높이를 가진 spacer 안에 각 아이템을 배치합니다.

```html
<template>
    <div ref="containerRef" style="height: 400px; overflow: auto;">
        <div ref="contentRef" :style="{ position: 'relative', height: `${totalSize}px` }">
            <div
                v-for="item in virtualItems"
                :key="item.key"
                :data-index="item.index"
                :ref="(el) => measureElement(el as HTMLElement)"
                :style="{ position: 'absolute', top: 0, width: '100%', transform: `translateY(${item.start}px)` }"
            >
                {{ rows[item.index].label }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useVirtualScroll, VIRTUAL_SCROLL_THRESHOLD } from 'vlossom';

const rows = ref([]);
const containerRef = ref(null);
const contentRef = ref(null);

const { virtualItems, totalSize, measureElement } = useVirtualScroll({
    enabled: computed(() => rows.value.length >= VIRTUAL_SCROLL_THRESHOLD),
    count: computed(() => rows.value.length),
    estimateSize: 40,
    getScrollContainer: () => containerRef.value,
    getContentElement: () => contentRef.value,
});
</script>
```

앞뒤 여백 — 행이 컬럼 트랙을 공유하는 테이블이나 그리드처럼, 아이템을 일반 흐름 밖으로 뺄 수 없는 레이아웃에 씁니다.

```html
<template>
    <tbody ref="contentRef">
        <tr v-if="paddingStart > 0" :style="{ height: `${paddingStart}px` }" />
        <tr v-for="item in virtualItems" :key="item.key" :data-index="item.index">
            <td>{{ rows[item.index].label }}</td>
        </tr>
        <tr v-if="paddingEnd > 0" :style="{ height: `${paddingEnd}px` }" />
    </tbody>
</template>
```

## Args

`useVirtualScroll`은 옵션 객체 하나를 받습니다.

| Arg | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `enabled` | `Ref<boolean>` | | O | `false`면 가상 스크롤을 하지 않고 `virtualItems`가 비어 있음 |
| `count` | `Ref<number>` | | O | 전체 아이템 개수 |
| `estimateSize` | `number` | | O | 아이템의 예상 높이(px). 실제 측정 전까지 사용됨 |
| `getScrollContainer` | `() => HTMLElement \| null` | | O | 스크롤 컨테이너 해석의 시작점. 이 엘리먼트부터 조상으로 올라가며 찾음 |
| `getContentElement` | `() => HTMLElement \| null` | | O | 아이템이 배치되는 엘리먼트. 스크롤 컨테이너 안에서의 위치가 오프셋 기준이 됨 |
| `overscan` | `number` | `5` | | 보이는 구간 위아래로 추가 렌더할 아이템 수 |
| `getItemKey` | `(index: number) => string` | | | 아이템별 고정 key. 기본값은 인덱스 |

## 타입

```typescript
interface VsVirtualItem {
    index: number;
    key: string;
    // 콘텐츠 엘리먼트 기준 오프셋
    start: number;
    size: number;
}
```

export되는 상수: `VIRTUAL_SCROLL_THRESHOLD` (`100`), `DEFAULT_VIRTUAL_OVERSCAN` (`5`)

## Return Refs

| RefType | 타입 | 설명 |
| ---- | ---- | ---- |
| `virtualItems` | `ComputedRef<VsVirtualItem[]>` | 렌더할 아이템 목록 (순서대로) |
| `totalSize` | `ComputedRef<number>` | 전체 목록의 높이(px) |
| `paddingStart` | `ComputedRef<number>` | 첫 렌더 아이템 앞의 여백 |
| `paddingEnd` | `ComputedRef<number>` | 마지막 렌더 아이템 뒤의 여백 |

## Return Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
| `measureElement` | `element: HTMLElement \| null` | 아이템 엘리먼트를 등록해 실제 높이를 측정. 엘리먼트에 `data-index`가 있어야 함 |
| `scrollToIndex` | `index: number, offset?: number` | `index` 아이템을 상단으로 스크롤. `offset`만큼 위쪽 여백 확보 |
| `scrollIntoView` | `element: HTMLElement, offset?: number` | 이미 렌더된 엘리먼트를 상단으로 스크롤. 가상 스크롤을 쓰지 않을 때 사용 |

## Hooks

| Hook | 설명 |
| ---- | ---- |
| `onMounted` | 스크롤 컨테이너를 해석하고 resize·scroll 감지를 시작 |
| `onBeforeUnmount` | observer를 정리하고 리스너를 해제 |

## 주의사항

- `getScrollContainer`는 스스로 스크롤하거나, 스크롤되는 무언가 안에 있는 엘리먼트를 반환해야 합니다. `overflow: auto`여도 높이가 정해지지 않으면 스크롤되지 않으며, 이 경우 해석이 조상이나 window로 올바르게 넘어갑니다.
- `measureElement`로 등록하는 아이템은 `data-index`에 `item.index`를 넣어야 합니다. 없으면 측정한 높이가 엉뚱한 아이템에 적용됩니다.
- `virtualItems[].start`는 이미 콘텐츠 엘리먼트 기준입니다. 여기서 스크롤 위치를 다시 빼면 안 됩니다.
- 가상 스크롤을 언제 켤지는 호출하는 쪽이 정합니다. `VIRTUAL_SCROLL_THRESHOLD`는 공용 기본값일 뿐 자동으로 적용되지 않습니다.
- 아이템은 렌더되기 전까지 측정되지 않으므로, 사용자가 스크롤하며 미측정 아이템을 지날 때 `totalSize`가 변합니다. 가변 높이 콘텐츠에서는 정상 동작입니다.
