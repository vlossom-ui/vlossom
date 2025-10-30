# VsTextarea

여러 줄의 텍스트를 입력할 수 있는 텍스트 영역 컴포넌트입니다. `v-model`을 지원하며, 키보드 접근성과 유효성 검사를 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 Textarea

```html
<template>
    <vs-textarea v-model="description" label="설명" placeholder="내용을 입력하세요..." />
</template>

<script setup>
import { ref } from 'vue';
const description = ref('');
</script>
```

### Required Textarea

```html
<template>
    <vs-textarea
        v-model="content"
        label="필수 입력 항목"
        placeholder="이 항목은 필수입니다"
        required
    />
</template>

<script setup>
import { ref } from 'vue';
const content = ref('');
</script>
```

### Disabled & Readonly

```html
<template>
    <vs-textarea v-model="disabledText" label="비활성화" disabled />

    <vs-textarea v-model="readonlyText" label="읽기 전용" readonly />
</template>

<script setup>
import { ref } from 'vue';
const disabledText = ref('비활성화된 내용');
const readonlyText = ref('읽기 전용 내용');
</script>
```

### String Modifiers

v-model에 modifiers를 사용하여 입력값을 자동으로 변환할 수 있습니다.

```html
<template>
    <vs-textarea v-model.upper="upperText" label="대문자로 변환" />
    <vs-textarea v-model.lower="lowerText" label="소문자로 변환" />
    <vs-textarea v-model.capitalize="capitalizeText" label="첫 글자만 대문자로" />
</template>

<script setup>
import { ref } from 'vue';
const upperText = ref('');
const lowerText = ref('');
const capitalizeText = ref('');
</script>
```

### Max/Min Length

```html
<template>
    <vs-textarea v-model="limitedText" label="글자 수 제한" :min="10" :max="100" />
</template>

<script setup>
import { ref } from 'vue';
const limitedText = ref('');
</script>
```

### Custom Validation Rules

```html
<template>
    <vs-textarea v-model="text" label="금지어 검사" :rules="[noSwearWords]" />
</template>

<script setup>
import { ref } from 'vue';
const text = ref('');

function noSwearWords(value: string) {
    const swearWords = ['금지어1', '금지어2'];
    if (swearWords.some((word) => value.includes(word))) {
        return '금지어가 포함되어 있습니다';
    }
    return '';
}
</script>
```

## Props

| Prop           | Type                                                       | Default                 | Description             |
| -------------- | ---------------------------------------------------------- | ----------------------- | ----------------------- |
| modelValue     | string                                                     | ''                      | textarea의 값 (v-model) |
| label          | string                                                     | -                       | textarea의 레이블       |
| placeholder    | string                                                     | -                       | placeholder 텍스트      |
| disabled       | boolean                                                    | false                   | 비활성화 여부           |
| readonly       | boolean                                                    | false                   | 읽기 전용 여부          |
| required       | boolean                                                    | false                   | 필수 입력 여부          |
| hidden         | boolean                                                    | false                   | 숨김 여부               |
| small          | boolean                                                    | false                   | 작은 크기 여부          |
| colorScheme    | string                                                     | -                       | 색상 테마               |
| styleSet       | VsTextareaStyleSet                                         | -                       | 커스텀 스타일 객체      |
| max            | number \| string                                           | Number.MAX_SAFE_INTEGER | 최대 글자 수            |
| min            | number \| string                                           | Number.MIN_SAFE_INTEGER | 최소 글자 수            |
| rules          | Array<(value: string) => string>                           | []                      | 커스텀 검증 규칙 배열   |
| noDefaultRules | boolean                                                    | false                   | 기본 검증 규칙 비활성화 |
| messages       | Array<{ state: string, text: string }>                     | []                      | 메시지 배열             |
| noMessages     | boolean                                                    | false                   | 메시지 영역 숨김        |
| noLabel        | boolean                                                    | false                   | 라벨 숨김               |
| state          | 'idle' \| 'success' \| 'error' \| 'info' \| 'warning'      | -                       | textarea 상태           |
| id             | string                                                     | -                       | textarea ID             |
| name           | string                                                     | -                       | textarea name 속성      |
| width          | string \| number \| Breakpoints                            | -                       | textarea 너비           |
| grid           | string \| number \| Breakpoints                            | -                       | Grid 설정               |
| autocomplete   | boolean                                                    | false                   | 자동완성 활성화         |
| modelModifiers | { capitalize?: boolean, upper?: boolean, lower?: boolean } | {}                      | v-model modifiers       |

## Events

| Event             | Payload | Description          |
| ----------------- | ------- | -------------------- |
| update:modelValue | string  | 값이 변경될 때 발생  |
| update:changed    | boolean | 변경 상태 업데이트   |
| update:valid      | boolean | 유효성 상태 업데이트 |
| change            | string  | 변경 이벤트          |

## Methods

| Method     | Return Type | Description                    |
| ---------- | ----------- | ------------------------------ |
| focus()    | void        | textarea에 포커스를 줍니다     |
| blur()     | void        | textarea의 포커스를 제거합니다 |
| select()   | void        | textarea의 텍스트를 선택합니다 |
| clear()    | void        | textarea의 값을 초기화합니다   |
| validate() | boolean     | 유효성 검사를 수행합니다       |

## Slots

| Slot     | Description                              |
| -------- | ---------------------------------------- |
| label    | 레이블 영역을 커스터마이징할 수 있습니다 |
| messages | 메시지 영역을 커스터마이징할 수 있습니다 |

## 스타일 커스터마이징

VsTextarea는 StyleSet을 통해 스타일을 커스터마이징할 수 있습니다.

```typescript
import { useVlossom } from 'vlossom';

const vlossom = useVlossom();
vlossom.styleSet = {
    customTextarea: {
        VsTextarea: {
            backgroundColor: '#f5f5f5',
            border: '2px solid #ccc',
            borderRadius: '8px',
            fontColor: '#333',
            fontSize: '1rem',
            height: '8rem',
            padding: '0.75rem 1rem',
        },
    },
};
```

```html
<vs-textarea style-set="customTextarea" />
```

### Available Style Properties

- backgroundColor: string
- border: string
- borderRadius: string
- fontColor: string
- fontSize: string
- fontWeight: string | number
- height: string
- padding: string
- width: string
