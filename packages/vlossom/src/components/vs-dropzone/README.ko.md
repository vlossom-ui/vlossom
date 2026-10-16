> For English documentation, see [README.md](./README.md).

# VsDropzone

감싼 영역 전체를 파일 드롭 영역으로 만드는 컴포넌트입니다. 값을 가지지 않고, 드래그 상태와 드롭된 파일만 알려줍니다.

**사용 가능 버전**: 2.3.0+

## 기능

- 기본 슬롯으로 감싼 영역 전체를 드롭 영역으로 사용
- 파일을 드래그하는 동안에만 영역을 덮는 오버레이 표시 (두꺼운 dashed 테두리, `radiusRatio`를 따르는 모서리)
- 텍스트나 링크가 아닌 파일 드래그에만 반응
- 자식 요소 위를 지나가도 드래그 상태가 끊기지 않음
- 중첩된 경우 가장 안쪽 dropzone만 반응

## 기본 사용법

```html live
<template>
    <vs-dropzone @drop="onDrop">
        <div style="padding: 3rem; text-align: center">파일을 이 영역에 드롭하세요</div>
    </vs-dropzone>
    <p>드롭된 파일: {{ fileNames }}</p>
</template>

<script setup>
import { ref } from 'vue';
const fileNames = ref('');
function onDrop(files) {
    fileNames.value = files.map((file) => file.name).join(', ');
}
</script>
```

### 오버레이 커스터마이징

`overlay` 슬롯으로 드래그 중에 표시할 내용을 지정합니다.

```html live
<template>
    <vs-dropzone>
        <div style="padding: 3rem">이 영역 어디에든 파일을 드롭하세요</div>

        <template #overlay>
            <strong>파일을 놓으면 업로드됩니다</strong>
        </template>
    </vs-dropzone>
</template>
```

### 모달 전체를 드롭 영역으로 사용

폼이 올라간 모달을 `VsDropzone`으로 감싸면, 폼 위 어디에 파일을 드롭해도 받을 수 있습니다.

```html live
<template>
    <vs-button @click="isOpen = true">모달 열기</vs-button>

    <vs-modal v-model="isOpen">
        <vs-dropzone @drop="(files) => (form.attachments = files)">
            <vs-form>
                <vs-input v-model="form.title" label="제목" />
                <vs-file-drop v-model="form.attachments" label="첨부 파일" multiple />
            </vs-form>

            <template #overlay>
                <strong>파일을 놓으면 첨부됩니다</strong>
            </template>
        </vs-dropzone>
    </vs-modal>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
const form = ref({ title: '', attachments: [] });
</script>
```

### 드래그 상태 사용

기본 슬롯의 `dragging` 값으로 드래그 중인 상태를 직접 표현할 수 있습니다. 기본 오버레이가 필요 없다면 `no-overlay`를 사용합니다.

```html live
<template>
    <vs-dropzone no-overlay>
        <template #default="{ dragging }">
            <div :style="{ padding: '3rem', background: dragging ? '#e8f4fd' : 'transparent' }">
                {{ dragging ? '놓으세요!' : '파일을 드래그하세요' }}
            </div>
        </template>
    </vs-dropzone>
</template>
```

## Props

| Prop          | 타입                           | 기본값  | 필수 | 설명                                         |
| ------------- | ------------------------------ | ------- | ---- | -------------------------------------------- |
| `colorScheme` | `string`                       |         |      | 기본 오버레이의 색상 스킴                    |
| `styleSet`    | `string \| VsDropzoneStyleSet` |         |      | 컴포넌트의 사용자 정의 스타일 셋             |
| `disabled`    | `boolean`                      | `false` |      | 드래그 상태 변경과 `drop` 이벤트 발생을 막음 |
| `noOverlay`   | `boolean`                      | `false` |      | 드래그 중 오버레이를 표시하지 않음           |

## 타입

```typescript
interface VsDropzoneStyleSet extends CSSProperties {
    $overlay?: CSSProperties;
}
```

### StyleSet 예시

```html live
<template>
    <vs-dropzone
        :style-set="{
            $overlay: {
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                borderColor: '#0066cc',
                borderRadius: '12px',
            },
        }"
    >
        <div style="padding: 3rem">파일을 드래그해 보세요</div>
    </vs-dropzone>
</template>
```

## 이벤트

| 이벤트            | 페이로드                            | 설명                                              |
| ----------------- | ----------------------------------- | ------------------------------------------------- |
| `drop`            | `(files: File[], event: DragEvent)` | 영역에 파일이 드롭될 때 발생                      |
| `change-dragging` | `boolean`                           | 영역 위에서 파일 드래그가 시작되거나 끝날 때 발생 |

## 슬롯

| 슬롯      | 설명                                                             |
| --------- | ---------------------------------------------------------------- |
| `default` | 드롭 영역이 될 콘텐츠. 슬롯 props로 `{ dragging: boolean }` 제공 |
| `overlay` | 드래그 중 영역을 덮는 오버레이의 콘텐츠                          |

## 메서드

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## 주의사항

- `VsDropzone`은 파일 선택 다이얼로그, `v-model`, 유효성 검사를 제공하지 않습니다. 폼 입력이 필요하면 [VsFileDrop](../vs-file-drop/README.ko.md)이나 [VsFileInput](../vs-file-input/README.ko.md)을 함께 사용하세요.
- 드롭 영역의 크기는 감싼 콘텐츠의 크기를 따릅니다. 넓은 영역을 덮으려면 콘텐츠나 `styleSet`으로 크기를 지정하세요.
- 오버레이는 `position: absolute`로 루트 요소를 덮으며, 루트 요소는 `position: relative`를 가집니다.
- 기본 오버레이의 모서리는 전역 `radiusRatio` 옵션에 따라 둥글기가 바뀝니다. 감싼 콘텐츠의 모서리와 맞추려면 `$overlay.borderRadius`를 지정하세요.
- `accept` 같은 파일 형식 필터링은 하지 않습니다. 드롭된 파일은 모두 `drop` 이벤트로 전달되므로, 형식 검사는 파일을 받는 쪽에서 처리하세요.
- 폴더를 드롭해도 폴더 내부 파일은 펼쳐지지 않습니다. 폴더 구조가 필요하면 `drop` 이벤트의 `event.dataTransfer.items`를 사용하세요.
- `disabled` 상태에서도 영역 위에 파일을 드롭했을 때 브라우저가 파일을 여는 기본 동작은 막습니다.
- 드래그 앤 드롭은 마우스 전용 동작입니다. 키보드 사용자를 위해 파일 선택 수단을 함께 제공하세요.
