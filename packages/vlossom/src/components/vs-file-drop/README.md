# VsFileDrop

파일을 드래그 앤 드롭하거나 클릭하여 업로드할 수 있는 파일 업로드 컴포넌트입니다. 선택된 파일은 칩(Chip) 형태로 표시되며, 개별 파일 제거가 가능합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 파일 업로드

```html
<template>
    <vs-file-drop v-model="files" placeholder="파일을 드래그하거나 클릭하여 업로드하세요" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const files = ref<File[] | null>(null);
</script>
```

### 라벨과 함께 사용

```html
<template>
    <vs-file-drop v-model="files" label="파일 첨부" placeholder="파일을 선택하세요" />
</template>
```

### 특정 파일 타입만 허용

```html
<template>
    <vs-file-drop v-model="images" accept=".png,.jpg,.jpeg,.gif" label="이미지 업로드" placeholder="이미지 파일만 업로드 가능합니다" />
</template>
```

### 파일 개수 제한

```html
<template>
    <vs-file-drop v-model="files" label="문서 업로드" placeholder="최대 5개까지 업로드 가능" :max="5" :min="1" required />
</template>
```

### 커스텀 콘텐츠 (dragging 상태 활용)

```html
<template>
    <vs-file-drop v-model="files">
        <template #default="{ dragging }">
            <div v-if="dragging" style="color: #1e88e5; font-weight: bold">여기에 파일을 놓으세요! 📁</div>
            <div v-else>파일을 드래그하거나 클릭하세요 📎</div>
        </template>
    </vs-file-drop>
</template>
```

### 비활성화 및 읽기 전용

```html
<template>
    <vs-file-drop v-model="files1" label="비활성화" disabled />
    <vs-file-drop v-model="files2" label="읽기 전용" readonly />
</template>
```

### 커스텀 스타일

```html
<template>
    <vs-file-drop
        v-model="files"
        label="스타일 커스터마이징"
        :style-set="{
            border: '2px dashed #1e88e5',
            borderRadius: '16px',
            dragBackgroundColor: '#e3f2fd',
            iconColor: '#1e88e5'
        }"
    />
</template>
```

### 유효성 검사

```html
<template>
    <vs-file-drop
        v-model="files"
        label="파일 업로드 (최소 1개, 최대 5개)"
        required
        :max="5"
        :min="1"
        :rules="[
            (v) => !v || v.every((file) => file.size <= 10 * 1024 * 1024) || '파일 크기는 10MB 이하여야 합니다'
        ]"
    />
</template>
```

### Drop 이벤트 핸들링

```html
<template>
    <vs-file-drop v-model="files" @drop="handleDrop" placeholder="파일을 드롭하면 이벤트가 발생합니다" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const files = ref<File[] | null>(null);

function handleDrop(droppedFiles: File[]) {
    console.log('드롭된 파일:', droppedFiles);
}
</script>
```

## Props

