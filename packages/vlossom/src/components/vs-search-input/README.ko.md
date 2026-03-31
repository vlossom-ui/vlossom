> For English documentation, see [README.md](./README.md).

# VsSearchInput

대소문자 구분 및 정규식 토글 버튼을 선택적으로 제공하는 검색 입력 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 불필요한 트리거를 줄이기 위한 디바운스된 `search` 이벤트 발생 (400ms)
- `useCaseSensitive`를 통한 대소문자 구분 토글 지원
- `useRegex`를 통한 정규식 토글 지원
- 목록 필터링을 위한 내장 `match(text)` 유틸리티 메서드
- `focus`, `blur`, `select`, `clear` 메서드를 통한 프로그래밍 방식 제어
- `width` 및 `grid` prop을 통한 반응형 레이아웃 지원

## 기본 사용법

```html
<template>
    <vs-search-input v-model="query" @search="onSearch" />
</template>

<script setup>
import { ref } from 'vue';
const query = ref('');
function onSearch(value) {
    console.log('검색:', value);
}
</script>
```

### 대소문자 구분 및 정규식 토글 사용

```html
<template>
    <vs-search-input
        v-model="query"
        v-model:case-sensitive="caseSensitive"
        v-model:regex="regex"
        use-case-sensitive
        use-regex
        @search="onSearch"
    />
</template>
```

### match()를 사용한 필터링

```html
<template>
    <vs-search-input ref="searchRef" v-model="query" />
    <ul>
        <li v-for="item in filteredItems" :key="item">{{ item }}</li>
    </ul>
</template>

<script setup>
import { ref, computed } from 'vue';
const searchRef = ref(null);
const query = ref('');
const items = ['사과', '바나나', '체리'];
const filteredItems = computed(() => items.filter(item => searchRef.value?.match(item) ?? true));
</script>
```

## Props

| Prop               | Type                            | Default | Required | 설명                                                 |
| ------------------ | ------------------------------- | ------- | -------- | ---------------------------------------------------- |
| `colorScheme`      | `string`                        | -       | -        | 컴포넌트의 색상 스킴                                 |
| `styleSet`         | `string \| VsSearchInputStyleSet` | -     | -        | 컴포넌트에 적용할 커스텀 스타일 세트                 |
| `width`            | `string \| number \| Breakpoints` | -     | -        | 반응형 너비                                          |
| `grid`             | `string \| number \| Breakpoints` | -     | -        | 그리드 컬럼 스팬                                     |
| `disabled`         | `boolean`                       | `false` | -        | 입력 비활성화                                        |
| `placeholder`      | `string`                        | `''`    | -        | 플레이스홀더 텍스트                                  |
| `readonly`         | `boolean`                       | `false` | -        | 입력을 읽기 전용으로 설정                            |
| `useCaseSensitive` | `boolean`                       | `false` | -        | 대소문자 구분 토글 버튼 표시                         |
| `useRegex`         | `boolean`                       | `false` | -        | 정규식 토글 버튼 표시                                |
| `modelValue`       | `string`                        | `''`    | -        | 검색 텍스트 값 (v-model)                             |
| `caseSensitive`    | `boolean`                       | `false` | -        | 대소문자 구분 상태 (v-model:caseSensitive)           |
| `regex`            | `boolean`                       | `false` | -        | 정규식 모드 상태 (v-model:regex)                     |

## Types

```typescript
interface VsSearchInputStyleSet {
    variables?: {
        height?: string;
    };
    input?: VsInputStyleSet;
    toggle?: VsToggleStyleSet;
}
```

> [!NOTE]
> `input`은 [VsInputStyleSet](../vs-input/README.md#types)을, `toggle`은 [VsToggleStyleSet](../vs-toggle/README.md#types)을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-search-input
        v-model="query"
        :style-set="{
            variables: { height: '2.5rem' },
            input: { component: { borderRadius: '1rem' } },
        }"
    />
</template>
```

## Events

| Event                  | Payload   | 설명                                               |
| ---------------------- | --------- | -------------------------------------------------- |
| `search`               | `string`  | 검색 텍스트가 변경될 때 디바운스되어 발생          |
| `update:modelValue`    | `string`  | 검색 텍스트가 변경될 때 발생                       |
| `update:caseSensitive` | `boolean` | 대소문자 구분 토글이 변경될 때 발생                |
| `update:regex`         | `boolean` | 정규식 토글이 변경될 때 발생                       |

## Slots

| Slot | 설명 |
| ---- | ---- |

## Methods

| Method    | Parameters       | 설명                                                  |
| --------- | ---------------- | ----------------------------------------------------- |
| `match`   | `text: string`   | 텍스트가 현재 검색 쿼리와 일치하면 `true` 반환        |
| `select`  | -                | 입력의 모든 텍스트 선택                               |
| `focus`   | -                | 입력에 포커스                                         |
| `blur`    | -                | 입력 포커스 해제                                      |
| `clear`   | -                | 검색 텍스트 초기화                                    |
