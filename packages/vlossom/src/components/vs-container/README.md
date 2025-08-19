# VsContainer

콘텐츠 영역을 담당하는 컨테이너 컴포넌트입니다. (CSS container query 사용 가능)
`vs-layout`과 함께 사용될 때 헤더와 푸터의 위치에 따라 자동으로 패딩을 조정하여 콘텐츠가 겹치지 않도록 보장합니다.

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

### vs-layout과 함께 사용

```html
<template>
    <vs-layout>
        <vs-header height="80px" fixed>Header Content</vs-header>
        <vs-container>
            <!-- 헤더와 푸터가 fixed/absolute/sticky일 때 자동으로 패딩이 조정됩니다 -->
            <main>Main Content</main>
        </vs-container>
        <vs-footer height="40px" absolute>Footer Content</vs-footer>
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
| `tag` | `string` | `div`   | -        | 렌더링할 HTML 태그 |

## Slots

| Slot      | Description                   |
| --------- | ----------------------------- |
| `default` | 컨테이너 내부에 배치할 콘텐츠 |

## 특징

- **자동 패딩 조정**: `vs-layout`의 자식일 때, 헤더와 푸터가 `absolute`, `fixed`, `sticky` 포지션을 사용하면 자동으로 패딩을 추가하여 콘텐츠 겹침 방지
- **컨테이너 쿼리**: `container-type: inline-size` 지원으로 반응형 디자인 구현 가능
- **유연한 태그**: `tag` prop을 통해 `div`, `main`, `section` 등 다양한 HTML 태그로 렌더링 가능
