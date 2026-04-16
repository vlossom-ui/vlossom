> For English documentation, see [README.md](./README.md).

# v-scroll-shadow

스크롤 가능한 요소에 스크롤 섀도우 인디케이터를 자동으로 추가합니다. 섀도우는 해당 방향으로 더 스크롤할 수 있음을 시각적으로 알려줍니다.

**사용 가능 버전**: 2.0.0+

## 기본 사용법

스크롤 가능한 overflow를 가진 요소에 `v-scroll-shadow`를 적용합니다:

```html
<template>
    <div v-scroll-shadow style="height: 200px; overflow: auto;">
        <!-- 스크롤 가능한 콘텐츠 -->
    </div>
</template>
```

디렉티브를 조건부로 활성화하거나 비활성화하려면 boolean 값을 바인딩합니다:

```html
<template>
    <div v-scroll-shadow="isEnabled" style="height: 200px; overflow: auto;">
        <!-- 스크롤 가능한 콘텐츠 -->
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isEnabled = ref(true);
</script>
```

## 바인딩

| 바인딩  | 타입                   | 기본값      | 설명                                                       |
| ------- | ---------------------- | ----------- | ---------------------------------------------------------- |
| `value` | `boolean \| undefined` | `undefined` | `false`이면 디렉티브가 비활성화됩니다. 그 외의 경우 활성화됩니다. |

## 훅

| 훅          | 설명                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------- |
| `mounted`   | 요소가 스크롤 가능한지 확인하고, 스크롤 가능한 경우 스크롤 섀도우를 활성화합니다.              |
| `updated`   | 바인딩 값을 재평가하고, 값이 변경되면 섀도우를 활성화하거나 비활성화합니다.                    |
| `unmounted` | 섀도우 클래스를 제거하고 원래의 `container-type` CSS 속성을 복원하여 정리합니다.               |

## 주의사항

- 이 디렉티브는 CSS `scroll-state` 컨테이너 쿼리 기능에 의존합니다. 대상 브라우저가 이 기능을 지원하는지 확인하세요.
- 디렉티브는 요소가 실제로 스크롤 가능한 경우에만 활성화됩니다(즉, 계산된 `overflow-x` 또는 `overflow-y`가 스크롤을 허용하고 콘텐츠가 넘치는 경우). 요소에 overflow가 없으면 디렉티브는 활성화되지 않습니다.
- 요소에 이미 `container-type` 스타일이 설정된 경우, 디렉티브는 기존 값을 교체하지 않고 `scroll-state`를 추가하며, 언마운트 시 원래 값을 복원합니다.
