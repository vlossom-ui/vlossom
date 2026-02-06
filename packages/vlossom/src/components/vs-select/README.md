# VsSelect

드롭다운 선택 입력을 위한 컴포넌트입니다. 단일 선택과 다중 선택을 모두 지원하며, 검색 기능, 전체 선택, 그룹화 등 다양한 기능을 제공합니다.

**Available Version**: 2.0.0+

---

## 기본 사용법

### 단일 선택

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        placeholder="옵션을 선택하세요"
    />
</template>

<script setup>
import { ref } from 'vue';
const options = ['Apple', 'Banana', 'Orange'];
const selected = ref(null);
</script>
```

### 다중 선택

```html
<template>
    <vs-select
        v-model="selectedItems"
        :options="options"
        placeholder="여러 옵션을 선택하세요"
        multiple
    />
</template>

<script setup>
import { ref } from 'vue';
const options = ['Apple', 'Banana', 'Orange'];
const selectedItems = ref([]);
</script>
```

### 객체 배열 옵션

```html
<template>
    <vs-select
        v-model="selectedUserId"
        :options="users"
        option-label="name"
        option-value="id"
        placeholder="사용자를 선택하세요"
    />
</template>

<script setup>
import { ref } from 'vue';
const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
];
const selectedUserId = ref(null);
</script>
```

### 검색 기능

```html
<template>
    <vs-select
        v-model="selected"
        :options="longOptions"
        placeholder="검색하여 선택하세요"
        search
    />
</template>

<script setup>
import { ref } from 'vue';
const longOptions = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Strawberry'];
const selected = ref(null);
</script>
```

### 검색 옵션 커스터마이징

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        :search="{
            useRegex: false,
            useCaseSensitive: false,
            placeholder: 'Type to search...'
        }"
    />
</template>
```

### 전체 선택 (다중 선택 모드)

```html
<template>
    <vs-select
        v-model="selectedItems"
        :options="options"
        placeholder="여러 옵션을 선택하세요"
        multiple
        select-all
    />
</template>

<script setup>
import { ref } from 'vue';
const options = ['Apple', 'Banana', 'Orange', 'Mango'];
const selectedItems = ref([]);
</script>
```

### 옵션 그룹화

```html
<template>
    <vs-select
        v-model="selected"
        :options="groupedOptions"
        option-label="name"
        option-value="id"
        group-by="category"
        placeholder="카테고리별로 선택하세요"
    />
</template>

<script setup>
import { ref } from 'vue';
const groupedOptions = [
    { id: 1, name: 'Apple', category: 'Fruits' },
    { id: 2, name: 'Banana', category: 'Fruits' },
    { id: 3, name: 'Carrot', category: 'Vegetables' },
    { id: 4, name: 'Broccoli', category: 'Vegetables' },
];
const selected = ref(null);
</script>
```

### 옵션 비활성화

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        :options-disabled="(option) => option.unavailable"
        option-label="name"
        option-value="id"
    />
</template>

<script setup>
import { ref } from 'vue';
const options = [
    { id: 1, name: 'Apple', unavailable: false },
    { id: 2, name: 'Banana', unavailable: true },
    { id: 3, name: 'Orange', unavailable: false },
];
const selected = ref(null);
</script>
```

### 선택 개수 제한 (다중 선택)

```html
<template>
    <vs-select
        v-model="selectedItems"
        :options="options"
        placeholder="최대 3개까지 선택 가능"
        multiple
        :min="1"
        :max="3"
    />
</template>

<script setup>
import { ref } from 'vue';
const options = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'];
const selectedItems = ref([]);
</script>
```

### 칩 기능 (다중 선택)

```html
<template>
    <vs-select
        v-model="selectedItems"
        :options="options"
        multiple
        closable-chips
        collapse-chips
    />
</template>

<script setup>
import { ref } from 'vue';
const options = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'];
const selectedItems = ref([]);
</script>
```

### 커스텀 옵션 템플릿

```html
<template>
    <vs-select v-model="selected" :options="users" option-label="name" option-value="id">
        <template #option="{ label, email, selected }">
            <div :class="{ 'selected-option': selected }">
                <strong>{{ label }}</strong>
                <span>{{ email }}</span>
            </div>
        </template>
    </vs-select>
