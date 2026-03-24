> English: [README.md](./README.md)

# Toast Plugin

Toast 메시지를 표시하기 위한 플러그인입니다.

## 사용 방법

Toast 플러그인은 `useVlossom()`을 통해 접근할 수 있습니다.

```typescript
import { useVlossom } from '@/framework';

const $vs = useVlossom();
$vs.toast.show('토스트 메시지');
```

## API

### show(content, options?)

토스트를 표시합니다.

**파라미터:**

- `content`: `string | Component` - 표시할 내용 (문자열 또는 Vue 컴포넌트)
- `options`: `ToastOptions` - 토스트 옵션 (선택)

**예시:**

```typescript
// 문자열 토스트
$vs.toast.show('안녕하세요');

// 컴포넌트 토스트
$vs.toast.show(MyComponent, { placement: 'middle', align: 'center' });

// 컨테이너 지정
$vs.toast.show('메시지', { container: '#my-container' });
```

### info(content, options?)

정보 토스트를 표시합니다 (cyan 색상).

```typescript
$vs.toast.info('정보 메시지');
```

### success(content, options?)

성공 토스트를 표시합니다 (green 색상).

```typescript
$vs.toast.success('성공 메시지');
```

### warning(content, options?)

경고 토스트를 표시합니다 (yellow 색상).

```typescript
$vs.toast.warning('경고 메시지');
```

### error(content, options?)

에러 토스트를 표시합니다 (red 색상).

```typescript
$vs.toast.error('에러 메시지');
```

### remove(container, id)

특정 토스트를 제거합니다.

**파라미터:**

- `container`: `string` - 컨테이너 선택자
- `id`: `string` - 토스트 ID

```typescript
$vs.toast.remove('body', 'toast-id-123');
```

### clear(container?)

컨테이너의 모든 토스트를 제거합니다.

**파라미터:**

- `container`: `string` - 컨테이너 선택자 (기본값: `'body'`)

```typescript
// body의 모든 토스트 제거
$vs.toast.clear();

// 특정 컨테이너의 모든 토스트 제거
$vs.toast.clear('#my-container');
```

## Types

```typescript
interface ToastOptions {
    container?: string;
    colorScheme?: ColorScheme;
    styleSet?: string | VsToastStyleSet;
    align?: Alignment;
    autoClose?: boolean;
    placement?: 'top' | 'middle' | 'bottom';
    primary?: boolean;
    timeout?: number;
    logger?: (message: string | Component) => string;
}
```

## 사용 예시

```vue
<template>
    <div>
        <vs-button @click="showToast">토스트 표시</vs-button>
        <vs-button @click="showPrimaryToast">Primary 토스트</vs-button>
        <vs-button @click="showErrorToast">에러 토스트</vs-button>
        <vs-button @click="clearToast">토스트 제거</vs-button>
        <div id="toast-wrapper"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useVlossom } from '@/framework';
import type { ToastOptions } from '@/plugins';

export default defineComponent({
    setup() {
        const $vs = useVlossom();

        function showToast() {
            $vs.toast.show('토스트 메시지', {
                placement: 'middle',
                align: 'center'
            });
        }

        function showPrimaryToast() {
            $vs.toast.show('Primary Toast', { primary: true });
        }

        function showErrorToast() {
            $vs.toast.error('에러가 발생했습니다');
        }

        function clearToast() {
            $vs.toast.clear();
        }

        return {
            showToast,
            showPrimaryToast,
            showErrorToast,
            clearToast,
        };
    },
});
</script>
```
