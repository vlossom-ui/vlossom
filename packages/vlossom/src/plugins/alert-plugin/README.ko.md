> For English documentation, see [README.md](./README.md).

# Alert 플러그인

**사용 가능 버전**: 2.0.0+

단일 확인(OK) 버튼이 있는 모달 알림 대화상자를 표시합니다. 사용자가 대화상자를 닫으면 resolve되는 `Promise<void>`를 반환합니다.

## 기능

- 커스텀 문자열 또는 Vue 컴포넌트 콘텐츠가 포함된 모달 오버레이를 엽니다
- Promise를 resolve하는 단일 확인 버튼을 제공합니다
- 커스텀 확인 버튼 텍스트, 색상 스킴, 스타일 세트를 지원합니다
- 키보드 지원: Enter 및 Escape 키도 Promise를 resolve하고 대화상자를 닫습니다
- Modal 플러그인 기반으로 동작 — 모든 `ModalOptions`를 상속합니다

## 기본 사용법

컴포넌트에서 `$vsAlert`를 inject하고 `open`을 호출합니다:

```html
<template>
    <vs-button @click="showAlert">알림 표시</vs-button>
</template>

<script setup>
import { inject } from 'vue';

const $vsAlert = inject('$vsAlert');

async function showAlert() {
    await $vsAlert.open('알림 메시지입니다.');
    console.log('알림이 닫혔습니다');
}
</script>
```

### 커스텀 확인 텍스트 및 스타일

```html
<script setup>
import { inject } from 'vue';

const $vsAlert = inject('$vsAlert');

function showAlert() {
    $vsAlert.open('작업이 성공적으로 완료되었습니다!', {
        okText: '확인했습니다',
        colorScheme: 'green',
        styleSet: {
            buttonsAlign: 'right',
            button: {
                variables: { padding: '0.5rem 2rem' },
            },
        },
    });
}
</script>
```

## 메서드

| 메서드 | 파라미터                                                                  | 설명                                                                                                     |
| ------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `open` | `content: string \| Component, options?: AlertModalOptions` | 주어진 콘텐츠와 옵션으로 알림 모달을 엽니다. 사용자가 대화상자를 확인하면 resolve되는 `Promise<void>`를 반환합니다. |

## 타입

```typescript
interface VsAlertStyleSet extends VsModalNodeStyleSet {
    buttonsAlign?: Alignment;
    button?: Omit<VsButtonStyleSet, 'loading'>;
}

interface AlertModalOptions extends ModalOptions {
    styleSet?: VsAlertStyleSet;
    colorScheme?: ColorScheme;
    okText?: string;
}

interface AlertPlugin {
    open(content: string | Component, options?: AlertModalOptions): Promise<void>;
}
```

> [!NOTE]
> `VsAlertStyleSet`은 `VsModalNodeStyleSet`을 확장합니다. 사용 가능한 모달 스타일 옵션은 [VsModal 컴포넌트 문서](../../components/vs-modal/README.md)를 참고하세요.
> `AlertModalOptions`는 [Modal 플러그인](../modal-plugin/README.md)의 `ModalOptions`를 확장합니다.

## 주의사항

- Alert 플러그인은 Modal 플러그인에 의존합니다. Vlossom 플러그인 설정 시 두 플러그인 모두 등록되어 있는지 확인하세요.
- Escape 키를 누르거나 모달 외부를 클릭해도(`dimClose`가 활성화된 경우) Promise가 resolve되고 대화상자가 닫힙니다.