</template>

<script setup>
import { ref } from 'vue';
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];
const selected = ref(null);
</script>
```

## Props

| Prop              | Type                                             | Default                   | Description                                         |
| ----------------- | ------------------------------------------------ | ------------------------- | --------------------------------------------------- |
| `disabled`        | `boolean`                                        | `false`                   | 컴포넌트 비활성화                                   |
| `hidden`          | `boolean`                                        | `false`                   | 컴포넌트 숨김 여부                                  |
| `id`              | `string`                                         | `''`                      | 컴포넌트 id                                         |
| `label`           | `string`                                         | `''`                      | 입력 필드 라벨                                      |
| `noLabel`         | `boolean`                                        | `false`                   | 라벨 영역 숨김                                      |
| `noMessages`      | `boolean`                                        | `false`                   | 메시지 영역 숨김                                    |
| `required`        | `boolean`                                        | `false`                   | 필수 입력 여부                                      |
| `small`           | `boolean`                                        | `false`                   | 작은 크기                                           |
| `messages`        | `Message[]`                                      | `[]`                      | 메시지 표시                                         |
| `name`            | `string`                                         | `''`                      | input 요소의 name 속성                              |
| `noDefaultRules`  | `boolean`                                        | `false`                   | 기본 검증 규칙 비활성화                             |
| `placeholder`     | `string`                                         | `''`                      | 아무것도 선택되지 않았을 때 표시할 텍스트           |
| `readonly`        | `boolean`                                        | `false`                   | 읽기 전용 상태                                      |
| `rules`           | `Rule[]`                                         | `[]`                      | 커스텀 검증 규칙                                    |
| `state`           | `UIState`                                        | `'idle'`                  | 입력 상태 (idle, success, info, error, warning)     |
| `changed`         | `boolean`                                        | `false`                   | 값 변경 여부 (v-model:changed)                      |
| `valid`           | `boolean`                                        | `false`                   | 검증 통과 여부 (v-model:valid)                      |
| `width`           | `string \| number \| Breakpoints`                | -                         | 컴포넌트 너비                                       |
| `grid`            | `string \| number \| Breakpoints`                | -                         | 그리드 레이아웃 크기                                |
| `colorScheme`     | `ColorScheme`                                    | -                         | 컴포넌트 색상 테마                                  |
| `styleSet`        | `string \| VsSelectStyleSet`                     | -                         | 커스텀 스타일 설정 객체                             |
| `options`         | `any[]`                                          | `[]`                      | 선택 가능한 옵션 배열                               |
| `optionLabel`     | `string`                                         | `''`                      | 옵션 객체에서 라벨로 사용할 속성                    |
| `optionValue`     | `string`                                         | `''`                      | 옵션 객체에서 값으로 사용할 속성                    |
| `groupBy`         | `(option, index) => string \| null`              | `null`                    | 옵션을 그룹화할 함수                                |
| `groupOrder`      | `string[]`                                       | `[]`                      | 그룹 표시 순서 지정                                 |
| `min`             | `number \| string`                               | `0`                       | 다중 선택 시 최소 선택 개수                         |
| `max`             | `number \| string`                               | `Number.MAX_SAFE_INTEGER` | 다중 선택 시 최대 선택 개수                         |
| `closableChips`   | `boolean`                                        | `false`                   | 다중 선택 시 칩에 닫기 버튼 표시                    |
| `collapseChips`   | `boolean`                                        | `false`                   | 다중 선택 시 칩을 축약하여 표시                     |
| `multiple`        | `boolean`                                        | `false`                   | 다중 선택 모드 활성화                               |
| `noClear`         | `boolean`                                        | `false`                   | 선택 해제(clear) 버튼 숨기기                        |
| `optionsDisabled` | `boolean \| (option, index, options) => boolean` | `false`                   | 특정 옵션을 비활성화하는 함수 또는 boolean          |
| `search`          | `SearchProps`                                    | `false`                   | 검색 기능 활성화 및 옵션                            |
| `selectAll`       | `boolean`                                        | `false`                   | 전체 선택 체크박스 표시 (다중 선택 모드에서만 동작) |
| `modelValue`      | `any \| any[]`                                   | `null`                    | v-model 바인딩 값                                   |

## Types

```typescript
interface VsSelectStyleSet {
    variables?: {
        height?: string;
        focused?: {
            border?: string;
            borderRadius?: string;
            backgroundColor?: string;
        };
    };
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
    chip?: VsChipStyleSet;
    selectAllCheckbox?: VsCheckboxStyleSet;
    options?: VsGroupedListStyleSet;
    option?: CSSProperties;
    selectedOption?: CSSProperties;
}
```

## StyleSet 사용 예시

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        :style-set="{
            variables: {
                height: '3rem',
                focused: {
                    border: '2px solid #2196f3',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                },
            },
            component: {
                fontSize: '1rem',
            },
            selectedOption: {
                backgroundColor: '#e3f2fd',
                fontWeight: 700,
            },
        }"
    />
</template>
```

