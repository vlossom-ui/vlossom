> For English documentation, see [README.md](./README.md).

# VsAccordion

클릭 또는 키보드 조작으로 내용을 펼치거나 접을 수 있는 아코디언 컴포넌트입니다.

**Available Version**: 2.0.0+

## Feature

- 타이틀 영역 클릭 또는 Enter/Space 키 입력으로 열기/닫기 전환
- `v-model` 바인딩을 통해 외부에서 열림 상태 제어 및 감지 가능
- 키보드 접근성 완전 지원 — Enter, Space 키로 조작 가능
- `width`, `grid` prop을 통한 반응형 너비 제어
- CSS 변수(`arrowColor`, `arrowSize`, `arrowSpacing`)를 통해 화살표 인디케이터 커스터마이징 가능

## Basic Usage

```html
<template>
    <vs-accordion>
        <template #title>섹션 타이틀</template>
        아코디언 내용입니다.
    </vs-accordion>
</template>
```

### v-model 사용

```html
<template>
    <vs-accordion v-model="isOpen">
        <template #title>제어 가능한 아코디언</template>
        isOpen이 true일 때 내용이 표시됩니다.
    </vs-accordion>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### Primary 스타일

```html
<template>
    <vs-accordion primary>
        <template #title>Primary 아코디언</template>
        타이틀 바에 primary 색상 테마가 적용됩니다.
    </vs-accordion>
</template>
```

### 비활성화

```html
<template>
    <vs-accordion disabled>
        <template #title>비활성화된 아코디언</template>
        이 아코디언은 토글할 수 없습니다.
    </vs-accordion>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | 컴포넌트 색상 테마 |
| `styleSet` | `string \| VsAccordionStyleSet` | | | 커스텀 스타일 세트 |
| `width` | `string \| number \| Breakpoints` | | | 컴포넌트 너비 |
| `grid` | `string \| number \| Breakpoints` | | | 그리드 컬럼 스팬 |
| `disabled` | `boolean` | `false` | | 토글 비활성화 |
| `open` | `boolean` | `false` | | 초기 열림 상태 |
| `primary` | `boolean` | `false` | | Primary 색상 테마 적용 |
| `modelValue` | `boolean` | `false` | | 열림 상태에 대한 v-model 바인딩 |

## Types

```typescript
interface VsAccordionStyleSet {
    variables?: {
        arrowColor?: string;
        arrowSize?: string;
        arrowSpacing?: string;
        border?: string;
    };
    component?: CSSProperties;
    title?: CSSProperties;
    content?: VsExpandableStyleSet;
}
```

> [!NOTE]
> `content`는 `VsExpandableStyleSet`을 사용합니다. 자세한 내용은 [VsExpandable 문서](../vs-expandable/README.md)를 참고하세요.

### StyleSet 사용 예시

```html
<template>
    <vs-accordion
        :style-set="{
            variables: {
                arrowColor: '#6200ea',
                arrowSize: '0.5rem',
                arrowSpacing: '4%',
                border: '2px solid #6200ea',
            },
            component: { borderRadius: '0.75rem' },
            title: { fontWeight: 'bold', padding: '1rem' },
        }"
    >
        <template #title>커스텀 스타일 아코디언</template>
        내용이 들어갑니다.
    </vs-accordion>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `boolean` | 열림 상태가 변경될 때 발생 |
| `toggle` | `boolean` | 토글 후 발생; 페이로드는 새로운 열림 상태 |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | 접히는 메인 콘텐츠 |
| `title` | 타이틀 바 안에 렌더링되는 콘텐츠 |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `toggle` | — | 아코디언의 열림/닫힘 상태를 전환합니다 |

## Caution

- `open`과 `v-model`을 동시에 사용하는 것은 권장하지 않습니다. 반응성 업데이트 시 `v-model`이 우선합니다.
