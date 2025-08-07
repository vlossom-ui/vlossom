# VsRender

동적 콘텐츠를 렌더링하는 유틸리티 컴포넌트입니다. 문자열 HTML 또는 Vue 컴포넌트를 동적으로 렌더링할 수 있습니다.

**Available Version**: 2.0.0+

## 미리보기

<!-- 컴포넌트 이미지 -->

## 기본 사용법

### HTML 문자열 렌더링

```html
<template>
  <VsRender content="<div>Hello World!</div>" />
</template>
```

### Vue 컴포넌트 렌더링

```html
<template>
  <VsRender
    :content="MyComponent"
    :props="{ title: 'Dynamic Component' }"
  />
</template>
```

## Props

| Prop      | Type                  | Default | Required | Description                                    |
| --------- | --------------------- | ------- | -------- | ---------------------------------------------- |
| `content` | `string \| Component` | -       | O        | 렌더링할 콘텐츠. HTML 문자열 또는 Vue 컴포넌트 |
| `props`   | `Record<string, any>` | `{}`    | -        | 렌더링 할 컴포넌트에 전달할 props 객체         |
