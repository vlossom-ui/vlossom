> For English documentation, see [README.md](./README.md).

# useScrollLock

**Available Version**: 2.0.0+

컨테이너 요소(기본값: `body`)에 `overflow: hidden`을 설정하고 비터치 디바이스에서 스크롤바 너비를 보상하여 스크롤을 방지합니다.

## Feature

- 대상 컨테이너에 `overflow: hidden`을 설정하여 스크롤을 잠급니다
- 비터치 디바이스에서는 스크롤바 여백을 보상하기 위해 `paddingRight` / `paddingBottom`을 추가합니다(고정값 `8px`)
- 잠금 전 원래 overflow와 padding 값을 저장하고 잠금 해제 시 복원합니다
- 부드러운 스타일 적용/복원을 위해 `requestAnimationFrame`을 사용합니다
- 반응형 `isLocked` ref를 통해 잠금 상태를 추적합니다

## Basic Usage

```html
<script setup>
import { useScrollLock } from '@/composables';

const { isLocked, lock, unlock } = useScrollLock('body');

function openModal() {
    lock();
}

function closeModal() {
    unlock();
}
</script>
```

## Args

| 인자        | 타입     | 기본값   | 필수 | 설명                                         |
| ----------- | -------- | -------- | ---- | -------------------------------------------- |
| `container` | `string` | `'body'` | No   | 스크롤을 잠글 요소의 CSS 선택자.              |

## Types

```typescript
interface ScrollLockState {
    overflow: string;
    paddingRight: string;
    paddingBottom: string;
}
```

## Return Refs

| RefType    | 타입           | 설명                                      |
| ---------- | -------------- | ----------------------------------------- |
| `isLocked` | `Ref<boolean>` | 컨테이너 스크롤이 잠겨 있는 동안 `true`.   |

## Return Methods

| 메서드   | 파라미터 | 설명                                                                                            |
| -------- | -------- | ----------------------------------------------------------------------------------------------- |
| `lock`   | —        | 현재 overflow/padding 상태를 저장하고 `requestAnimationFrame`을 통해 스크롤 잠금 스타일을 적용합니다. |
| `unlock` | —        | `requestAnimationFrame`을 통해 저장된 overflow/padding 상태를 복원합니다.                        |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- 컴포저블은 호출 시 컨테이너 요소를 쿼리합니다. `useScrollLock`이 호출될 때 DOM이 준비되지 않으면 `containerElement`가 `null`이 되어 `lock`/`unlock`이 동작하지 않습니다.
- 레이아웃 변화를 방지하기 위해 터치 디바이스에서는 스크롤바 보상이 건너뜁니다.
- 이미 잠긴 상태에서 `lock`을 호출하거나, 이미 잠금 해제된 상태에서 `unlock`을 호출하면 아무 동작도 하지 않습니다.
