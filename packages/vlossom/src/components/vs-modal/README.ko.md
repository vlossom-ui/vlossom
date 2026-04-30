# VsModal

Vlossom 모달 플러그인을 통해 오버레이 레이어에 콘텐츠를 렌더링하는 모달 다이얼로그 컴포넌트입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- `v-model` boolean으로 제어되는 모달 다이얼로그를 열고 닫습니다.
- 설정 가능한 컨테이너 요소(기본: `body`)로 콘텐츠를 텔레포트합니다.
- 딤드 오버레이 배경, 포커스 잠금, ESC 키 닫기, 딤 클릭 닫기를 지원합니다.
- 사전 정의된 크기 키워드(`xs`, `sm`, `md`, `lg`, `xl`) 또는 커스텀 값으로 크기를 설정할 수 있습니다.
- 라이프사이클 훅을 위한 `open` 및 `close` 이벤트를 발생시킵니다.

## Basic Usage

```html
<template>
    <button @click="isOpen = true">모달 열기</button>

    <vs-modal v-model="isOpen">
        <div>
            <h2>모달 제목</h2>
            <p>모달 콘텐츠가 여기에 들어갑니다.</p>
            <button @click="isOpen = false">닫기</button>
        </div>
    </vs-modal>
</template>

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);
</script>
```

### 딤드 오버레이 사용

```html
<template>
    <vs-modal v-model="isOpen" :dimmed="true" :dim-close="true">
        <div>외부를 클릭하면 닫힙니다.</div>
    </vs-modal>
</template>
```

### 사전 정의된 크기

```html
<template>
    <vs-modal v-model="isOpen" size="lg">
        <div>큰 모달 콘텐츠.</div>
    </vs-modal>
</template>
```

### 커스텀 크기

```html
<template>
    <vs-modal v-model="isOpen" :size="{ width: '600px', height: '400px' }">
        <div>커스텀 크기 모달.</div>
    </vs-modal>
</template>
```

### 포커스 잠금 및 ESC 닫기

```html
<template>
    <vs-modal v-model="isOpen" :focus-lock="true" :esc-close="true">
        <div>ESC를 눌러 닫으세요. 포커스가 내부에 고정됩니다.</div>
    </vs-modal>
</template>
```

## Props

| Prop          | Type                                                        | Default   | Required | Description                                                                       |
| ------------- | ----------------------------------------------------------- | --------- | -------- | --------------------------------------------------------------------------------- |
| `colorScheme` | `string`                                                    | -         | -        | 모달의 색상 스킴.                                                                 |
| `styleSet`    | `string \| VsModalNodeStyleSet`                             | -         | -        | 모달 노드의 커스텀 스타일 셋.                                                     |
| `modelValue`  | `boolean`                                                   | `false`   | -        | 모달의 표시 여부를 제어합니다 (v-model).                                          |
| `beforeClose` | `() => Promise<boolean> \| boolean`                         | -         | -        | 모달이 닫히기 전에 호출되는 훅. `false`를 반환하면 닫기를 취소합니다.             |
| `container`   | `string`                                                    | `'body'`  | -        | 모달을 텔레포트할 요소의 CSS 선택자.                                              |
| `escClose`    | `boolean`                                                   | `true`    | -        | ESC 키를 누르면 모달을 닫습니다.                                                  |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string \| number \| { width?: SizeProp; height?: SizeProp }` | - | - | 사전 정의된 키워드 또는 커스텀 width/height로 모달 크기를 설정합니다. |
| `callbacks`   | `OverlayCallbacks`                                          | `{}`      | -        | 오버레이 콜백 핸들러.                                                             |
| `dimClose`    | `boolean`                                                   | `false`   | -        | 딤드 영역 클릭 시 모달을 닫습니다.                                                |
| `dimmed`      | `boolean`                                                   | `false`   | -        | 모달 뒤에 딤드 오버레이를 표시합니다.                                             |
| `focusLock`   | `boolean`                                                   | `false`   | -        | 모달이 열려 있는 동안 포커스를 내부에 고정합니다.                                 |
| `hideScroll`  | `boolean`                                                   | `false`   | -        | 모달이 열려 있을 때 컨테이너의 스크롤을 숨깁니다.                                 |
| `id`          | `string`                                                    | `''`      | -        | 모달 오버레이 인스턴스의 커스텀 ID.                                               |

## Types

```typescript
interface VsModalNodeStyleSet {
    component?: CSSProperties;
    dimmed?: VsDimmedStyleSet;
}
```

> [!NOTE]
> `dimmed`는 `VsDimmedStyleSet`을 사용합니다. 자세한 내용은 [VsDimmed README](../vs-dimmed/README.md)를 참고하세요.

### StyleSet 사용 예시

```html
<template>
    <vs-modal
        v-model="isOpen"
        :dimmed="true"
        :style-set="{
            component: {
                borderRadius: '16px',
                padding: '2rem',
                backgroundColor: '#fff',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            },
            dimmed: {
                component: { backgroundColor: 'rgba(0,0,0,0.6)' },
            },
        }"
    >
        <div>스타일 적용 모달 콘텐츠.</div>
    </vs-modal>
</template>
```

## Events

| 이벤트              | 페이로드  | 설명                                    |
| ------------------- | --------- | --------------------------------------- |
| `update:modelValue` | `boolean` | 모달 열림 상태가 변경될 때 발생합니다.  |
| `open`              | -         | 모달이 열릴 때 발생합니다.              |
| `close`             | -         | 모달이 닫힐 때 발생합니다.              |

## Slots

| 슬롯      | 설명                                       |
| --------- | ------------------------------------------ |
| `default` | 모달 다이얼로그 내부에 렌더링할 콘텐츠.    |

## Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## Caution

`VsModal`은 Vue 애플리케이션에 Vlossom 플러그인이 설치되어 있어야 합니다. 모달 콘텐츠는 `$vs.modal.open()`을 통해 마운트되고 `container` 요소로 텔레포트됩니다.
