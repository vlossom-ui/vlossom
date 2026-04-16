# VsInnerScroll

선택적인 고정 헤더 및 푸터 섹션과 함께 스크롤 가능한 콘텐츠 영역을 제공하는 레이아웃 컴포넌트입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- 사용 가능한 높이를 채우는 수직 스크롤 가능한 본문 영역을 제공합니다.
- 스크롤 영역 밖에 선택적인 고정 `header` 및 `footer` 슬롯을 지원합니다.
- `v-scroll-shadow` 디렉티브를 통해 스크롤 섀도우 스타일을 적용합니다.
- `hideScroll` prop으로 스크롤바를 숨길 수 있습니다.
- `hasScroll`을 통해 콘텐츠 오버플로우를 프로그래밍 방식으로 확인할 수 있습니다.

## Basic Usage

```html
<template>
    <vs-inner-scroll style="height: 300px;">
        <p v-for="i in 20" :key="i">라인 {{ i }}</p>
    </vs-inner-scroll>
</template>
```

### 헤더 및 푸터 사용

```html
<template>
    <vs-inner-scroll style="height: 400px;">
        <template #header>
            <div class="p-4 font-bold">헤더</div>
        </template>

        <p v-for="i in 20" :key="i">라인 {{ i }}</p>

        <template #footer>
            <div class="p-4">푸터</div>
        </template>
    </vs-inner-scroll>
</template>
```

### 스크롤바 숨기기

```html
<template>
    <vs-inner-scroll style="height: 200px;" :hide-scroll="true">
        <p v-for="i in 10" :key="i">라인 {{ i }}</p>
    </vs-inner-scroll>
</template>
```

## Props

| Prop         | Type                                | Default | Required | Description                                         |
| ------------ | ----------------------------------- | ------- | -------- | --------------------------------------------------- |
| `styleSet`   | `string \| VsInnerScrollStyleSet`   | -       | -        | 컴포넌트의 커스텀 스타일 셋.                        |
| `hideScroll` | `boolean`                           | `false` | -        | 스크롤 기능을 유지하면서 스크롤바를 숨깁니다.        |

## Types

```typescript
interface VsInnerScrollStyleSet {
    component?: CSSProperties;
    header?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-inner-scroll
        style="height: 400px;"
        :style-set="{
            component: { backgroundColor: '#f5f5f5' },
            header: { padding: '1rem', borderBottom: '1px solid #ddd' },
            content: { padding: '1rem' },
            footer: { padding: '0.5rem', borderTop: '1px solid #ddd' },
        }"
    >
        <template #header>
            <h3>제목</h3>
        </template>
        <p v-for="i in 20" :key="i">라인 {{ i }}</p>
        <template #footer>
            <span>푸터 텍스트</span>
        </template>
    </vs-inner-scroll>
</template>
```

## Events

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## Slots

| 슬롯      | 설명                                      |
| --------- | ----------------------------------------- |
| `default` | 스크롤 가능한 콘텐츠 영역.                |
| `header`  | 스크롤 영역 위에 표시되는 고정 헤더.      |
| `footer`  | 스크롤 영역 아래에 표시되는 고정 푸터.    |

## Methods

| 메서드      | 파라미터 | 설명                                              |
| ----------- | -------- | ------------------------------------------------- |
| `hasScroll` | -        | 콘텐츠가 컨테이너를 넘치면 `true`를 반환합니다.   |
