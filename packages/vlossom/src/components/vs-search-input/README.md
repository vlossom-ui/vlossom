# VsSearchInput

검색 기능을 제공하는 입력 컴포넌트입니다. vs-input을 기반으로 만들어졌으며, 대소문자 구분 및 정규식 검색 옵션을 제공합니다.<br />
입력 시 debounce를 적용하여 500ms마다 search 이벤트를 emit합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 검색 입력

```html
<template>
    <vs-search-input placeholder="검색어를 입력하세요" @search="onSearch" />
</template>

<script setup>
function onSearch(value) {
    console.log('Search:', value);
}
</script>
```

### 토글 버튼 사용

```html
<template>
    <!-- 대소문자 구분 토글 버튼 -->
    <vs-search-input
        placeholder="검색어를 입력하세요"
        case-sensitive
        @search="onSearch"
    />

    <!-- 정규식 토글 버튼 -->
    <vs-search-input
        placeholder="검색어를 입력하세요"
        regex
        @search="onSearch"
    />

    <!-- 두 토글 버튼 모두 -->
    <vs-search-input
        placeholder="검색어를 입력하세요"
        case-sensitive
        regex
        @search="onSearch"
    />
</template>
```

### match 메서드 사용

```html
<template>
    <vs-search-input
        ref="searchInputRef"
        placeholder="검색어를 입력하세요"
        case-sensitive
        regex
        @search="onSearch"
    />
    <div>
        <div v-for="item in filteredItems" :key="item">
            {{ item }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { VsSearchInputRef } from '@/components/vs-search-input/types';

const searchInputRef = ref<VsSearchInputRef | null>(null);
const items = ['Apple', 'Banana', 'Cherry', 'Date'];
const filteredItems = ref([...items]);

function onSearch(value: string) {
    if (!searchInputRef.value) {
        return;
    }

    filteredItems.value = items.filter((item) => {
        return searchInputRef.value!.match(item);
    });
}
</script>
```

## Props

| Prop            | Type                              | Default | Required | Description                       |
| --------------- | --------------------------------- | ------- | -------- | --------------------------------- |
| `colorScheme`   | `ColorScheme`                     | -       | -        | 컴포넌트 색상 테마                |
| `styleSet`      | `string \| VsSearchInputStyleSet` | -       | -        | 커스텀 스타일 설정 객체           |
| `caseSensitive` | `boolean`                         | `false` | -        | 대소문자 구분 토글 버튼 표시 여부 |
| `regex`         | `boolean`                         | `false` | -        | 정규식 토글 버튼 표시 여부        |
| `disabled`      | `boolean`                         | `false` | -        | 비활성화 상태                     |
| `readonly`      | `boolean`                         | `false` | -        | 읽기 전용 상태                    |
| `placeholder`   | `string`                          | `''`    | -        | 플레이스홀더 텍스트               |
| `small`         | `boolean`                         | `false` | -        | 작은 크기                         |
| `width`         | `string \| number \| Breakpoints` | -       | -        | 컴포넌트 너비                     |
| `grid`          | `string \| number \| Breakpoints` | -       | -        | Grid 설정                         |

## Events

| Event    | Parameters      | Description                                |
| -------- | --------------- | ------------------------------------------ |
| `search` | `value: string` | 검색어 입력 시 발생 (debounce 적용, 500ms) |

## Methods

컴포넌트에 ref로 접근하여 사용할 수 있는 메서드들입니다.

| Method   | Parameters     | Return    | Description                              |
| -------- | -------------- | --------- | ---------------------------------------- |
| `match`  | `text: string` | `boolean` | 주어진 텍스트가 검색어와 일치하는지 확인 |
| `focus`  | -              | -         | 입력 필드에 포커스 적용                  |
| `blur`   | -              | -         | 입력 필드에서 포커스 해제                |
| `select` | -              | -         | 입력 필드의 텍스트 선택                  |
| `clear`  | -              | -         | 입력값 초기화                            |

### match 메서드 동작

- 검색어가 없으면 항상 `true`를 반환합니다.
- 기본적으로 대소문자를 구분하지 않고 검색합니다.
- `caseSensitive` 토글이 활성화되면 대소문자를 구분합니다.
- `regex` 토글이 활성화되면 정규식으로 검색합니다.
- 잘못된 정규식이 입력되면 일반 텍스트 검색으로 fallback합니다.

## Types

```typescript
interface VsSearchInputStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: number;
    fontColor?: string;
    fontSize?: string;
    fontWeight?: number;
    height?: string;
}

interface VsSearchInputRef extends InputRef {
    match: (text: string) => boolean;
    select: () => void;
}
```

## 특징

- **vs-input 기반**: vs-input의 모든 기능과 스타일을 상속받습니다.
- **Debounce 적용**: 입력 시 500ms마다 search 이벤트를 emit하여 성능을 최적화합니다.
- **대소문자 구분**: caseSensitive prop을 통해 대소문자 구분 토글 버튼을 제공합니다.
- **정규식 검색**: regex prop을 통해 정규식 검색 토글 버튼을 제공합니다.
- **match 메서드**: ref를 통해 접근하여 텍스트 매칭 기능을 제공합니다.
- **타입 안전성**: TypeScript를 통해 타입 안전성을 보장합니다.
