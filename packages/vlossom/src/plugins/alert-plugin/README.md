# Alert Plugin

단순 알림(Alert) 다이얼로그를 띄우고 사용자가 확인 버튼을 누를 때까지 대기하는 Promise 기반 플러그인입니다. 내부적으로 `modal-plugin`을 활용하여 다이얼로그를 렌더링합니다.

## 사용 방법

Alert 플러그인은 `useVlossom()` 훅을 통해 접근합니다.

```ts
import { useVlossom } from '@/framework';

const $vs = useVlossom();
await $vs.alert.open('처리가 완료되었습니다.');
```

## API

### open(content, options?)

알림 다이얼로그를 표시하고 사용자가 확인 버튼을 누를 때까지 대기합니다.

**파라미터**

- `content`: `string | Component` – 다이얼로그 본문에 표시할 내용
- `options`: `AlertModalOptions` – 다이얼로그 옵션 (선택)

**반환값**

- `Promise<void>` – 확인 버튼이나 지정된 키 입력으로 다이얼로그가 닫히면 resolve 됩니다.

**예시**

```ts
await $vs.alert.open('저장이 완료되었습니다.', {
    colorScheme: 'emerald',
    okText: '확인',
});
```

## Types

```ts
interface AlertModalOptions extends ModalOptions {
    colorScheme?: ColorScheme;
    styleSet?: string | VsAlertStyleSet;
    okText?: string;
}
```

## 사용 예시

```vue
<template>
    <vs-button @click="handleAlert">결과 확인</vs-button>
</template>

<script setup lang="ts">
import { useVlossom } from '@/framework';

const $vs = useVlossom();

async function handleAlert() {
    await $vs.alert.open('작업이 모두 완료되었습니다.', {
        colorScheme: 'indigo',
        okText: '닫기',
    });
}
</script>
```
