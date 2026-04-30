> For English documentation, see [README.md](./README.md).

# Modal 플러그인

**사용 가능 버전**: 2.0.0+

모달 대화상자를 프로그래밍 방식으로 열고 관리합니다. 문자열 또는 Vue 컴포넌트를 모달 콘텐츠로 마운트하고, 커스텀 콜백, 키보드 처리, 다중 모달 스태킹을 지원합니다.

## 기능

- 문자열 또는 Vue 컴포넌트 콘텐츠로 모달을 엽니다
- 이벤트(예: 버튼 클릭, 키보드 단축키)에 대한 커스텀 콜백을 지원합니다
- 동일하거나 다른 컨테이너 내에 여러 모달을 스택할 수 있습니다
- 이벤트 emit, 특정 모달 닫기, 모든 모달 닫기를 위한 명령형 API를 제공합니다
- 오버레이 동작 구성 가능: 딤, 딤 닫기, 포커스 잠금, 스크롤 숨기기, 크기 설정
- Alert, Confirm, Prompt 플러그인이 모두 이 플러그인 위에 구축됩니다

## 기본 사용법

컴포넌트에서 `$vsModal`을 inject하고 `open`을 호출합니다:

```html
<template>
    <vs-button @click="openModal">모달 열기</vs-button>
</template>

<script setup>
import { inject } from 'vue';

const $vsModal = inject('$vsModal');

function openModal() {
    const modalId = $vsModal.open('모달에서 안녕하세요!', {
        dimClose: true,
        size: 'sm',
    });
}
</script>
```

### Vue 컴포넌트를 콘텐츠로 사용

```html
<script setup>
import { inject } from 'vue';
import MyModalContent from './MyModalContent.vue';

const $vsModal = inject('$vsModal');

function openModal() {
    const modalId = $vsModal.open(MyModalContent, {
        callbacks: {
            'modal-submit': (data) => {
                console.log('제출됨:', data);
                $vsModal.close();
            },
        },
    });
}
</script>
```

### ID로 모달 닫기

```html
<script setup>
import { inject } from 'vue';

const $vsModal = inject('$vsModal');
let currentModalId = null;

function openModal() {
    currentModalId = $vsModal.open('확실합니까?', {
        dimmed: true,
        escClose: true,
    });
}

function closeModal() {
    if (currentModalId) {
        $vsModal.closeWithId('body', currentModalId);
    }
}
</script>
```

## 메서드

| 메서드          | 파라미터                                                                   | 설명                                                                                                     |
| --------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `open`          | `content: string \| Component, options?: ModalOptions`      | 주어진 콘텐츠와 옵션으로 모달을 엽니다. 모달의 고유 문자열 ID를 반환합니다.                             |
| `emit`          | `eventName: string, ...args: any[]`                                        | 가장 최근에 열린 모달의 콜백 스토어에 이름이 있는 이벤트를 emit합니다.                                  |
| `emitWithId`    | `id: string, eventName: string, ...args: any[]`                            | ID로 특정 모달에 이름이 있는 이벤트를 emit합니다.                                                       |
| `close`         | `container?: string`                                                       | 주어진 컨테이너(기본값: `'body'`)에서 가장 최근에 열린 모달을 닫습니다. 실제로 닫혔는지를 `Promise<boolean>`으로 반환합니다 (`beforeClose`가 `false`를 반환하면 닫기를 취소). |
| `closeWithId`   | `container: string, id: string`                                            | 컨테이너와 ID로 특정 모달을 닫습니다. 실제로 닫혔는지를 `Promise<boolean>`으로 반환합니다.              |
| `clear`         | `container?: string`                                                       | 주어진 컨테이너(기본값: `'body'`)의 모든 모달을 닫습니다. `beforeClose`를 무시합니다.                  |

## 타입

```typescript
interface ModalOptions {
    beforeClose?: () => Promise<boolean> | boolean;
    container?: string;
    colorScheme?: ColorScheme;
    styleSet?: string | VsModalNodeStyleSet;
    callbacks?: OverlayCallbacks;
    dimClose?: boolean;
    dimmed?: boolean;
    escClose?: boolean;
    focusLock?: boolean;
    hideScroll?: boolean;
    id?: string;
    size?: SizeProp | { width?: SizeProp; height?: SizeProp };
}

interface ModalPlugin {
    open(content: string | Component, options?: ModalOptions): string;
    emit(eventName: string, ...args: any[]): void | Promise<void>;
    emitWithId(id: string, eventName: string, ...args: any[]): void | Promise<void>;
    close(container?: string): Promise<boolean>;
    closeWithId(container: string, id: string): Promise<boolean>;
    clear(container?: string): void;
}
```

### `beforeClose`로 닫기 중단

`ModalOptions`에 `beforeClose` 훅을 전달하면 ESC, 딤 클릭, `close`/`closeWithId` 호출 시 닫기를 가로챌 수 있습니다. `false`를 resolve하면 모달이 유지됩니다.

```html
<script setup>
import { inject } from 'vue';

const $vsModal = inject('$vsModal');

function openModal() {
    $vsModal.open('저장하지 않은 변경 사항이 있어요. 닫으시겠습니까?', {
        dimClose: true,
        escClose: true,
        beforeClose: async () => window.confirm('변경 사항을 버리시겠어요?'),
    });
}
</script>
```

> [!NOTE]
> `styleSet`은 `VsModalNodeStyleSet` 객체 또는 사전 등록된 스타일 세트 이름(문자열)을 허용합니다. 스타일 세트 세부 정보는 [VsModal 컴포넌트 문서](../../components/vs-modal/README.md)를 참고하세요.

## 주의사항

- `container`가 지정된 경우, 기존 position 스타일이 없으면 컨테이너 요소의 `position`이 자동으로 `relative`로 설정됩니다. 이를 통해 모달 오버레이가 올바르게 배치됩니다.
- `open`에서 반환된 모달 ID는 다중 모달 시나리오에서 `closeWithId`로 특정 모달을 닫는 데 사용할 수 있습니다.
- `emit`은 마지막으로 열린 모달을 대상으로 합니다. 여러 모달이 열려 있는 경우 정밀한 타게팅을 위해 `emitWithId`를 사용하세요.
