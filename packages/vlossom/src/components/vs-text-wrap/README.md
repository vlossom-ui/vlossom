# VsTextWrap

텍스트를 감싸고 복사/링크 기능을 제공하는 컴포넌트입니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 텍스트 랩

```html
<template>
    <vs-text-wrap>텍스트 내용</vs-text-wrap>
</template>
```

### 복사 기능이 있는 텍스트 랩

```html
<template>
    <vs-text-wrap copy @copied="handleCopied">
        복사할 수 있는 텍스트
    </vs-text-wrap>
</template>

<script setup lang="ts">
function handleCopied(text: string) {
    console.log('복사된 텍스트:', text);
}
</script>
```

### 링크 기능이 있는 텍스트 랩

```html
<template>
    <vs-text-wrap link="https://example.com">
        https://example.com
    </vs-text-wrap>
</template>
```

### 커스텀 액션 버튼 추가

```html
<template>
    <vs-text-wrap copy>
        텍스트 내용
        <template #actions>
            <button @click="handleCustomAction">
                <svg><!-- 커스텀 아이콘 --></svg>
            </button>
        </template>
    </vs-text-wrap>
</template>
```

### 텍스트 내용에 접근하기

ref를 통해 컴포넌트의 `contentText` 값에 접근할 수 있습니다. 이를 활용하여 툴팁이나 다른 UI 요소와 연계할 수 있습니다.

```html
<template>
    <vs-tooltip :content="textContent">
        <vs-text-wrap ref="textWrapRef" copy width="200px">
            This is a very long text that will be truncated with ellipsis
        </vs-text-wrap>
    </vs-tooltip>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const textWrapRef = ref();
const textContent = computed(() => textWrapRef.value?.contentText || '');
</script>
```

### StyleSet 사용 예시

styleSet을 통한 스타일 커스터마이징:

```html
<template>
    <vs-text-wrap
        copy
        link="https://example.com"
        :style-set="{
            variables: {
                width: '500px',
            },
            copyIcon: {
                width: '1.5rem',
                height: '1.5rem',
                color: '#ff5722',
            },
            linkIcon: {
                width: '1.5rem',
                height: '1.5rem',
                color: '#2196f3',
            },
        }"
    >
        커스텀 스타일이 적용된 텍스트
    </vs-text-wrap>
</template>
```

**참고**: `width`는 prop으로도 설정할 수 있으며, prop으로 설정한 값이 styleSet보다 우선순위가 높습니다.

```html
<template>
    <!-- width prop 사용 (styleSet보다 우선) -->
    <vs-text-wrap
        width="300px"
        :style-set="{
            variables: {
                width: '500px',
            },
        }"
    >
        실제 너비는 300px이 적용됩니다 (prop이 우선)
    </vs-text-wrap>
</template>
```

## Props

| Prop       | Type                           | Default | Required | Description                           |
| ---------- | ------------------------------ | ------- | -------- | ------------------------------------- |
| `styleSet` | `string \| VsTextWrapStyleSet` | -       | -        | 커스텀 스타일 설정 객체               |
| `copy`     | `boolean`                      | `false` | -        | 복사 버튼 표시 여부                   |
| `link`     | `string`                       | `''`    | -        | 링크 URL (값이 있으면 링크 버튼 표시) |
| `width`    | `string \| number`             | `''`    | -        | 텍스트 컨텐츠의 너비                  |

## Types

```typescript
interface VsTextWrapStyleSet {
    variables?: {
        width?: string | number;
    };
    copyIcon?: CSSProperties;
    linkIcon?: CSSProperties;
}
```

## Slots

| Slot      | Props | Description                                   |
| --------- | ----- | --------------------------------------------- |
| `default` | -     | 표시할 텍스트 컨텐츠                          |
| `actions` | -     | 버튼 영역에 커스텀 액션을 추가할 수 있는 슬롯 |

## Events

| Event    | Description                  | Payload        |
| -------- | ---------------------------- | -------------- |
| `copied` | 복사 버튼을 클릭했을 때 발생 | `text: string` |

## 특징

- **복사 기능**: `copy` prop으로 복사 버튼 활성화. HTML 태그는 제거하고 순수 텍스트만 복사됩니다.
- **링크 기능**: `link` prop으로 링크 버튼 활성화. 클릭 시 새 탭에서 URL이 열립니다.
- **아이콘 스타일링**: `styleSet`의 `copyIcon`, `linkIcon` 속성을 통해 복사/링크 아이콘의 색상, 크기를 개별적으로 커스터마이징할 수 있습니다.
- **너비 조절**: `width` prop으로 텍스트 영역의 너비를 설정하며, 긴 텍스트는 ellipsis로 표시됩니다.
- **복사 피드백**: 복사 성공 시 2초간 체크 아이콘으로 변경되어 시각적 피드백을 제공합니다.
