# VsModal & VsModalNode & VsModalView

모달 다이얼로그를 표시하는 컴포넌트 시스템입니다. `VsModal`은 v-model을 사용한 선언적 모달 컴포넌트이고, `VsModalNode`는 개별 모달 노드 컴포넌트이며, `VsModalView`는 여러 모달을 그룹화하여 렌더링하는 컨테이너 컴포넌트입니다.

**Available Version**: 2.0.0+

> **참고**: 실제 사용 예시는 `modal-plugin`을 통해 제공됩니다. 자세한 사용법은 플러그인 문서를 참고하세요.

## VsModal

v-model을 사용하여 모달의 열림/닫힘 상태를 관리하는 선언적 컴포넌트입니다.

### 기본 사용법

```html
<template>
    <!-- 기본 모달 -->
    <vs-modal v-model="isOpen" @open="handleOpen" @close="handleClose">
        <div>
            <h2>모달 제목</h2>
            <p>모달 내용</p>
        </div>

        <vs-button color-scheme="red" @click="isOpen = false">Close</vs-button>
    </vs-modal>

    <!-- dimmed 영역 클릭으로 닫기 -->
    <vs-modal v-model="isOpen" dim-close dimmed>
        <div>모달 내용</div>
    </vs-modal>

    <!-- ESC 키로 닫기 -->
    <vs-modal v-model="isOpen" esc-close>
        <div>모달 내용</div>
    </vs-modal>

    <!-- 커스텀 컨테이너 -->
    <vs-modal v-model="isOpen" container="#my-container">
        <div>모달 내용</div>
    </vs-modal>

    <!-- 커스텀 크기 -->
    <vs-modal v-model="isOpen" size="lg">
        <div>큰 모달</div>
    </vs-modal>

    <!-- 헤더/푸터 슬롯 -->
    <vs-modal v-model="isOpen">
        <template #header>
            <h2>모달 헤더</h2>
        </template>
        <div>모달 내용</div>
        <template #footer>
            <button @click="isOpen = false">닫기</button>
        </template>
    </vs-modal>
</template>
```

### Props

