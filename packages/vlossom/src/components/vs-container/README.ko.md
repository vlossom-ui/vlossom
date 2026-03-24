> English: [README.md](./README.md)

# VsContainer

콘텐츠 영역을 담당하는 컨테이너 컴포넌트입니다. CSS Container Query를 지원합니다.
`vs-layout`과 함께 사용될 때 헤더와 푸터의 위치에 따라 자동으로 패딩을 조정하여 콘텐츠가 겹치지 않도록 보장합니다. 같은 `vs-layout` 안의 `vs-drawer`에 `layout-responsive`가 설정된 경우, 해당 드로어의 열림/닫힘 상태에도 반응합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 독립적인 컨테이너

```html
<template>
    <vs-container>
        <h1>메인 콘텐츠</h1>
        <p>컨테이너 내부의 콘텐츠입니다.</p>
    </vs-container>
</template>
```

### vs-layout과 함께 사용 (헤더/푸터 자동 패딩)

```html
<template>
    <vs-layout>
        <vs-header position="fixed">Header</vs-header>

        <!-- paddingTop / paddingBottom이 헤더/푸터 위치에 따라 자동 적용됩니다 -->
        <vs-container>
            <main>메인 콘텐츠</main>
        </vs-container>

        <vs-footer position="absolute">Footer</vs-footer>
    </vs-layout>
</template>
```

### vs-drawer와 함께 사용 (layout-responsive)

```html
<template>
    <vs-layout>
        <vs-header position="absolute">Header</vs-header>

        <!--
            vs-drawer의 layout-responsive: 이 드로어가 열리면 vs-container가
            해당 방향의 패딩을 자동으로 추가합니다
            (예: 왼쪽 드로어가 열리면 paddingLeft 적용).
            헤더/푸터 패딩은 layout-responsive 없이도 vs-container에 자동 적용됩니다.
        -->
        <vs-drawer placement="left" layout-responsive v-model="leftOpen" size="280px" />

        <vs-container>
            <main>메인 콘텐츠</main>
        </vs-container>

        <vs-footer position="absolute">Footer</vs-footer>
    </vs-layout>
</template>
```

### 커스텀 태그 사용

```html
<template>
    <vs-container tag="main">
        <article>Article Content</article>
    </vs-container>
</template>
```

## Props

| Prop  | Type     | Default | Required | Description        |
| ----- | -------- | ------- | -------- | ------------------ |
| `tag` | `string` | `'div'` | -        | 렌더링할 HTML 태그 |

## Types

```typescript
// No StyleSet for this component
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                   |
| --------- | ----------------------------- |
| `default` | 컨테이너 내부에 배치할 콘텐츠 |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## 특징

- **자동 패딩 조정**: `vs-layout`의 자식일 때, 헤더와 푸터가 `absolute`, `fixed`, `sticky` 포지션을 사용하면 자동으로 패딩을 추가하여 콘텐츠 겹침 방지
- **드로어 반응형 패딩**: `vs-drawer`에 `layout-responsive`를 설정하면 해당 드로어가 열릴 때 vs-container의 해당 방향 패딩이 자동 조정. 위아래 드로어는 헤더/푸터 높이까지 합산하여 계산
- **컨테이너 쿼리**: `container-type: inline-size` 지원으로 반응형 디자인 구현 가능
- **유연한 태그**: `tag` prop을 통해 `div`, `main`, `section` 등 다양한 HTML 태그로 렌더링 가능
