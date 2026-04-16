> For English documentation, see [README.md](./README.md).

# VsContainer

`VsLayout` 내부에서 사용할 때 위치 지정된 헤더, 푸터, 드로어를 수용하기 위해 패딩을 자동으로 조정하는 레이아웃 컨테이너 컴포넌트입니다.

**Available Version**: 2.0.0+

## Feature

- 레이아웃 컨텍스트(헤더, 푸터, 드로어 크기)를 기반으로 패딩 자동 계산 및 적용
- 드로어 열림/닫힘 상태 변경 시 부드러운 패딩 전환 애니메이션
- 자식 컴포넌트에서 컨테이너 쿼리를 활성화하는 CSS 컨테이너(`container-type: inline-size`) 역할
- `tag` prop을 통해 원하는 HTML 요소로 렌더링 가능 (기본값: `div`)
- 스타일 커스터마이징 불필요 — 레이아웃 조정이 자동으로 이루어짐

## Basic Usage

```html
<template>
    <vs-layout>
        <vs-header>헤더</vs-header>
        <vs-container>
            <p>메인 콘텐츠 영역</p>
        </vs-container>
        <vs-footer>푸터</vs-footer>
    </vs-layout>
</template>
```

### 커스텀 태그

```html
<template>
    <vs-layout>
        <vs-container tag="main">
            <p>시맨틱 메인 콘텐츠</p>
        </vs-container>
    </vs-layout>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `tag` | `string` | `'div'` | | 렌더링할 HTML 태그 |

## Types

VsContainer는 StyleSet 인터페이스가 없습니다.

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | 컨테이너의 메인 콘텐츠 |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Caution

- `VsContainer`는 **`VsLayout`의 직접 자식**일 때만 자동 레이아웃 패딩을 적용합니다. 다른 컨텍스트에서는 일반 컨테이너 요소로 동작합니다.
