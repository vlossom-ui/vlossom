> For English documentation, see [README.md](./README.md).

# VsFileDrop

드래그 앤 드롭 및 클릭하여 파일 선택을 모두 지원하는 파일 입력 컴포넌트로, 유효성 검사, 다중 파일 지원, 폼 통합을 제공합니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 드래그 앤 드롭 및 클릭하여 파일 선택
- 다중 파일 선택 지원
- 파일 타입(`accept`), 개수(`min`/`max`) 내장 유효성 검사
- 선택된 파일을 제거 가능한 칩으로 표시
- 폼 수준의 유효성 검사 및 상태 관리를 위한 `VsForm` 통합
- `VsInputWrapper`를 통한 레이블, 메시지, 비활성화/읽기 전용 상태

## 기본 사용법

```html
<template>
    <vs-file-drop v-model="files" label="파일 업로드" />
</template>

<script setup>
import { ref } from 'vue';
const files = ref([]);
</script>
```

### 파일 타입 필터와 함께 다중 파일

```html
<template>
    <vs-file-drop
        v-model="files"
        label="이미지 업로드"
        multiple
        accept="image/*"
        :max="5"
        placeholder="이미지를 여기에 드롭하거나 클릭하여 선택"
    />
</template>

<script setup>
import { ref } from 'vue';
const files = ref([]);
</script>
```

### 유효성 검사 메시지 포함

```html
<template>
    <vs-file-drop
        v-model="files"
        label="문서"
        required
        :messages="[{ state: 'info', text: 'PDF 파일만 허용됩니다' }]"
        accept=".pdf"
    />
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트의 색상 스킴 |
| `styleSet` | `string \| VsFileDropStyleSet` | | | 컴포넌트의 사용자 정의 스타일 셋 |
| `disabled` | `boolean` | `false` | | 파일 드롭 영역 비활성화 |
| `hidden` | `boolean` | `false` | | 컴포넌트 숨기기 |
| `id` | `string` | `''` | | HTML id 속성 |
| `label` | `string` | `''` | | 파일 드롭 영역 위에 표시되는 레이블 텍스트 |
| `noLabel` | `boolean` | `false` | | 레이블 숨기기 |
| `noMessages` | `boolean` | `false` | | 메시지 영역 숨기기 |
| `required` | `boolean` | `false` | | 필수 필드로 표시 |
| `messages` | `Message[]` | `[]` | | 표시할 상태 메시지 |
| `name` | `string` | `''` | | 입력의 HTML name 속성 |
| `noDefaultRules` | `boolean` | `false` | | 기본 유효성 검사 규칙 비활성화 |
| `placeholder` | `string` | `''` | | 드롭 영역에 표시되는 플레이스홀더 텍스트 |
| `readonly` | `boolean` | `false` | | 컴포넌트를 읽기 전용으로 만들기 |
| `rules` | `Rule[]` | `[]` | | 사용자 정의 유효성 검사 규칙 |
| `state` | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'idle'` | | 현재 유효성 검사 상태 |
| `width` | `string \| number \| Breakpoints` | | | 컴포넌트 너비 |
| `grid` | `string \| number \| Breakpoints` | | | 그리드 열 범위 |
| `accept` | `string` | `''` | | 허용되는 파일 타입 (예: `image/*`, `.pdf`) |
| `height` | `string \| number \| Breakpoints` | `'auto'` | | 드롭 영역 높이 |
| `noClear` | `boolean` | `false` | | 지우기 버튼 숨기기 |
| `multiple` | `boolean` | `false` | | 다중 파일 선택 허용 |
| `min` | `number \| string` | `0` | | 필요한 최소 파일 수 |
| `max` | `number \| string` | `Number.MAX_SAFE_INTEGER` | | 허용되는 최대 파일 수 |
| `modelValue` | `File[]` | `[]` | | 선택된 파일의 v-model 바인딩 |

## 타입

```typescript
interface VsFileDropStyleSet {
    variables?: {
        dragBackgroundColor?: string;
        iconColor?: string;
    };
    component?: CSSProperties;
    placeholder?: CSSProperties;
    files?: CSSProperties;
    closeButton?: CSSProperties;
    chip?: VsChipStyleSet;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
> `chip`은 [VsChipStyleSet](../vs-chip/README.md)을, `wrapper`는 [VsInputWrapperStyleSet](../vs-input-wrapper/README.md)을 사용합니다.

### StyleSet 예시

```html
<template>
    <vs-file-drop
        v-model="files"
        label="업로드"
        :style-set="{
            variables: { dragBackgroundColor: '#e8f4fd', iconColor: '#0066cc' },
            component: { borderRadius: '12px' },
            placeholder: { color: '#666' },
        }"
    />
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `update:modelValue` | `File[]` | 선택된 파일이 변경될 때 발생 |
| `update:changed` | `File[]` | 파일이 변경될 때 발생 |
| `update:valid` | `boolean` | 유효성 검사 상태가 변경될 때 발생 |
| `change` | `File[]` | 파일 선택이 변경될 때 발생 |
| `drop` | `File[]` | 파일이 드롭될 때 발생 |
| `focus` | `FocusEvent` | 파일 드롭 영역이 포커스를 받을 때 발생 |
| `blur` | `FocusEvent` | 파일 드롭 영역이 포커스를 잃을 때 발생 |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 드롭 영역의 사용자 정의 콘텐츠. 슬롯 props로 `{ dragging: boolean }` 제공 |
| `label` | 사용자 정의 레이블 콘텐츠 |
| `messages` | 사용자 정의 메시지 콘텐츠 |

## 메서드

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
| `focus` | - | 파일 입력에 포커스 설정 |
| `blur` | - | 파일 입력에서 포커스 제거 |
| `validate` | - | 유효성 검사를 트리거하고 결과 반환 |
| `clear` | - | 선택된 파일 지우기 |
