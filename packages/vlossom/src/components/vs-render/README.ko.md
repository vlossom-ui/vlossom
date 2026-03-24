> English: [README.md](./README.md)

# VsRender

동적 콘텐츠를 렌더링하는 유틸리티 컴포넌트입니다. 문자열 HTML 또는 Vue 컴포넌트(옵션 API, 컴포지션 API, 함수형 컴포넌트)를 동적으로 렌더링할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### HTML 문자열 렌더링

```html
<template>
    <vs-render content="<div>Hello World!</div>" />
</template>
```

### Vue 컴포넌트 렌더링

```html
<template>
    <vs-render
        :content="MyComponent"
        title="Dynamic Component"
    />
</template>
```

### 함수형 컴포넌트 렌더링

```html
<template>
    <vs-render
        :content="() => h('div', 'Hello World!')"
        title="Functional Component"
    />
</template>
```

컴포넌트에 전달할 속성은 `attrs`로 전달됩니다. HTML 문자열인 경우 attrs는 최상위 엘리먼트에 바인딩됩니다.

## Props

| Prop      | Type                  | Default | Required | Description                                     |
| --------- | --------------------- | ------- | -------- | ----------------------------------------------- |
| `content` | `string \| Component` | -       | ✅       | 렌더링할 콘텐츠 (HTML 문자열 또는 Vue 컴포넌트) |

## Attrs

`VsRender`에 전달된 모든 attrs는 렌더링되는 최상위 엘리먼트(또는 컴포넌트)에 바인딩됩니다.
