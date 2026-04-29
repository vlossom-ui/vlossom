# VsLayout

`VsHeader`, `VsFooter` 및 기타 레이아웃 인식 컴포넌트에 필요한 레이아웃 스토어 컨텍스트를 제공하는 루트 레이아웃 컨테이너입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- `provide`를 통해 하위 레이아웃 컴포넌트에 레이아웃 스토어와 레이아웃 컨텍스트 마커를 제공합니다.
- `layout` prop을 명시적으로 켠 하위 컴포넌트(`VsHeader`, `VsFooter`, `VsDrawer`, `VsContainer`)의 위치 추적을 가능하게 합니다.
- 부모 요소의 전체 너비와 높이를 차지합니다.
- 추가 props나 스타일링이 없는 단순한 래퍼입니다.

## Basic Usage

레이아웃 스토어 연동에 참여하려면 하위 컴포넌트에 `layout` prop을 명시적으로 설정해야 합니다. 중간에 일반 wrapper 컴포넌트가 몇 단계 끼어 있어도 동작하지만, 다른 레이아웃 컴포넌트가 중간에 끼면 그 안쪽으로는 차단되어 의도치 않은 연동이 발생하지 않습니다.

```html
<template>
    <vs-layout>
        <vs-header layout>앱 헤더</vs-header>
        <vs-container layout>
            <slot />
        </vs-container>
        <vs-footer layout>푸터</vs-footer>
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

`VsHeader`, `VsFooter`, `VsDrawer`, `VsContainer`에 `layout` prop을 사용하는 모든 페이지/섹션은 `VsLayout`으로 감싸야 합니다. `VsLayout` 조상이 없으면 `layout` prop은 무시되고, 해당 컴포넌트들은 일반 컴포넌트처럼 동작합니다.
