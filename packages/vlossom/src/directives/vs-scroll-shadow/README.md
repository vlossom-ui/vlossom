# v-scroll-shadow

스크롤 가능한 컨테이너에 스크롤 위치에 따라 상단/하단 그림자를 표시하는 디렉티브입니다.

**Available Version**: 2.0.0+

## 기본 사용법

```html
<template>
    <div v-scroll-shadow style="overflow: auto; height: 300px">
        <div v-for="item in items" :key="item">{{ item }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { scrollShadow } from 'vlossom';

export default defineComponent({
    directives: {
        scrollShadow,
    },
});
</script>
```

## 조건부 사용

binding value로 활성화 여부를 동적으로 제어할 수 있습니다.

```html
<template>
    <div v-scroll-shadow="isEnabled" style="overflow: auto; height: 300px">
        ...
    </div>
</template>
```

## Binding

| Binding | Type                   | Default     | Description                                  |
| ------- | ---------------------- | ----------- | -------------------------------------------- |
| `value` | `boolean \| undefined` | `undefined` | `false`이면 비활성화, `undefined`이면 활성화 |

## 주의사항

디렉티브는 반드시 **스크롤이 발생하는 요소** (`overflow: auto` 또는 `overflow: scroll`)에 적용해야 합니다.
스크롤이 발생하지 않는 요소에 적용하면 경고가 출력됩니다.

```html
<!-- ✅ 올바른 사용: overflow가 있는 요소에 직접 적용 -->
<div v-scroll-shadow style="overflow: auto; height: 300px">
    ...
</div>

<!-- ❌ 잘못된 사용: 스크롤이 없는 래퍼 요소에 적용 -->
<div v-scroll-shadow>
    <div style="overflow: auto; height: 300px">...</div>
</div>
```

## 브라우저 지원

그림자 표시는 CSS `@container scroll-state()` 쿼리를 사용하며 **Chrome 128+** 에서 동작합니다.