| Prop          | Type                              | Default                   | Required | Description                                        |
| ------------- | --------------------------------- | ------------------------- | -------- | -------------------------------------------------- |
| `modelValue`  | `File[] \| null`                  | `null`                    | -        | v-model 바인딩 값                                  |
| `accept`      | `string`                          | `''`                      | -        | 허용할 파일 타입 (예: `.png,.jpg,.pdf`, `image/*`) |
| `max`         | `number \| string`                | `Number.MAX_SAFE_INTEGER` | -        | 업로드 가능한 최대 파일 개수                       |
| `min`         | `number \| string`                | `Number.MIN_SAFE_INTEGER` | -        | 업로드해야 하는 최소 파일 개수                     |
| `colorScheme` | `ColorScheme`                     | -                         | -        | 컴포넌트 색상 테마                                 |
| `styleSet`    | `string \| VsFileDropStyleSet`    | -                         | -        | 커스텀 스타일 설정 객체                            |
| `disabled`    | `boolean`                         | `false`                   | -        | 파일 업로드 비활성화                               |
| `grid`        | `string \| number \| Breakpoints` | -                         | -        | 그리드 레이아웃 크기                               |
| `hidden`      | `boolean`                         | `false`                   | -        | 컴포넌트 숨김 여부                                 |
| `id`          | `string`                          | -                         | -        | input 요소의 id                                    |
| `label`       | `string`                          | -                         | -        | 라벨 텍스트                                        |
| `messages`    | `Message<FileDropValueType>[]`    | `[]`                      | -        | 메시지 표시                                        |
| `name`        | `string`                          | -                         | -        | input 요소의 name 속성                             |
| `noLabel`     | `boolean`                         | `false`                   | -        | 라벨 영역 숨김                                     |
| `noMessages`  | `boolean`                         | `false`                   | -        | 메시지 영역 숨김                                   |
| `placeholder` | `string`                          | -                         | -        | 플레이스홀더 텍스트                                |
| `readonly`    | `boolean`                         | `false`                   | -        | 읽기 전용 상태 (파일 제거 불가, 새 파일 선택 불가) |
| `required`    | `boolean`                         | `false`                   | -        | 필수 입력 여부                                     |
| `rules`       | `Rule<FileDropValueType>[]`       | `[]`                      | -        | 커스텀 검증 규칙                                   |
| `small`       | `boolean`                         | `false`                   | -        | 작은 크기                                          |
| `state`       | `UIState`                         | `'idle'`                  | -        | 입력 상태 (idle, success, info, error, warning)    |
| `width`       | `string \| number \| Breakpoints` | -                         | -        | 컴포넌트 너비                                      |
| `height`      | `string \| number \| Breakpoints` | -                         | -        | 컴포넌트 높이                                      |

## Events

| Event               | Parameters       | Description                                  |
| ------------------- | ---------------- | -------------------------------------------- |
| `update:modelValue` | `File[] \| null` | v-model 값 변경 시 발생                      |
| `update:changed`    | `File[]`         | 파일 선택 대화상자로 파일을 선택했을 때 발생 |
| `update:valid`      | `boolean`        | 검증 상태 업데이트                           |
| `drop`              | `File[]`         | 파일을 드래그 앤 드롭했을 때 발생            |

## Types

```typescript
export type FileDropValueType = File[] | null;

interface VsFileDropStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: number;
    fontColor?: string;
    fontSize?: string;
    fontWeight?: number;
    dragBackgroundColor?: string;
    height?: string | number | Breakpoints;
    iconColor?: string;

    wrapper?: VsInputWrapperStyleSet;
}
```

## Slots

| Slot       | Props                   | Description                                       |
| ---------- | ----------------------- | ------------------------------------------------- |
| `default`  | `{ dragging: boolean }` | 커스텀 콘텐츠 (dragging 상태를 slot props로 제공) |
| `label`    | -                       | 커스텀 라벨 콘텐츠                                |
| `messages` | -                       | 커스텀 메시지 콘텐츠                              |

## 특징

- **드래그 앤 드롭 지원**: 파일을 드래그하여 업로드하거나 클릭하여 파일 선택 대화상자 열기
- **다중 파일 업로드**: 여러 파일을 동시에 선택 가능
- **파일 타입 제한**: `accept` 속성으로 특정 파일 타입만 허용
- **파일 개수 제한**: `min`, `max` 속성으로 업로드 가능한 파일 개수 제한
- **개별 파일 제거**: 선택된 파일을 칩 형태로 표시하고 개별 제거 가능
- **검증 규칙**: 커스텀 검증 규칙과 기본 검증(required, min, max, accept) 지원
- **드래그 상태 감지**: 파일을 드래그하는 동안 시각적 피드백 제공
- **파일 크기 표시**: 선택된 파일의 크기를 사람이 읽기 쉬운 형식으로 표시
