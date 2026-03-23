# Modal Plugin

Modal을 표시하기 위한 플러그인입니다.

## 사용 방법

Modal 플러그인은 `useVlossom()`을 통해 접근할 수 있습니다.

```typescript
import { useVlossom } from '@/framework';

const $vs = useVlossom();
const modalId = $vs.modal.open('모달 내용');
```

## API

### open(content, options?)

모달을 표시합니다.

**파라미터:**

- `content`: `string | Component` - 표시할 내용 (문자열 또는 Vue 컴포넌트)
- `options`: `ModalOptions` - 모달 옵션 (선택)

**반환값:**

- `string` - 생성된 모달의 ID

**예시:**

```typescript
// 문자열 모달
const modalId = $vs.modal.open('안녕하세요');

// 컴포넌트 모달
const modalId = $vs.modal.open(MyComponent, { size: 'large' });

// 컨테이너 지정
const modalId = $vs.modal.open('메시지', { container: '#my-container' });

// 옵션 설정
const modalId = $vs.modal.open('컨텐츠', {
    dimClose: true,
    escClose: true,
    size: { width: '500px', height: '300px' },
});
```

### emit(eventName, ...args)

마지막 오버레이에 이벤트를 발생시킵니다.

**파라미터:**

- `eventName`: `string` - 이벤트 이름
- `...args`: `any[]` - 이벤트 인자

**반환값:**

- `Promise<any>` - 이벤트 핸들러의 반환값

```typescript
$vs.modal.emit('update', { data: 'value' });
```

### emitWithId(id, eventName, ...args)

특정 ID의 모달에 이벤트를 발생시킵니다.

**파라미터:**

- `id`: `string` - 모달 ID
- `eventName`: `string` - 이벤트 이름
- `...args`: `any[]` - 이벤트 인자

**반환값:**

- `Promise<any>` - 이벤트 핸들러의 반환값

```typescript
$vs.modal.emitWithId('modal-id-123', 'update', { data: 'value' });
```

### close(container?)

마지막 모달을 닫습니다.

**파라미터:**

- `container`: `string` - 컨테이너 선택자 (기본값: `'body'`)

```typescript
// body의 마지막 모달 닫기
$vs.modal.close();

// 특정 컨테이너의 마지막 모달 닫기
$vs.modal.close('#my-container');
```

### closeWithId(container, id)

특정 ID의 모달을 닫습니다.

**파라미터:**

- `container`: `string` - 컨테이너 선택자
- `id`: `string` - 모달 ID

```typescript
$vs.modal.closeWithId('body', 'modal-id-123');
```

### clear(container?)

컨테이너의 모든 모달을 제거합니다.

**파라미터:**

- `container`: `string` - 컨테이너 선택자 (기본값: `'body'`)

```typescript
// body의 모든 모달 제거
$vs.modal.clear();

// 특정 컨테이너의 모든 모달 제거
$vs.modal.clear('#my-container');
```

## Types

```typescript
interface ModalOptions {
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
```

## 사용 예시

```vue
<template>
    <div>
        <vs-button @click="showModal">모달 표시</vs-button>
        <vs-button @click="showComponentModal">컴포넌트 모달</vs-button>
        <vs-button @click="closeModal">모달 닫기</vs-button>
        <vs-button @click="clearModal">모달 모두 제거</vs-button>
        <div id="modal-wrapper"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useVlossom } from '@/framework';
import type { ModalOptions } from '@/plugins';
import MyModalComponent from './MyModalComponent.vue';

export default defineComponent({
    setup() {
        const $vs = useVlossom();
        let currentModalId = '';

        function showModal() {
            currentModalId = $vs.modal.open('모달 내용', {
                dimClose: true,
                escClose: true,
                size: 'medium'
            });
        }

        function showComponentModal() {
            currentModalId = $vs.modal.open(MyModalComponent, {
                container: '#modal-wrapper',
                dimClose: true,
                escClose: true,
                size: { width: '600px', height: '400px' },
                callbacks: {
                    onClose: () => {
                        console.log('모달이 닫혔습니다');
                    }
                }
            });
        }

        function closeModal() {
            if (currentModalId) {
                $vs.modal.closeWithId('body', currentModalId);
            } else {
                $vs.modal.close();
            }
        }

        function clearModal() {
            $vs.modal.clear();
        }

        return {
            showModal,
            showComponentModal,
            closeModal,
            clearModal,
        };
    },
});
</script>
```
