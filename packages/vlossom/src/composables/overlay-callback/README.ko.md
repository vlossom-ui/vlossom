> For English documentation, see [README.md](./README.md).

# useOverlayCallback

**Available Version**: 2.0.0+

오버레이 컴포넌트의 활성/비활성 라이프사이클을 관리하고, 앱의 다른 부분에서 트리거할 수 있도록 전역 오버레이 콜백 스토어에 콜백을 등록합니다.

## Feature

- 제공된 `id` ref 또는 자동 생성된 폴백에서 고유한 오버레이 id를 생성합니다
- 오버레이가 활성화될 때 `useOverlayCallbackStore`에 콜백을 등록합니다
- 비활성화 시 `ANIMATION_DURATION`에 맞는 짧은 `isUnmounting` 창과 함께 스토어에서 콜백을 제거합니다
- 가시성 제어를 위한 간단한 `activate` / `deactivate` 메서드를 노출합니다

## Basic Usage

```html
<template>
    <div v-if="isActivated || isUnmounting" class="vs-modal">
        <!-- 모달 내용 -->
    </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { useOverlayCallback } from '@/composables';

const props = defineProps({ id: { type: String, default: '' } });
const { id } = toRefs(props);

const callbacks = ref({
    onBeforeOpen: () => console.log('열리기 전'),
    onOpen: () => console.log('열림'),
});

const { overlayId, isActivated, isUnmounting, activate, deactivate } = useOverlayCallback(id, callbacks);
</script>
```

## Args

| 인자        | 타입                    | 기본값     | 필수 | 설명                                                                         |
| ----------- | ----------------------- | ---------- | ---- | ---------------------------------------------------------------------------- |
| `id`        | `Ref<string>`           | —          | Yes  | 오버레이 id를 위한 반응형 ref. 비어있을 때 자동 생성된 id로 폴백합니다.      |
| `callbacks` | `Ref<OverlayCallbacks>` | `ref({})` | No   | 오버레이의 선택적 라이프사이클 콜백을 포함하는 객체.                         |

## Types

```typescript
interface OverlayCallbacks {
    onBeforeOpen?: () => void;
    onOpen?: () => void;
    onBeforeClose?: () => void;
    onClose?: () => void;
}
```

## Return Refs

| RefType        | 타입                  | 설명                                                                                |
| -------------- | --------------------- | ----------------------------------------------------------------------------------- |
| `overlayId`    | `ComputedRef<string>` | 결정된 오버레이 id (prop 값 또는 자동 생성).                                         |
| `isActivated`  | `Ref<boolean>`        | 오버레이가 활성화된 동안 `true`.                                                     |
| `isUnmounting` | `Ref<boolean>`        | 비활성화 후 닫힘 애니메이션 창(`ANIMATION_DURATION` ms) 동안 `true`.                 |

## Return Methods

| 메서드       | 파라미터 | 설명                                                             |
| ------------ | -------- | ---------------------------------------------------------------- |
| `activate`   | —        | `isActivated`를 `true`로 설정하고 스토어에 콜백을 등록합니다.    |
| `deactivate` | —        | `isActivated`를 `false`로 설정하고 스토어에서 콜백을 제거합니다. |

## Hooks

| Hook    | 설명                                                                           |
| ------- | ------------------------------------------------------------------------------ |
| `watch` | `isActivated`를 감시하여 `useOverlayCallbackStore`에서 콜백을 추가/제거합니다. |

## Cautions
