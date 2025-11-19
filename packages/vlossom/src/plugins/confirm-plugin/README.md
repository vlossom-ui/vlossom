# Confirm Plugin

확인(Confirm) 다이얼로그를 간단하게 띄우고 결과를 `Promise<boolean>`으로 받을 수 있는 플러그인입니다. 내부적으로 `modal-plugin`을 사용하여 컴포넌트를 렌더링합니다.

## 사용 방법

Confirm 플러그인은 `useVlossom()` 훅을 통해 접근합니다.

```ts
import { useVlossom } from '@/framework';

const $vs = useVlossom();
const result = await $vs.confirm.open('정말로 삭제하시겠습니까?');
```

## API

### open(content, options?)

확인 다이얼로그를 표시하고 사용자의 응답을 반환합니다.

**파라미터**

- `content`: `string | Component` – 다이얼로그 본문에 표시할 내용
- `options`: `ConfirmModalOptions` – 다이얼로그 옵션 (선택)

**반환값**

- `Promise<boolean>` – 확인 버튼을 누르면 `true`, 취소 버튼이나 닫힘 동작이면 `false`

**예시**

```ts
const confirmed = await $vs.confirm.open('정말 진행하시겠습니까?', {
    colorScheme: 'red',
    okText: '진행',
    cancelText: '취소',
    swapButtons: true,
});

if (confirmed) {
    // 확인 로직
} else {
    // 취소 로직
}
```

## Types

```ts
interface ConfirmModalOptions {
    container?: string;
    callbacks?: OverlayCallbacks;
    dimClose?: boolean;
    dimmed?: boolean;
    escClose?: boolean;
    focusLock?: boolean;
    hideScroll?: boolean;
    id?: string;
    initialFocusRef?: Record<string, any>;
    scrollLock?: boolean;
    size?: SizeProp | { width?: SizeProp; height?: SizeProp };

    colorScheme?: ColorScheme;
    styleSet?: string | VsConfirmStyleSet;
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}
```

## 사용 예시

```vue
<template>
    <vs-button @click="handleConfirm">삭제</vs-button>
</template>

<script setup lang="ts">
import { useVlossom } from '@/framework';

const $vs = useVlossom();

async function handleConfirm() {
    const confirmed = await $vs.confirm.open('이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?', {
        colorScheme: 'red',
        okText: '삭제',
        cancelText: '취소',
    });

    if (confirmed) {
        console.log('삭제 실행');
    }
}
</script>
```
