# VsInfiniteScroll

IntersectionObserver를 사용하여 자식 요소들의 가시성을 추적하는 무한 스크롤 컨테이너 컴포넌트입니다.<br />
자식 요소가 뷰포트에 보일 때 `data-io-visible="true"` 속성을 자동으로 설정하여 가시성 기반 렌더링 최적화를 지원합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 무한 스크롤 컨테이너

```html
<template>
    <vs-infinite-scroll>
        <div>첫 번째 항목</div>
        <div>두 번째 항목</div>
        <div>세 번째 항목</div>
        <!-- 더 많은 항목들... -->
    </vs-infinite-scroll>
</template>
```

### 고정 높이 컨테이너

```html
<template>
    <vs-infinite-scroll height="500px">
        <div v-for="item in items" :key="item.id">
            {{ item.content }}
        </div>
    </vs-infinite-scroll>
</template>
```

### IntersectionObserver 옵션 커스터마이징

```html
<template>
    <vs-infinite-scroll
        root-margin="100px"
        :threshold="0.5"
    >
        <div v-for="item in items" :key="item.id">
            {{ item.content }}
        </div>
    </vs-infinite-scroll>
</template>
```

### 비활성화

```html
<template>
    <vs-infinite-scroll disabled>
        <div>모든 자식 요소가 항상 표시됩니다</div>
    </vs-infinite-scroll>
</template>
```

### 커스텀 태그 사용

```html
<template>
    <vs-infinite-scroll tag="ul">
        <li v-for="item in items" :key="item.id">
            {{ item.content }}
        </li>
    </vs-infinite-scroll>
</template>
```

## Props

| Prop         | Type               | Default | Required | Description                                                                |
| ------------ | ------------------ | ------- | -------- | -------------------------------------------------------------------------- |
| `disabled`   | `boolean`          | `false` | -        | IntersectionObserver 비활성화 여부. true일 때 모든 자식 요소가 항상 표시됨 |
| `height`     | `string \| number` | -       | -        | 컨테이너 높이. 설정 시 자동으로 `overflow-y: auto` 적용                    |
| `rootMargin` | `string`           | `'0px'` | -        | IntersectionObserver의 rootMargin 옵션                                     |
| `tag`        | `string`           | `'div'` | -        | 렌더링할 HTML 태그                                                         |
| `threshold`  | `number`           | `0`     | -        | IntersectionObserver의 threshold 옵션 (0~1)                                |

## Methods

| Method            | Parameter     | Description                    |
| ----------------- | ------------- | ------------------------------ |
| `scrollToElement` | `HTMLElement` | 지정한 자식 요소로 스크롤 이동 |

## Slots

| Slot      | Description                                                   |
| --------- | ------------------------------------------------------------- |
| `default` | 가시성을 추적할 자식 요소들. 각 자식 요소가 개별적으로 관찰됨 |

## 특징

- **IntersectionObserver 기반**: 브라우저 네이티브 API를 사용하여 효율적인 가시성 추적
- **자동 가시성 표시**: 자식 요소가 뷰포트에 보일 때 `data-io-visible="true"` 속성 자동 설정
- **스크롤 루트 자동 감지**: 컨테이너가 스크롤 가능하면 컨테이너를, 아니면 viewport를 root로 사용
- **동적 자식 요소 지원**: MutationObserver를 통해 자식 요소 변경 시 자동으로 재관찰
- **유연한 높이 설정**: `height` prop으로 컨테이너 높이와 스크롤 동작 제어
- **옵션 커스터마이징**: `rootMargin`, `threshold`로 IntersectionObserver 동작 세밀 조정
- **비활성화 지원**: `disabled` prop으로 필요 시 가시성 추적 비활성화

## 사용 사례

- **가상 스크롤**: 보이는 항목만 렌더링하여 대량 데이터 리스트 성능 최적화
- **레이지 로딩**: 이미지나 무거운 컴포넌트를 뷰포트에 들어올 때만 로드
- **인피니트 스크롤**: 스크롤이 하단에 도달했을 때 추가 데이터 로드
- **애니메이션 트리거**: 요소가 보일 때 애니메이션 실행
