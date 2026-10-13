> For English documentation, see [README.md](./README.md).

# useFocusable

**Available Version**: 2.0.0+

`[data-focusable]` 요소를 쿼리하고 스로틀된 마우스 이동 지원으로 포커스 인덱스를 업데이트하여 래퍼 요소 내에서 키보드 접근성 있는 포커스 추적을 관리합니다.

## Feature

- `[data-focusable]` 요소 목록 내에서 인덱스로 현재 포커스된 항목을 추적합니다
- 인덱스 변경 시 `vs-focusable-active` CSS 클래스를 자동으로 적용하거나 제거합니다
- 마우스 이동 이벤트를 스로틀링(25ms 간격)하여 성능 오버헤드를 최소화합니다
- 라이프사이클 제어를 위한 `addMouseMoveListener` / `removeMouseMoveListener`를 제공합니다
- 외부에서의 실수로 인한 변경을 방지하기 위해 `readonly` ref를 반환합니다
- 선택적인 key 모드(`focusableKeys`)는 데이터 키로 포커스를 추적하므로, 포커스 대상 요소가 모두 렌더링되지 않는 경우(예: 가상 스크롤)에도 동작합니다

## Basic Usage

```html
<template>
    <ul ref="listRef">
        <li
            v-for="(item, i) in items"
            :key="i"
            data-focusable
            @keydown.arrow-down.prevent="updateFocusIndex(i + 1)"
            @keydown.arrow-up.prevent="updateFocusIndex(i - 1)"
        >
            {{ item }}
        </li>
    </ul>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue';
import { useFocusable } from '@/composables';

const listRef = useTemplateRef('listRef');
const { focusIndex, updateFocusIndex, addMouseMoveListener, removeMouseMoveListener } = useFocusable(listRef);

onMounted(addMouseMoveListener);
onBeforeUnmount(removeMouseMoveListener);
</script>
```

### Key 모드

가상 스크롤 목록처럼 포커스 대상 요소가 모두 DOM에 있지 않을 수 있다면 `focusableKeys`를 전달합니다. 포커스는 DOM 순서가 아니라 key 순서로 추적됩니다. 각 요소는 `data-focusable` 값으로 자신의 key를 지정하고, 요소가 다시 렌더링될 수 있으므로 `vs-focusable-active`는 `isFocused`로 바인딩합니다.

```html
<template>
    <div ref="listRef">
        <div
            v-for="item in renderedItems"
            :key="item.id"
            :data-focusable="item.id"
            :class="{ 'vs-focusable-active': isFocused(item.id) }"
        >
            {{ item.label }}
        </div>
    </div>
</template>

<script setup>
import { computed, useTemplateRef } from 'vue';
import { useFocusable } from '@/composables';

const listRef = useTemplateRef('listRef');
const focusableKeys = computed(() => allItems.value.map((item) => item.id));
const { focusedKey, isFocused, updateFocusIndex, addMouseMoveListener, removeMouseMoveListener } = useFocusable(
    listRef,
    focusableKeys,
);
</script>
```

## Args

| 인자             | 타입                       | 기본값 | 필수 | 설명                                                               |
| ---------------- | -------------------------- | ------ | ---- | ------------------------------------------------------------------ |
| `wrapperElement` | `TemplateRef<HTMLElement>` | —      | Yes  | `[data-focusable]` 자식 요소를 포함하는 컨테이너 요소를 가리키는 템플릿 ref. |
| `focusableKeys`  | `Ref<string[]>`            | —      | -    | key 모드를 활성화합니다. 모든 포커스 대상의 key 순서이며, 각 요소의 `data-focusable` 값과 매칭됩니다. |

## Types

추가로 내보내는 타입이 없습니다.

## Return Refs

| RefType                   | 타입                                     | 설명                                                                    |
| ------------------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| `focusIndex`              | `DeepReadonly<Ref<number>>`              | 현재 포커스 인덱스. `-1`은 아무것도 포커스되지 않음을 의미합니다.        |
| `currentFocusableElement` | `DeepReadonly<Ref<HTMLElement \| null>>` | 현재 `vs-focusable-active` 클래스를 가진 DOM 요소. key 모드에서는 항상 `null`. |
| `focusedKey`              | `ComputedRef<string \| null>`            | key 모드에서 `focusIndex` 위치의 key. 포커스가 없거나 key 모드가 아니면 `null`. |

## Return Methods

| 메서드                    | 파라미터        | 설명                                                                                    |
| ------------------------- | --------------- | --------------------------------------------------------------------------------------- |
| `isFocused`               | `key: string`   | 주어진 key가 포커스되어 있으면 `true`를 반환합니다 (key 모드).                          |
| `updateFocusIndex`        | `index: number` | `focusIndex`를 주어진 값으로 설정하며, 유효한 범위(key 모드에서는 key 개수)로 클램핑됩니다. `-1`은 포커스를 해제합니다. |
| `getFocusableElements`    | —               | 래퍼 내의 모든 `[data-focusable]` 요소를 배열로 반환합니다.                             |
| `addMouseMoveListener`    | —               | 래퍼 요소에 스로틀된 `mousemove` 리스너를 연결합니다.                                   |
| `removeMouseMoveListener` | —               | 래퍼 요소에서 스로틀된 `mousemove` 리스너를 제거합니다.                                 |

## Hooks

| Hook    | 설명                                                                          |
| ------- | ----------------------------------------------------------------------------- |
| `watch` | `focusIndex`를 감시하여 대상 요소의 `vs-focusable-active` 클래스를 업데이트합니다. key 모드에서는 등록되지 않습니다. |

## Cautions

- 추적되려면 요소에 `data-focusable` 속성이 있어야 합니다. 이 속성이 없는 요소는 이 컴포저블에서 인식되지 않습니다.
- key 모드에서는 컴포저블이 `vs-focusable-active` 클래스를 붙이지 않으므로 `isFocused`로 바인딩하세요.
- 이벤트 리스너 누수를 방지하기 위해 래퍼 마운트 후 `addMouseMoveListener`를 호출하고, 언마운트 전에 `removeMouseMoveListener`를 호출하세요.
