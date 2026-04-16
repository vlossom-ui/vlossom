# VsLayout

`VsHeader`, `VsFooter` 및 기타 레이아웃 인식 컴포넌트에 필요한 레이아웃 스토어 컨텍스트를 제공하는 루트 레이아웃 컨테이너입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- `provide`를 통해 하위 레이아웃 컴포넌트에 레이아웃 스토어를 제공합니다.
- `VsHeader` 및 `VsFooter` 위치 추적을 가능하게 하는 최상위 컨테이너 역할을 합니다.
- 부모 요소의 전체 너비와 높이를 차지합니다.
- 추가 props나 스타일링이 없는 단순한 래퍼입니다.

## Basic Usage

```html
<template>
    <vs-layout>
        <vs-header>앱 헤더</vs-header>
        <main>
            <slot />
        </main>
        <vs-footer>푸터</vs-footer>
    </vs-layout>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |

## Types

```typescript
// StyleSet 인터페이스 없음 — 이 컴포넌트는 styleSet prop을 받지 않습니다.
```

## Events

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## Slots

| 슬롯      | 설명                                   |
| --------- | -------------------------------------- |
| `default` | 레이아웃 내부에 렌더링할 콘텐츠.        |

## Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## Caution

`VsLayout`은 `VsHeader` 또는 `VsFooter`를 사용하는 모든 페이지나 섹션을 감싸야 합니다. 이것이 없으면 해당 컴포넌트들이 레이아웃 스토어에 등록되지 않아 정상적으로 동작하지 않습니다.
