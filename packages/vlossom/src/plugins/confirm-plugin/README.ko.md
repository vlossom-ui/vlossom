> For English documentation, see [README.md](./README.md).

# Confirm 플러그인

**사용 가능 버전**: 2.0.0+

확인 및 취소 버튼이 있는 모달 확인 대화상자를 표시합니다. 사용자가 확인하면 `true`로, 취소하면 `false`로 resolve되는 `Promise<boolean>`을 반환합니다.

## 기능

- 커스텀 문자열 또는 Vue 컴포넌트 콘텐츠가 포함된 모달 오버레이를 엽니다
- 레이블과 스타일을 구성할 수 있는 확인 및 취소 버튼을 제공합니다
- 확인(또는 Enter 키) 시 `true`, 취소(또는 Escape 키) 시 `false`로 resolve됩니다
- `swapButtons`를 통해 버튼 순서를 교체할 수 있습니다
- 커스텀 버튼 간격 및 정렬을 지원합니다
- Modal 플러그인 기반으로 동작 — 모든 `ModalOptions`를 상속합니다

## 기본 사용법

컴포넌트에서 `$vsConfirm`을 inject하고 `open`을 호출합니다:

```html
<template>
    <vs-button @click="handleDelete">항목 삭제</vs-button>
</template>

<script setup>
import { inject } from 'vue';

const $vsConfirm = inject('$vsConfirm');

async function handleDelete() {
    const confirmed = await $vsConfirm.open('이 항목을 삭제하시겠습니까?');
    if (confirmed) {
        console.log('삭제가 확인되었습니다');
    } else {
        console.log('삭제가 취소되었습니다');
    }
}
</script>
```

### 커스텀 버튼 텍스트 및 스타일

```html
<script setup>
import { inject } from 'vue';

const $vsConfirm = inject('$vsConfirm');

function handleConfirm() {
    $vsConfirm.open('계속 진행하시겠습니까?', {
        okText: '네, 진행합니다',
        cancelText: '아니오, 돌아갑니다',
        swapButtons: true,
        styleSet: {
            buttonsAlign: 'right',
            buttonsGap: '1rem',
            okButton: { variables: { padding: '0.5rem 2rem' } },
            cancelButton: { variables: { padding: '0.5rem 2rem' } },
        },
    });
}
</script>
```

## 메서드

| 메서드 | 파라미터                                                                       | 설명                                                                                                                           |
| ------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `open` | `content: string \| Component, options?: ConfirmModalOptions` | 주어진 콘텐츠와 옵션으로 확인 모달을 엽니다. 확인 시 `true`, 취소 시 `false`로 resolve되는 `Promise<boolean>`을 반환합니다. |

## 타입

```typescript
interface VsConfirmStyleSet extends VsModalNodeStyleSet {
    buttonsGap?: string | number;
    buttonsAlign?: Alignment;
    okButton?: Omit<VsButtonStyleSet, 'loading'>;
    cancelButton?: Omit<VsButtonStyleSet, 'loading'>;
}

interface ConfirmModalOptions extends ModalOptions {
    styleSet?: VsConfirmStyleSet;
    colorScheme?: ColorScheme;
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

interface ConfirmPlugin {
    open(content: string | Component, options?: ConfirmModalOptions): Promise<boolean>;
}
```

> [!NOTE]
> `VsConfirmStyleSet`은 `VsModalNodeStyleSet`을 확장합니다. 사용 가능한 모달 스타일 옵션은 [VsModal 컴포넌트 문서](../../components/vs-modal/README.md)를 참고하세요.
> `ConfirmModalOptions`는 [Modal 플러그인](../modal-plugin/README.md)의 `ModalOptions`를 확장합니다.

## 주의사항

- Confirm 플러그인은 Modal 플러그인에 의존합니다. Vlossom 플러그인 설정 시 두 플러그인 모두 등록되어 있는지 확인하세요.
- Enter 키를 누르면 Promise가 `true`로 resolve되고, Escape 키를 누르면 `false`로 resolve됩니다.
- 모달 외부를 클릭해도(`dimClose`가 활성화된 경우) `false`로 resolve됩니다.
