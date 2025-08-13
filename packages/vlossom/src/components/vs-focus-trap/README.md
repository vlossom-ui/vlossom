# VsFocusTrap

포커스를 특정 영역에 가둬두는 포커스 트랩 컴포넌트입니다. 모달, 팝업, 드롭다운 등에서 키보드 접근성을 향상시키는 데 사용됩니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 포커스 트랩

```html
<template>
    <vs-focus-trap>
        <div>
            <!-- tab 이벤트가 트리거 되면 접근 하는 첫번째 요소 -->
            <input type="text" placeholder="첫 번째 입력" />
            <!-- tab 이벤트가 트리거 되면 접근 하는 두번째 요소 -->
            <button>버튼</button>
            <!-- tab 이벤트가 트리거 되면 접근 하는 세번째 요소 -->
            <input type="text" placeholder="두 번째 입력" />
        </div>
    </vs-focus-trap>
</template>
```

### 초기 포커스 요소 지정

```html
<template>
    <vs-focus-trap :initial-focus-ref="buttonRef">
        <div>
            <input type="text" placeholder="입력" />
            <!-- focus (active) -->
            <button ref="buttonRef">포커스될 버튼</button>
        </div>
    </vs-focus-trap>
</template>

<script setup>
import { ref } from 'vue';
const buttonRef = ref(null);
</script>
```

### 포커스 잠금 비활성화

```html
<template>
    <vs-focus-trap :focus-lock="false">
        <div>
            <input type="text" placeholder="내부 첫번째 포커스 요소" />
            <!-- 내부 마지막 포커스 요소에서 tab 이벤트가 트리거 되면 내부 첫번째 포커스 요소 아니라 외부 포커스 가능한 요소에 포커스 된다 -->
            <button>내부 마지막 포커스 요소</button>
        </div>
    </vs-focus-trap>
</template>
```

## Props

| Prop              | Type                  | Default | Required | Description                      |
| ----------------- | --------------------- | ------- | -------- | -------------------------------- |
| `focusLock`       | `boolean`             | `true`  | -        | Tab 키로 포커스 순환 활성화 여부 |
| `initialFocusRef` | `HTMLElement \| null` | `null`  | -        | 컴포넌트 마운트 시 포커스할 요소 |

## Slots

| Slot      | Description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| `default` | 포커스 트랩이 적용될 단일 자식 요소, _"오로지"_ 하나의 자식 요소를 가저야 합니다. |

## Methods

| Method  | Parameters | Description                                        |
| ------- | ---------- | -------------------------------------------------- |
| `focus` | -          | 포커스 트랩을 활성화하고 포커스 설정               |
| `blur`  | -          | 포커스 트랩을 비활성화하고 이전 요소로 포커스 복귀 |

## 사용 시 주의사항

- **단일 자식 요소**: 포커스 트랩은 정확히 하나의 자식 요소만을 포함해야 합니다.
- **포커스 가능한 요소**: 내부에 포커스 가능한 요소(`button`, `input`, `a`, `[tabindex]` 등)가 있어야 정상적으로 작동합니다.
- **키보드 순환**: `focusLock`이 `true`일 때 Tab과 Shift+Tab으로 포커스가 내부에서만 순환됩니다.

## 특징

- **자동 포커스 관리**: 컴포넌트 마운트 시 자동으로 포커스를 설정하고, 언마운트 시 이전 포커스를 복원합니다.
- **키보드 순환**: Tab/Shift+Tab으로 포커스가 컴포넌트 내부에서만 순환됩니다.
- **초기 포커스 커스터마이징**: `initialFocusRef`로 첫 번째 포커스 요소를 지정할 수 있습니다.
- **유연한 포커스 제어**: `focusLock` 속성으로 포커스 잠금을 선택적으로 비활성화할 수 있습니다.
