# VsContainer

A container component responsible for the content area. Supports CSS Container Query.
When used as a child of `vs-layout`, it automatically adjusts padding based on the positions of the header and footer to prevent content overlap. With the `drawer-responsive` prop, it also responds to drawer open/close state.

**Available Version**: 2.0.0+

## Basic Usage

### Standalone container

```html
<template>
    <vs-container>
        <h1>Main Content</h1>
        <p>Content inside the container.</p>
    </vs-container>
</template>
```

### With vs-layout (header / footer auto-padding)

```html
<template>
    <vs-layout>
        <vs-header position="fixed">Header</vs-header>

        <!-- paddingTop / paddingBottom are automatically applied based on header/footer position -->
        <vs-container>
            <main>Main Content</main>
        </vs-container>

        <vs-footer position="absolute">Footer</vs-footer>
    </vs-layout>
</template>
```

### With vs-drawer (drawer-responsive)

```html
<template>
    <vs-layout>
        <vs-header position="absolute">Header</vs-header>

        <vs-drawer placement="left" v-model="leftOpen" size="280px" />

        <!--
            drawer-responsive: when a drawer opens, padding is automatically added
            in the corresponding direction (e.g. paddingLeft when left drawer is open).
            Header/footer padding is applied regardless of drawer-responsive.
        -->
        <vs-container drawer-responsive>
            <main>Main Content</main>
        </vs-container>

        <vs-footer position="absolute">Footer</vs-footer>
    </vs-layout>
</template>
```

### Custom tag

```html
<template>
    <vs-container tag="main">
        <article>Article Content</article>
    </vs-container>
</template>
```

## Props

| Prop               | Type      | Default | Required | Description                                                                                         |
| ------------------ | --------- | ------- | -------- | --------------------------------------------------------------------------------------------------- |
| `tag`              | `string`  | `'div'` | -        | HTML tag to render                                                                                  |
| `drawer-responsive`| `boolean` | `false` | -        | When `true`, automatically adjusts padding in the direction of any open drawer inside `vs-layout`   |

## Slots

| Slot      | Description                        |
| --------- | ---------------------------------- |
| `default` | Content to place inside the container |

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Types

None.

## 특징

- **자동 패딩 조정**: `vs-layout`의 자식일 때, 헤더와 푸터가 `absolute`, `fixed`, `sticky` 포지션을 사용하면 자동으로 패딩을 추가하여 콘텐츠 겹침 방지
- **드로어 반응형 패딩**: `drawer-responsive` prop을 설정하면 드로어가 열릴 때 해당 방향의 패딩을 자동 조정. 위아래 드로어는 헤더/푸터 높이까지 합산하여 계산
- **컨테이너 쿼리**: `container-type: inline-size` 지원으로 반응형 디자인 구현 가능
- **유연한 태그**: `tag` prop을 통해 `div`, `main`, `section` 등 다양한 HTML 태그로 렌더링 가능
