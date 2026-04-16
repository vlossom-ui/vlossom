> For English documentation, see [README.md](./README.md).

# VsRender

문자열(HTML), Vue 컴포넌트, 또는 렌더 함수를 가상 DOM 노드로 렌더링하는 유틸리티 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 일반 텍스트, HTML 문자열, Vue 컴포넌트, 렌더 함수 렌더링 지원
- `DOMParser`를 사용하여 HTML 문자열을 파싱하고 Vue 가상 DOM으로 변환
- `attrs`를 통해 루트 렌더링 요소에 HTML 속성 전달
- 일반 텍스트 또는 파싱 실패 시 `<span>` 래퍼로 폴백

## 기본 사용법

### 일반 문자열 렌더링

```html
<template>
    <vs-render content="안녕하세요, 세상!" />
</template>
```

### HTML 문자열 렌더링

```html
<template>
    <vs-render content="<strong>굵은 텍스트</strong>" />
</template>
```

### Vue 컴포넌트 렌더링

```html
<template>
    <vs-render :content="MyIcon" />
</template>

<script setup>
import MyIcon from './MyIcon.vue';
</script>
```

## Props

| Prop      | Type                        | Default | Required | 설명                                                    |
| --------- | --------------------------- | ------- | -------- | ------------------------------------------------------- |
| `content` | `string \| Component`       | -       | Yes      | 렌더링할 콘텐츠: 문자열, HTML 문자열, 또는 Vue 컴포넌트 |

## Types

이 컴포넌트에는 커스텀 StyleSet 인터페이스가 없습니다.

## Events

| Event | Payload | 설명 |
| ----- | ------- | ---- |

## Slots

| Slot | 설명 |
| ---- | ---- |

## Methods

| Method | Parameters | 설명 |
| ------ | ---------- | ---- |