| Prop              | Type                                                  | Default  | Required | Description                                         |
| ----------------- | ----------------------------------------------------- | -------- | -------- | --------------------------------------------------- |
| `colorScheme`     | `string`                                              | -        | -        | 모달의 색상 테마                                    |
| `styleSet`        | `string \| VsModalNodeStyleSet`                       | -        | -        | 커스텀 스타일 설정 객체                             |
| `container`       | `string`                                              | `'body'` | -        | 모달이 렌더링될 컨테이너 선택자 (#으로 시작하는 ID) |
| `escClose`        | `boolean`                                             | `true`   | -        | ESC 키로 모달 닫기 기능 활성화 여부                 |
| `size`            | `SizeProp \| { width?: SizeProp; height?: SizeProp }` | -        | -        | 모달 크기 설정                                      |
| `callbacks`       | `OverlayCallbacks`                                    | `{}`     | -        | 오버레이 콜백 함수들                                |
| `dimClose`        | `boolean`                                             | `true`   | -        | dimmed 영역 클릭 시 모달 닫기 여부                  |
| `dimmed`          | `boolean`                                             | `false`  | -        | dimmed 배경 표시 여부                               |
| `focusLock`       | `boolean`                                             | `false`  | -        | 포커스 잠금 기능 활성화 여부                        |
| `hideScroll`      | `boolean`                                             | `false`  | -        | 스크롤바 숨기기 여부                                |
| `id`              | `string`                                              | `''`     | -        | 모달 ID                                             |
| `initialFocusRef` | `Record<string, any>`                                 | `null`   | -        | 초기 포커스 대상                                    |
| `scrollLock`      | `boolean`                                             | `false`  | -        | 스크롤 잠금 기능 활성화 여부                        |
| `modelValue`      | `boolean`                                             | `false`  | -        | 모달 열림/닫힘 상태 (v-model)                       |

### Types

```typescript
interface VsModalNodeStyleSet {
    width?: string;
    height?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: number;
    boxShadow?: string;
    fontColor?: string;
    zIndex?: string;

    dimmed?: {
        backgroundColor?: string;
        opacity?: number;
    };
    layout?: {
        header?: {
            padding?: string;
        };
        padding?: string;
        footer?: {
            padding?: string;
        };
    };
}

type SizeProp = Size | string | number;

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface OverlayCallbacks<T = void> {
    [eventName: string]: (...args: any[]) => T | Promise<T>;
}
```

### Slots

| Slot      | Description                    |
| --------- | ------------------------------ |
| `default` | 모달 내부에 표시할 콘텐츠      |
| `header`  | 모달 헤더 영역에 표시할 콘텐츠 |
| `footer`  | 모달 푸터 영역에 표시할 콘텐츠 |

### Events

| Event               | Description                                | Payload   |
| ------------------- | ------------------------------------------ | --------- |
| `update:modelValue` | 모달 열림/닫힘 상태 변경 시 발생 (v-model) | `boolean` |
| `open`              | 모달이 열릴 때 발생                        | -         |
| `close`             | 모달이 닫힐 때 발생                        | -         |

### 특징

- **v-model 지원**: `modelValue` prop을 통해 모달의 열림/닫힘 상태를 양방향 바인딩으로 관리
- **플러그인 통합**: 내부적으로 `modal-plugin`을 사용하여 모달을 표시
- **컨테이너 지정**: `container` prop으로 모달을 렌더링할 컨테이너를 지정할 수 있음
- **닫기**: `escClose`와 `dimClose` prop으로 ESC 키 및 dimmed 영역 클릭 시 자동 닫기 기능 제공

---

## VsModalNode

개별 모달 노드를 렌더링하는 컴포넌트입니다. dimmed 배경, 포커스 트랩, 스크롤 관리 등을 제공합니다.

### 기본 사용법

```html
<template>
    <vs-modal-node
        :color-scheme="colorScheme"
        :style-set="styleSet"
        :dim-close="dimClose"
        :dimmed="dimmed"
        :esc-close="escClose"
        :size="size"
        @close="handleClose"
    >
        <div>모달 내용</div>
    </vs-modal-node>
</template>
```

### Props

| Prop              | Type                                                  | Default | Required | Description                         |
| ----------------- | ----------------------------------------------------- | ------- | -------- | ----------------------------------- |
| `colorScheme`     | `string`                                              | -       | -        | 모달의 색상 테마                    |
| `styleSet`        | `string \| VsModalNodeStyleSet`                       | -       | -        | 커스텀 스타일 설정 객체             |
| `escClose`        | `boolean`                                             | `true`  | -        | ESC 키로 모달 닫기 기능 활성화 여부 |
| `size`            | `SizeProp \| { width?: SizeProp; height?: SizeProp }` | -       | -        | 모달 크기 설정                      |
| `callbacks`       | `OverlayCallbacks`                                    | `{}`    | -        | 오버레이 콜백 함수들                |
| `dimClose`        | `boolean`                                             | `false` | -        | dimmed 영역 클릭 시 모달 닫기 여부  |
| `dimmed`          | `boolean`                                             | `false` | -        | dimmed 배경 표시 여부               |
| `focusLock`       | `boolean`                                             | `false` | -        | 포커스 잠금 기능 활성화 여부        |
| `hideScroll`      | `boolean`                                             | `false` | -        | 스크롤바 숨기기 여부                |
| `id`              | `string`                                              | `''`    | -        | 모달 ID                             |
| `initialFocusRef` | `Record<string, any>`                                 | `null`  | -        | 초기 포커스 대상                    |
| `scrollLock`      | `boolean`                                             | `false` | -        | 스크롤 잠금 기능 활성화 여부        |

### Types

```typescript
interface VsModalNodeStyleSet {
    width?: string;
    height?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: number;
    boxShadow?: string;
    fontColor?: string;
    zIndex?: string;

    dimmed?: {
        backgroundColor?: string;
        opacity?: number;
    };
    layout?: {
        header?: {
            padding?: string;
        };
        padding?: string;
        footer?: {
            padding?: string;
        };
    };
}

type SizeProp = Size | string | number;

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface OverlayCallbacks<T = void> {
    [eventName: string]: (...args: any[]) => T | Promise<T>;
}
```

### Slots

| Slot      | Description                    |
| --------- | ------------------------------ |
| `default` | 모달 내부에 표시할 콘텐츠      |
| `header`  | 모달 헤더 영역에 표시할 콘텐츠 |
| `footer`  | 모달 푸터 영역에 표시할 콘텐츠 |

### Events

| Event   | Description         | Payload |
| ------- | ------------------- | ------- |
| `close` | 모달이 닫힐 때 발생 | -       |

### 특징

- **크기 설정**: `size` prop으로 모달 크기를 설정할 수 있으며, `Size` 타입(`xs`, `sm`, `md`, `lg`, `xl`) 또는 직접 크기 값(문자열, 숫자)을 지정할 수 있음
- **dimmed 배경**: `dimmed` prop으로 배경 dimmed 효과를 표시할 수 있음
- **포커스 관리**: `vs-focus-trap` 컴포넌트를 사용하여 모달 내부로 포커스를 제한
- **스크롤 관리**: `vs-inner-scroll` 컴포넌트를 사용하여 모달 내부 스크롤을 관리
- **자동 크기 계산**: `size` prop이 Size 타입일 때 미리 정의된 크기 비율을 사용하여 모달 크기를 자동 계산

---

## VsModalView

여러 모달을 그룹화하여 렌더링하는 컨테이너 컴포넌트입니다. `modal-plugin`을 통해 자동으로 마운트되며, 각 모달의 속성에 따라 적절하게 렌더링합니다.

### Props

| Prop        | Type     | Default  | Required | Description                     |
| ----------- | -------- | -------- | -------- | ------------------------------- |
| `container` | `string` | `'body'` | -        | 모달이 렌더링될 컨테이너 선택자 |

### 특징

- **자동 렌더링**: `modal-plugin`을 통해 모달이 추가되면 자동으로 렌더링
- **전환 효과**: `TransitionGroup`을 사용하여 모달 추가/제거 시 부드러운 애니메이션 적용
- **고정 위치**: `container`가 `'body'`일 때 `position: fixed` 스타일 적용
- **스크롤 잠금**: 모달의 `scrollLock` 속성이 활성화된 경우 자동으로 스크롤 잠금 처리

---

### 컴포넌트 관계

`VsModalView`는 내부적으로 `VsModalNode` 컴포넌트를 사용하여 각 모달을 렌더링합니다.
`modal-plugin`을 통해 모달을 추가하면, `VsModalView`가 자동으로 마운트되고 해당 모달이 적절한 컨테이너에 표시됩니다.

`VsModal` 컴포넌트는 v-model을 사용하여 모달의 열림/닫힘 상태를 관리하며, 내부적으로 `modal-plugin`을 사용하여 모달을 표시합니다.
