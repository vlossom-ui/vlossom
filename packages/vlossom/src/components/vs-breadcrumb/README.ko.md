> For English documentation, see [README.md](./README.md).

# VsBreadcrumb

현재 페이지까지의 경로를 보여주고, 조상 항목 클릭을 이벤트로 알리는 breadcrumb 컴포넌트입니다.

**사용 가능 버전**: 2.3.0+

## 기능

- 문자열 배열로 시맨틱한 `nav > ol > li` breadcrumb를 렌더링하고, 마지막 항목을 현재 페이지(`aria-current="page"`)로 표시
- 직접 이동하지 않음: 조상 항목을 클릭하면 클릭한 단계까지의 경로와 전체 경로로 `click-path`를 보내므로, 동작(라우터, 새 탭, 앱 내부 동작)은 사용하는 쪽이 정함
- boolean 또는 항목별 함수로 조상 항목 비활성화
- 긴 라벨은 말줄임으로 자르고, `$item.minWidth` / `$item.maxWidth`로 항목 폭 제한
- 슬롯으로 항목 내용과 구분자를 커스터마이징하고, color scheme / style set 지원

## 기본 사용법

```html live
<template>
    <vs-breadcrumb :paths="paths" @click-path="onClick" />
    <p>Clicked: {{ clicked }}</p>
</template>

<script setup>
import { ref } from 'vue';

const paths = ['Home', 'Components', 'Breadcrumb'];
const clicked = ref('-');

function onClick(clickedPaths) {
    clicked.value = clickedPaths.join(' / ');
}
</script>
```

### 라우터와 함께 사용

`VsBreadcrumb`는 `vue-router`에 의존하지 않습니다. 각 경로의 route를 직접 갖고 있다가 `click-path` 핸들러에서 이동합니다.

```html
<template>
    <vs-breadcrumb :paths="paths" @click-path="(clickedPaths) => router.push(routes[clickedPaths.length - 1])" />
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const paths = ['Home', 'Components', 'Breadcrumb'];
const routes = ['/', '/components', '/components/breadcrumb'];
</script>
```

### 비활성화

```html live
<template>
    <vs-breadcrumb :paths="['Home', 'Components', 'Breadcrumb']" :disabled="(path, index) => index === 0" />
</template>
```

### 긴 라벨

라벨은 한 줄로 표시되고, 공간이 부족하면 말줄임으로 잘립니다. `$item`의 `minWidth` / `maxWidth`로 항목 폭을 조절합니다.

```html live
<template>
    <vs-breadcrumb
        :paths="['Home', 'Documentation', 'Components', 'Navigation', 'Breadcrumb']"
        :style-set="{ $item: { maxWidth: '7rem' } }"
    />
</template>
```

### 커스텀 구분자

```html live
<template>
    <vs-breadcrumb :paths="['Home', 'Components', 'Breadcrumb']">
        <template #separator>/</template>
    </vs-breadcrumb>
</template>
```

### 커스텀 항목

```html live
<template>
    <vs-breadcrumb :paths="['Home', 'Components', 'Breadcrumb']">
        <template #item-label="{ path, isCurrent }">
            <span :style="{ textTransform: isCurrent ? 'uppercase' : 'none' }">{{ path }}</span>
        </template>
    </vs-breadcrumb>
</template>
```

## Props

| Prop            | Type                                                    | Default | Required | 설명                                                              |
| --------------- | ------------------------------------------------------- | ------- | -------- | ----------------------------------------------------------------- |
| `colorScheme`   | `string`                                                | -       | -        | 컴포넌트의 색상 스킴                                              |
| `styleSet`      | `string \| VsBreadcrumbStyleSet`                        | -       | -        | 컴포넌트에 적용할 커스텀 스타일 세트                              |
| `disabled`      | `boolean \| ((path: string, index: number) => boolean)` | `false` | -        | 조상 항목 비활성화. boolean이면 전체, 함수면 항목별로 적용        |
| `paths`         | `string[]`                                              | `[]`    | -        | 루트부터 현재 페이지까지의 경로 라벨. 마지막 항목이 현재 페이지   |

## Types

```typescript
interface VsBreadcrumbStyleSet extends CSSProperties {
    $list?: CSSProperties;
    $item?: CSSProperties;
    $link?: CSSProperties;
    $current?: CSSProperties;
    $separator?: CSSProperties;
}
```

> [!NOTE]
> `$list`는 목록, `$item`은 각 목록 항목, `$link`는 조상 항목 버튼, `$current`는 현재 페이지 라벨, `$separator`는 각 구분자에 적용됩니다.

### StyleSet 사용 예시

```html live
<template>
    <vs-breadcrumb
        :paths="['Home', 'Components', 'Breadcrumb']"
        :style-set="{
            $list: { gap: '0.25rem 0.75rem' },
            $link: { color: '#6366f1' },
            $current: { color: '#1e1b4b', fontWeight: '700' },
            $separator: { color: '#a5b4fc' },
        }"
    />
</template>
```

## Events

| Event   | Payload                                     | 설명                                                                              |
| ------- | ------------------------------------------- | --------------------------------------------------------------------------------- |
| `click-path` | `(clickedPaths: string[], paths: string[])` | 조상 항목을 클릭하면 발생. 현재 항목과 비활성 항목에서는 발생하지 않음 |

## Slots

| Slot        | 설명                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| `item-label` | 각 항목 안의 라벨(조상 항목 버튼 또는 현재 페이지 라벨). `{ path, index, isCurrent, isDisabled }` 수신 |
| `separator` | 각 항목 뒤의 구분자. `{ index }`(구분자 앞 항목의 index) 수신              |

## Methods

| Method | Parameters | 설명 |
| ------ | ---------- | ---- |

## Caution

- `VsBreadcrumb`는 이동하지 않습니다. 이동은 `click-path` 핸들러에서 처리합니다.
- `paths`의 마지막 항목은 항상 현재 페이지이며 클릭할 수 없습니다.
- `item-label` 슬롯은 항목 안의 라벨만 바꾸므로 클릭 동작은 유지됩니다.
- 조상 항목 버튼의 클릭은 부모 요소로 전파되지 않습니다.
