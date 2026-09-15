> For English documentation, see [README.md](./README.md).

# useFileRules

**사용 가능 버전**: 2.1.0+

파일 인풋에 필요한 유효성 검사 규칙 함수들(필수, 최대/최소 개수, 허용 타입)을 반환합니다.

## Feature

- `requiredCheck` — required가 true이고 파일이 없을 때 실패
- `maxCheck` — 파일 수가 `max`를 초과할 때 실패 (`max`가 없으면 스킵)
- `minCheck` — 파일 수가 `min` 미만일 때 실패 (`min`이 없으면 스킵)
- `acceptCheck` — 각 파일을 `accept` 문자열(MIME 타입, 와일드카드, 확장자)에 대해 검사

## Basic Usage

```html
<script setup>
import { ref } from 'vue';
import { useFileRules } from '@/composables';

const accept = ref('image/*');
const required = ref(true);

const { requiredCheck, acceptCheck } = useFileRules(accept, required);
</script>
```

## Args

| 인자       | 타입                    | 기본값 | 필수 | 설명                                                   |
| ---------- | ----------------------- | ------ | ---- | ------------------------------------------------------ |
| `accept`   | `Ref<string>`           | —      | Yes  | 허용 파일 타입 (MIME 타입, 와일드카드, 확장자)          |
| `required` | `Ref<boolean>`          | —      | Yes  | 파일 필수 여부                                         |
| `max`      | `Ref<number \| string>` | —      | No   | 허용 최대 파일 수                                      |
| `min`      | `Ref<number \| string>` | —      | No   | 필수 최소 파일 수                                      |

## Return Methods

| 메서드                     | 파라미터 | 설명                                                             |
| -------------------------- | -------- | ---------------------------------------------------------------- |
| `requiredCheck`            | `File[]` | required가 true이고 파일이 없으면 에러 메시지 반환               |
| `maxCheck`                 | `File[]` | 파일 수가 `max`를 초과하면 에러 메시지 반환                      |
| `minCheck`                 | `File[]` | 파일 수가 `min` 미만이면 에러 메시지 반환                        |
| `acceptCheck`              | `File[]` | accept에 맞지 않는 파일이 있으면 에러 메시지 반환                |
