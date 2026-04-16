> For English documentation, see [README.md](./README.md).

# useClickOutside

**Available Version**: 2.0.0+

지정된 제외 요소 바깥쪽 클릭이 발생할 때마다 콜백을 실행하는 전역 클릭 리스너를 등록합니다.

## Feature

- 신뢰할 수 있는 외부 클릭 감지를 위해 `document`에 캡처 단계 클릭 리스너를 연결합니다
- 제외 영역을 정의하는 여러 CSS 선택자 문자열을 허용합니다
- 전체 라이프사이클 제어를 위한 `addClickOutsideListener` / `removeClickOutsideListener` 메서드를 제공합니다
- `Element.closest()`를 사용하여 조상 요소를 매칭하므로, 제외된 요소의 자식 클릭도 무시됩니다

## Basic Usage

```html
<template>
    <div ref="dropdownRef" class="dropdown">
        <button @click="open">열기</button>
        <ul v-if="isOpen">
            <li>항목 1</li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useClickOutside } from '@/composables';

const isOpen = ref(false);

function open() {
    isOpen.value = true;
}

const { addClickOutsideListener, removeClickOutsideListener } = useClickOutside(['.dropdown'], () => {
    isOpen.value = false;
});

onMounted(addClickOutsideListener);
onBeforeUnmount(removeClickOutsideListener);
</script>
```

## Args

| 인자                | 타입         | 기본값 | 필수 | 설명                                                                                         |
| ------------------- | ------------ | ------ | ---- | -------------------------------------------------------------------------------------------- |
| `excludedSelectors` | `string[]`   | —      | Yes  | CSS 선택자 문자열 배열. 해당 선택자(또는 조상 요소)와 일치하는 요소의 클릭은 무시됩니다.    |
| `callback`          | `() => void` | —      | Yes  | 모든 제외 요소 바깥쪽을 클릭했을 때 호출되는 함수.                                          |

## Types

추가로 내보내는 타입이 없습니다.

## Return Refs

| RefType | 타입 | 설명 |
| ------- | ---- | ---- |

## Return Methods

| 메서드                       | 파라미터 | 설명                                                      |
| ---------------------------- | -------- | --------------------------------------------------------- |
| `addClickOutsideListener`    | —        | `document`에 캡처 단계 `click` 리스너를 추가합니다.       |
| `removeClickOutsideListener` | —        | 이전에 추가된 `click` 리스너를 `document`에서 제거합니다. |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- 메모리 누수를 방지하기 위해 컴포넌트가 마운트된 후 `addClickOutsideListener`를 호출하고, 언마운트 전에 `removeClickOutsideListener`를 호출하세요.
- 리스너는 캡처 단계(`true`)에 연결되므로 버블링 핸들러보다 먼저 실행됩니다.
