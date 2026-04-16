> For English documentation, see [README.md](./README.md).

# Prompt 플러그인

**사용 가능 버전**: 2.0.0+

입력 필드와 확인/취소 버튼이 있는 모달 대화상자를 표시합니다. 확인 시 입력된 값으로, 취소 시 `null`로 resolve되는 `Promise`를 반환합니다.

## 기능

- 커스텀 문자열 또는 Vue 컴포넌트 콘텐츠가 포함된 모달 오버레이를 엽니다
- 구성 가능한 입력 props가 있는 `VsInput` 필드를 렌더링합니다
- 확인(또는 Enter 키) 시 입력 값을 반환하고, 취소(또는 Escape 키) 시 `null`을 반환합니다
- resolve 전에 입력의 유효성을 검사합니다 — 유효성 검사 실패 시 모달이 열린 상태로 유지됩니다
- 커스텀 버튼 텍스트, 버튼 순서 교체, 간격 및 정렬을 지원합니다
- Modal 플러그인 기반으로 동작 — 모든 `ModalOptions`를 상속합니다

## 기본 사용법

컴포넌트에서 `$vsPrompt`를 inject하고 `open`을 호출합니다:

```html
<template>
    <vs-button @click="askName">이름 입력 요청</vs-button>
</template>

<script setup>
import { inject } from 'vue';

const $vsPrompt = inject('$vsPrompt');

async function askName() {
    const name = await $vsPrompt.open('이름을 입력해주세요:');
    if (name !== null) {
        console.log('입력된 이름:', name);
    }
}
</script>
```

### 입력 구성 및 초기값 사용

```html
<script setup>
import { inject } from 'vue';

const $vsPrompt = inject('$vsPrompt');

async function askAge() {
    const age = await $vsPrompt.open('나이를 입력해주세요:', {
        okText: '제출',
        cancelText: '건너뛰기',
        input: {
            type: 'number',
            placeholder: '예: 25',
            initialValue: 18,
        },
        styleSet: {
            buttonsAlign: 'right',
        },
    });
    console.log('나이:', age);
}
</script>
```

## 메서드

| 메서드 | 파라미터                                                                        | 설명                                                                                                                                                           |
| ------ | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open` | `content: string \| Component, options?: PromptModalOptions` | 주어진 콘텐츠와 옵션으로 프롬프트 모달을 엽니다. 확인 시 입력 값으로, 취소 시 `null`로 resolve되는 `Promise<string \| number \| null>`을 반환합니다. |

## 타입

```typescript
interface VsPromptStyleSet extends VsModalNodeStyleSet {
    input?: Omit<VsInputStyleSet, 'append' | 'prepend'>;
    buttonsGap?: string | number;
    buttonsAlign?: Alignment;
    okButton?: Omit<VsButtonStyleSet, 'loading'>;
    cancelButton?: Omit<VsButtonStyleSet, 'loading'>;
}

interface PromptModalOptions extends ModalOptions {
    styleSet?: VsPromptStyleSet;
    colorScheme?: ColorScheme;
    input?: PropsOf<VsComponent.VsInput> & { initialValue?: VsInputValueType };
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

interface PromptPlugin {
    open(content: string | Component, options?: PromptModalOptions): Promise<VsInputValueType>;
}
```

> [!NOTE]
> `VsPromptStyleSet`은 `VsModalNodeStyleSet`을 확장합니다. 사용 가능한 모달 스타일 옵션은 [VsModal 컴포넌트 문서](../../components/vs-modal/README.md)를 참고하세요.
> `PromptModalOptions`는 [Modal 플러그인](../modal-plugin/README.md)의 `ModalOptions`를 확장합니다.
> `input`은 `VsInput`에 유효한 모든 props와 함께 `initialValue`를 추가로 허용합니다.

## 주의사항

- Prompt 플러그인은 Modal 플러그인에 의존합니다. Vlossom 플러그인 설정 시 두 플러그인 모두 등록되어 있는지 확인하세요.
- 확인/Enter 시 입력의 유효성 검사가 실패하면 모달이 열린 상태로 유지되고 Promise는 아직 resolve되지 않습니다.
- Escape 키를 누르거나 모달 외부를 클릭해도(`dimClose`가 활성화된 경우) Promise가 `null`로 resolve되고 입력이 초기화됩니다.
