# Prompt Plugin

Prompt Plugin은 모달 기반의 입력 다이얼로그를 손쉽게 띄우고 사용자가 입력한 값을 `Promise`로 돌려받을 수 있도록 도와주는 플러그인입니다. 내부적으로 `modal-plugin`과 `VsInput` 컴포넌트를 활용하여 입력 검증까지 한 번에 처리합니다.

## 사용 방법

Prompt 플러그인은 `useVlossom()` 훅을 통해 접근할 수 있습니다.

```ts
import { useVlossom } from '@/framework';

const $vs = useVlossom();
const value = await $vs.prompt.open('이름을 입력해주세요.');
```

## API

### open(content, options?)

입력 다이얼로그를 표시하고 사용자가 제출한 값을 반환합니다.

**파라미터**

- `content`: `string | Component` – 다이얼로그 본문에 표시할 내용
- `options`: `PromptModalOptions` – 입력 필드와 버튼, 스타일을 제어하는 옵션 (선택)

**반환값**

- `Promise<VsInputValueType | null>` – 확인 버튼을 누르면 입력 값, 취소 또는 닫힘 시 `null`. 입력 검증에 실패하면 reject 됩니다.

**예시**

```ts
try {
    const result = await $vs.prompt.open('팀 이름을 입력해주세요.', {
        inputPlaceholder: '예: Vlossom',
        inputLabel: '팀 이름',
        inputRules: [(value) => (value ? '' : '팀 이름은 필수입니다.')],
        buttonOkText: '저장',
        buttonCancelText: '나중에',
        colorScheme: 'indigo',
    });

    if (result !== null) {
        // 입력 값을 활용하는 로직
    }
} catch (error) {
    console.error('검증 오류:', error);
}
```

## Types

```ts
interface PromptModalOptions extends ModalOptions {
    styleSet?: VsPromptStyleSet;
    colorScheme?: ColorScheme;

    inputType?: VsInputType;
    inputPlaceholder?: string;
    inputRules?: Rule<VsInputValueType>[];
    inputInitialValue?: VsInputValueType;
    inputLabel?: string;
    inputMessages?: Message<VsInputValueType>[];

    buttonOkText?: string;
    buttonCancelText?: string;
    swapButtons?: boolean;
}
```

`styleSet`을 활용하면 입력 필드와 버튼의 간격, 정렬, 색상 등을 세밀하게 다듬을 수 있습니다.

## 사용 예시

```vue
<template>
    <vs-button @click="handlePrompt">프로젝트 생성</vs-button>
</template>

<script setup lang="ts">
import { useVlossom } from '@/framework';

const $vs = useVlossom();

async function handlePrompt() {
    try {
        const projectName = await $vs.prompt.open('새 프로젝트 이름을 입력해주세요.', {
            inputPlaceholder: '프로젝트 이름',
            inputLabel: '프로젝트 이름',
            inputRules: [
                (value) => (value ? '' : '프로젝트 이름은 필수입니다.'),
                (value) => {
                    if (typeof value === 'string' && value.trim().length >= 2) {
                        return '';
                    }
                    return '두 글자 이상 입력해주세요.';
                },
            ],
            buttonOkText: '생성',
            buttonCancelText: '취소',
        });

        if (projectName) {
            console.log('생성할 프로젝트:', projectName);
        }
    } catch {
        // 검증 실패 시 필요한 처리를 수행합니다.
    }
}
</script>
```
