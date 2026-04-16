> For English documentation, see [README.md](./README.md).

# Toast 플러그인

**사용 가능 버전**: 2.0.0+

짧고 비차단적인 알림 토스트를 표시합니다. 여러 심각도 수준(info, success, warning, error), 구성 가능한 배치 및 자동 닫기 동작을 지원합니다.

## 기능

- 문자열 또는 Vue 컴포넌트 콘텐츠로 일시적인 알림을 표시합니다
- 내장 심각도 메서드: `info`, `success`, `warning`, `error` — 각각 사전 설정된 색상 스킴을 가집니다
- 배치(상단/하단), 정렬(좌/중앙/우) 및 자동 닫기 타임아웃을 구성할 수 있습니다
- `warning`과 `error`는 `console.warn` / `console.error`도 함께 호출합니다
- 외부 로깅을 위한 선택적 커스텀 logger 콜백을 지원합니다
- ID로 특정 토스트를 제거하거나 컨테이너의 모든 토스트를 지울 수 있습니다

## 기본 사용법

컴포넌트에서 `$vsToast`를 inject하고 메서드를 호출합니다:

```html
<template>
    <div class="flex gap-2">
        <vs-button @click="showInfo">정보</vs-button>
        <vs-button @click="showSuccess">성공</vs-button>
        <vs-button @click="showWarning">경고</vs-button>
        <vs-button @click="showError">오류</vs-button>
    </div>
</template>

<script setup>
import { inject } from 'vue';

const $vsToast = inject('$vsToast');

function showInfo() {
    $vsToast.info('정보 메시지입니다.');
}
function showSuccess() {
    $vsToast.success('작업이 성공적으로 완료되었습니다!');
}
function showWarning() {
    $vsToast.warning('입력을 확인해주세요.');
}
function showError() {
    $vsToast.error('문제가 발생했습니다.');
}
</script>
```

### 커스텀 옵션

```html
<script setup>
import { inject } from 'vue';

const $vsToast = inject('$vsToast');

function showCustomToast() {
    $vsToast.show('커스텀 토스트 메시지', {
        placement: 'top',
        align: 'right',
        autoClose: true,
        timeout: 3000,
        primary: true,
    });
}
</script>
```

## 메서드

| 메서드    | 파라미터                                                                   | 설명                                                                                               |
| --------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `show`    | `message: string \| Component, options?: ToastOptions`      | 주어진 콘텐츠와 옵션으로 토스트를 표시합니다.                                                      |
| `info`    | `message: string \| Component, options?: ToastOptions`      | `cyan` 색상 스킴의 토스트를 표시합니다.                                                            |
| `success` | `message: string \| Component, options?: ToastOptions`      | `green` 색상 스킴의 토스트를 표시합니다.                                                           |
| `warning` | `message: string \| Component, options?: ToastOptions`      | `yellow` 색상 스킴의 토스트를 표시하고 `console.warn`을 호출합니다.                               |
| `error`   | `message: string \| Component, options?: ToastOptions`      | `red` 색상 스킴의 토스트를 표시하고 `console.error`를 호출합니다.                                 |
| `remove`  | `container: string, id: string`                                            | 주어진 컨테이너에서 지정된 ID의 토스트를 제거합니다.                                               |
| `clear`   | `container?: string`                                                       | 주어진 컨테이너(기본값: `'body'`)의 모든 토스트를 제거합니다.                                     |

## 타입

```typescript
interface ToastOptions {
    container?: string;
    colorScheme?: ColorScheme;
    styleSet?: string | VsToastStyleSet;
    align?: Alignment;
    autoClose?: boolean;
    placement?: Exclude<Placement, 'left' | 'right'>;
    primary?: boolean;
    timeout?: number;
    logger?: (message: string | Component) => string;
}

interface ToastPlugin {
    show(message: string | Component, options?: ToastOptions): void;
    info(message: string | Component, options?: ToastOptions): void;
    success(message: string | Component, options?: ToastOptions): void;
    warning(message: string | Component, options?: ToastOptions): void;
    error(message: string | Component, options?: ToastOptions): void;
    remove(container: string, id: string): void;
    clear(container?: string): void;
}
```

> [!NOTE]
> `styleSet`은 `VsToastStyleSet` 객체 또는 사전 등록된 스타일 세트 이름(문자열)을 허용합니다. 스타일 세트 세부 정보는 [VsToast 컴포넌트 문서](../../components/vs-toast/README.md)를 참고하세요.

## 주의사항

- `container`가 지정된 경우, 기존 position 스타일이 없으면 컨테이너 요소의 `position`이 자동으로 `relative`로 설정됩니다.
- `placement` 옵션은 `'left'`나 `'right'`를 지원하지 않습니다 — `'top'`과 `'bottom'`만 유효합니다.
- `warning`과 `error`는 다른 옵션과 관계없이 토스트를 표시하는 것 외에도 항상 `console.warn` / `console.error`를 호출합니다.
