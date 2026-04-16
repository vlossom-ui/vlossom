> For English documentation, see [README.md](./README.md).

# VsFocusTrap

키보드 포커스를 단일 자식 요소 내에 가두는 유틸리티 컴포넌트로, 접근성 있는 모달 및 오버레이 인터랙션을 보장합니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 자식 요소 내에서 `Tab` 및 `Shift+Tab` 키 탐색을 가둠
- 마운트 시 자동으로 트랩에 포커스하고 언마운트 시 이전에 포커스된 요소를 복원
- `disabled` prop으로 런타임 시 비활성화 가능
- 프로그래밍 방식 제어를 위한 `focus` 및 `blur` 메서드 노출
- 정확히 하나의 루트 자식 요소 필요

## 기본 사용법

```html
<template>
    <vs-focus-trap>
        <div>
            <input type="text" placeholder="첫 번째 필드" />
            <input type="text" placeholder="두 번째 필드" />
            <button>제출</button>
        </div>
    </vs-focus-trap>
</template>
```

### 조건부 비활성화

```html
<template>
    <vs-focus-trap :disabled="!isModalOpen">
        <div class="modal-content">
            <button>액션</button>
            <button @click="isModalOpen = false">닫기</button>
        </div>
    </vs-focus-trap>
</template>

<script setup>
import { ref } from 'vue';
const isModalOpen = ref(true);
</script>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `disabled` | `boolean` | `false` | | 언마운트 없이 포커스 트래핑 비활성화 |

## 타입

VsFocusTrap은 `StyleSet` 인터페이스가 없습니다.

### StyleSet 예시

VsFocusTrap은 `styleSet` prop을 사용하지 않습니다.

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 포커스 트랩 경계로 작동할 자식 요소를 정확히 하나 포함해야 함 |

## 메서드

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
| `focus` | - | 포커스 트랩 앵커로 포커스 이동 |
| `blur` | - | 트랩이 활성화되기 전에 포커스되었던 요소로 포커스 반환 |

## 주의사항

`VsFocusTrap`의 기본 슬롯은 **정확히 하나**의 루트 자식 요소를 포함해야 합니다. 자식 요소가 없거나 여러 개인 경우 에러가 로그되며 트랩이 올바르게 작동하지 않습니다.
