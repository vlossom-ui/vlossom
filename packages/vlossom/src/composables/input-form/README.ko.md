> For English documentation, see [README.md](./README.md).

# useInputForm

**Available Version**: 2.0.0+

Vue의 provide/inject 메커니즘을 통해 개별 입력 컴포넌트를 가장 가까운 부모 `VsForm`에 연결하여 폼 수준의 유효성 검사, 초기화, 상태 동기화를 활성화합니다.

## Feature

- `FORM_STORE_KEY`를 사용하여 부모 폼 스토어를 주입합니다. 폼이 없을 경우 기본 no-op 스토어로 폴백합니다
- 마운트/언마운트 및 id 변경 시 폼에서 입력을 자동으로 등록하고 제거합니다
- 폼의 `validateFlag`와 `clearFlag`를 감시하여 입력 자체의 `validate` 및 `clear` 함수를 트리거합니다
- `valid` 및 `changed` 상태 변경을 폼 스토어에 전파합니다
- 폼 주도의 `formDisabled` 및 `formReadonly` ref를 노출합니다

## Basic Usage

```html
<script setup>
import { ref, computed } from 'vue';
import { useInputForm } from '@/composables';

// 일반적으로 useInput 내부에서 사용됩니다
const id = computed(() => 'my-input-id');
const valid = ref(true);
const changed = ref(false);

function validate() { return valid.value; }
function clear() { changed.value = false; }

const { formDisabled, formReadonly } = useInputForm(id, valid, changed, validate, clear);
</script>
```

## Args

| 인자       | 타입            | 기본값 | 필수 | 설명                                                           |
| ---------- | --------------- | ------ | ---- | -------------------------------------------------------------- |
| `id`       | `Ref<string>`   | —      | Yes  | 폼에 등록하는 데 사용되는 입력의 고유 id를 담은 반응형 ref.    |
| `valid`    | `Ref<boolean>`  | —      | Yes  | 입력의 반응형 유효성 상태.                                     |
| `changed`  | `Ref<boolean>`  | —      | Yes  | 사용자가 값을 변경했는지 나타내는 반응형 ref.                  |
| `validate` | `() => boolean` | —      | Yes  | 폼이 유효성 검사를 트리거할 때 호출되는 함수.                  |
| `clear`    | `() => void`    | —      | Yes  | 폼이 초기화를 트리거할 때 호출되는 함수.                       |

## Types

추가로 내보내는 타입이 없습니다.

## Return Refs

| RefType        | 타입           | 설명                                              |
| -------------- | -------------- | ------------------------------------------------- |
| `formDisabled` | `Ref<boolean>` | 부모 폼이 모든 입력을 비활성화할 때 `true`.        |
| `formReadonly` | `Ref<boolean>` | 부모 폼이 모든 입력을 읽기 전용으로 설정할 때 `true`. |

## Return Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## Hooks

| Hook              | 설명                                                                              |
| ----------------- | --------------------------------------------------------------------------------- |
| `onMounted`       | 입력의 현재 `changed` 및 `valid` 상태를 폼에 등록합니다.                           |
| `onBeforeUnmount` | 폼 스토어에서 입력을 제거합니다.                                                   |
| `watch`           | `changed`, `valid`, `validateFlag`, `clearFlag`, `id`를 감시하여 폼 스토어를 동기화합니다. |

## Cautions

- 이 컴포저블은 `useInput` 내부에서 사용하도록 의도되었습니다. 독립적으로 사용하려면 호환 가능한 폼 스토어가 제공되어야 합니다.
- `id`가 변경되면 이전 id는 폼에서 제거되고 새 id가 자동으로 등록됩니다.
