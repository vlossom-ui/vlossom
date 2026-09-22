> For English documentation, see [README.md](./README.md).

# useFocusable

**Available Version**: 2.0.0+

포커스 가능한 키 목록을 기준으로 키보드 포커스를 추적하며, 스로틀된 마우스 이동을 지원합니다. 포커스 위치를 DOM이 아니라 키 목록으로 세기 때문에, 목록의 일부만 렌더되어 있어도 정확하게 동작합니다.

## Feature

- 포커스된 항목을 키로 추적하므로, 가상 스크롤 목록에서 아직 DOM에 없는 항목에도 포커스를 옮길 수 있습니다
- `getFocusableElement`로 필요할 때 키에 해당하는 DOM 엘리먼트를 찾습니다
- 마우스 이동 이벤트를 스로틀링(25ms 간격)하여 성능 오버헤드를 최소화합니다
- 라이프사이클 제어를 위한 `addMouseMoveListener` / `removeMouseMoveListener`를 제공합니다

## Basic Usage

포커스 가능한 엘리먼트는 각자의 키를 `data-focusable`에 담습니다. 순서와 개수의 기준은 키 목록입니다.

```html
<template>
    <ul ref="listRef">
        <li
            v-for="item in items"
            :key="item.id"
            :data-focusable="item.id"
            :class="{ 'my-active': currentFocusableKey === item.id }"
        >
            {{ item.label }}
        </li>
    </ul>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, useTemplateRef } from 'vue';
import { useFocusable } from 'vlossom';

const items = ref([]);
const listRef = useTemplateRef('listRef');
const focusableKeys = computed(() => items.value.map((item) => item.id));

const { focusIndex, currentFocusableKey, updateFocusIndex, addMouseMoveListener, removeMouseMoveListener } =
    useFocusable(listRef, focusableKeys);

function moveDown() {
    updateFocusIndex(focusIndex.value + 1);
}

onMounted(addMouseMoveListener);
onBeforeUnmount(removeMouseMoveListener);
</script>
```

## Args

| 인자 | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `wrapperElement` | `TemplateRef<HTMLElement>` | | O | `[data-focusable]` 엘리먼트들을 담고 있는 컨테이너 엘리먼트의 템플릿 ref |
| `focusableKeys` | `Ref<string[]>` | — | 선택 | 포커스 순서대로 나열한 전체 키 목록. 생략하면 현재 렌더된 `[data-focusable]` 요소의 DOM 순서를 사용합니다. |

## Types

추가로 export되는 타입은 없습니다.

## Return Refs

| RefType | 타입 | 설명 |
| ---- | ---- | ---- |
| `focusIndex` | `DeepReadonly<Ref<number>>` | `focusableKeys` 안에서의 현재 포커스 위치. `-1`은 포커스 없음 |
| `currentFocusableKey` | `ComputedRef<string \| null>` | `focusIndex` 위치의 키. 포커스가 없으면 `null` |
| `currentFocusableElement` | `DeepReadonly<Ref<HTMLElement \| null>>` | DOM 순서 모드에서 현재 포커스 위치의 렌더된 엘리먼트. 키 목록 모드에서는 `getFocusableElement`를 사용 |

## Return Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
| `updateFocusIndex` | `index: number` | `focusIndex`를 설정합니다. 마지막 키로 clamp되고, 음수를 주면 포커스를 해제합니다 |
| `getFocusableElement` | `key: string` | `data-focusable`이 해당 키인 엘리먼트를 반환합니다. 렌더되지 않았으면 `null` |
| `getFocusableElements` | — | 렌더된 `[data-focusable]` 엘리먼트 전체를 반환합니다. DOM 순서 모드와 호환성을 위해 제공됩니다. |
| `addMouseMoveListener` | - | 래퍼 엘리먼트에 스로틀된 `mousemove` 리스너를 등록합니다 |
| `removeMouseMoveListener` | - | 래퍼 엘리먼트에서 스로틀된 `mousemove` 리스너를 제거합니다 |

## Hooks

등록하는 라이프사이클 훅은 없습니다. `addMouseMoveListener`와 `removeMouseMoveListener`를 직접 호출하세요.

## Cautions

- 포커스 가능한 엘리먼트는 `data-focusable`에 자신의 키를 넣어야 합니다. 키가 없는 엘리먼트는 이 composable에 보이지 않고, `focusableKeys`에 없는 키는 hover 시 무시됩니다.
- 키는 래퍼 안에서 유일해야 합니다. 그렇지 않으면 `getFocusableElement`가 다른 엘리먼트를 찾습니다.
- 키 목록 모드에서는 `currentFocusableKey`로 포커스 스타일을 바인딩해야 가상 스크롤 재렌더링 후에도 유지됩니다. 기존 DOM 순서 모드에서는 이전과 같이 `vs-focusable-active` 클래스를 composable이 관리합니다.
- 이벤트 리스너 누수를 막기 위해 래퍼가 마운트된 뒤 `addMouseMoveListener`를, 언마운트 전에 `removeMouseMoveListener`를 호출하세요.
