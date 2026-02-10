# VsInnerScroll

내부 스크롤이 가능한 컨테이너 컴포넌트입니다.
헤더와 푸터 영역은 고정하고, 본문 영역만 스크롤되도록 하는 레이아웃을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 스크롤 컨테이너

```html
<template>
    <vs-inner-scroll>
        <div>스크롤 가능한 내용</div>
        <div>더 많은 내용...</div>
    </vs-inner-scroll>
</template>
```

### 헤더와 푸터가 있는 스크롤

```html
<template>
    <vs-inner-scroll>
        <template #header>
            <div>고정 헤더</div>
        </template>

        <div>스크롤 가능한 본문 내용</div>
        <div>더 많은 내용...</div>

        <template #footer>
            <div>고정 푸터</div>
        </template>
    </vs-inner-scroll>
</template>
```

### 스크롤바 숨김

```html
<template>
    <vs-inner-scroll hide-scroll>
        <div>스크롤바가 숨겨진 스크롤 내용</div>
    </vs-inner-scroll>
</template>
```

### hasScroll 메서드 사용

```html
<template>
    <vs-inner-scroll ref="innerScrollRef">
        <div>스크롤 가능한 내용</div>
        <div>더 많은 내용...</div>
    </vs-inner-scroll>
    <button @click="checkScroll">스크롤 가능 여부 확인</button>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { VsInnerScrollRef } from '@/components/vs-inner-scroll/types';

const innerScrollRef = useTemplateRef<VsInnerScrollRef>('innerScrollRef');

function checkScroll() {
    const canScroll = innerScrollRef.value?.hasScroll();
    console.log('스크롤 가능:', canScroll);
}
</script>
```

## StyleSet 사용 예시

```html
<template>
    <vs-inner-scroll
        :style-set="{
            header: {
                padding: '24px',
            },
            content: {
                padding: '24px',
            },
            footer: {
                padding: '16px',
            },
        }"
    >
        <template #header>
            <div>Header Content</div>
        </template>

        <div>Scrollable Content</div>

        <template #footer>
            <div>Footer Content</div>
        </template>
    </vs-inner-scroll>
</template>
```

## Props

| Prop         | Type                              | Default | Required | Description             |
| ------------ | --------------------------------- | ------- | -------- | ----------------------- |
| `hideScroll` | `boolean`                         | `false` | -        | 스크롤바 표시/숨김 여부 |
| `styleSet`   | `string \| VsInnerScrollStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |

## Methods

컴포넌트에 ref로 접근하여 사용할 수 있는 메서드들입니다.

| Method      | Parameters | Return    | Description                    |
| ----------- | ---------- | --------- | ------------------------------ |
| `hasScroll` | -          | `boolean` | 스크롤 가능 여부를 반환합니다. |

## Slots

| Slot      | Description                      |
| --------- | -------------------------------- |
| `default` | 스크롤 가능한 본문 영역의 콘텐츠 |
| `header`  | 상단에 고정되는 헤더 콘텐츠      |
| `footer`  | 하단에 고정되는 푸터 콘텐츠      |

## Types

```typescript
interface VsInnerScrollStyleSet {
    header?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
}
```

## 특징

- **고정 헤더/푸터**: 헤더와 푸터 영역은 스크롤되지 않고 고정됨
- **컨텐츠 스크롤**: 본문의 길이가 길어질 경우 본문만의 scroll을 가짐
- **컨테이너 쿼리**: `container-type: inline-size` 지원으로 컨테이너 기반 스타일링 가능
- **스크롤바 제어**: `hideScroll` prop으로 스크롤바 표시/숨김 제어 가능