## Slots

| Slot             | Props                                      | Description                             |
| ---------------- | ------------------------------------------ | --------------------------------------- |
| `default`        | -                                          | 선택 컴포넌트 외부 래퍼에 표시할 콘텐츠 |
| `label`          | -                                          | 입력 래퍼의 라벨 영역                   |
| `option`         | `{ id, label, value, disabled, selected }` | 각 옵션의 커스텀 템플릿                 |
| `group`          | `{ groupName }`                            | 그룹 헤더의 커스텀 템플릿               |
| `options-header` | -                                          | 옵션 목록 상단에 표시할 헤더            |
| `options-footer` | -                                          | 옵션 목록 하단에 표시할 푸터            |
| `messages`       | -                                          | 하단 메시지 영역                        |

## Events

| Event               | Type           | Description                   |
| ------------------- | -------------- | ----------------------------- |
| `update:modelValue` | `any \| any[]` | v-model 값 변경 시            |
| `update:changed`    | `boolean`      | 변경 상태 업데이트            |
| `update:valid`      | `boolean`      | 유효성 상태 업데이트          |
| `change`            | `any \| any[]` | 선택 값 변경 시               |
| `click-option`      | `OptionItem`   | 옵션 클릭 시                  |
| `open`              | -              | 옵션 목록 열릴 때             |
| `close`             | -              | 옵션 목록 닫힐 때             |
| `clear`             | -              | 선택 해제 버튼 클릭 시        |
| `focus`             | `FocusEvent`   | 트리거에 포커스될 때          |
| `blur`              | `FocusEvent`   | 트리거에서 포커스가 벗어날 때 |

## Exposed Methods

| Method     | Type            | Description                           |
| ---------- | --------------- | ------------------------------------- |
| `validate` | `() => boolean` | 현재 값의 유효성을 검증하고 결과 반환 |
| `clear`    | `() => void`    | 선택된 값 모두 해제                   |
| `focus`    | `() => void`    | 트리거에 포커스 설정                  |
| `blur`     | `() => void`    | 트리거에서 포커스 해제                |

---

## 특징

- **단일/다중 선택**: 단일 값 또는 배열로 여러 값 선택 가능
- **v-model 지원**: 양방향 데이터 바인딩
- **검색 기능**: 옵션 목록에서 실시간 검색 지원
- **전체 선택**: 다중 선택 모드에서 모든 옵션 선택/해제
- **그룹화**: 옵션을 카테고리별로 그룹화하여 표시
- **옵션 비활성화**: 특정 옵션을 선택 불가능하게 설정
- **선택 개수 제한**: min/max props로 선택 가능한 항목 수 제한
- **칩 표시**: 다중 선택 시 선택된 항목을 칩으로 표시
- **키보드 내비게이션**: 화살표 키, Enter, Space, Escape 등 키보드 지원
- **커스터마이징**: styleSet prop과 슬롯으로 세밀한 커스터마이징 가능
- **유효성 검증**: required, min, max 등 내장 검증 규칙 지원
