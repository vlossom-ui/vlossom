> For English documentation, see [README.md](./README.md).

# VsTooltip

대상 요소에 연결되어 호버, 클릭, 키보드 상호작용을 지원하는 플로팅 툴팁 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- CSS 선택자를 통해 모든 대상 요소에 연결
- 호버, 클릭 열기, 콘텐츠 호버 모드 지원
- 설정 가능한 배치 (top, bottom, left, right) 및 정렬 (start, center, end)
- 색상 및 크기를 커스터마이징할 수 있는 화살표 인디케이터
- Escape 키로 툴팁 닫기 (설정 가능)
- 설정 가능한 표시/숨김 딜레이

## 기본 사용법

```html
<template>
    <button id="my-btn">마우스를 올려보세요</button>
    <vs-tooltip target="#my-btn">
        툴팁입니다
    </vs-tooltip>
</template>
```

### 클릭 열기 툴팁

```html
<template>
    <button id="click-btn">클릭하세요</button>
    <vs-tooltip target="#click-btn" clickable>
        클릭으로 열림
    </vs-tooltip>
</template>
```

### 하단 배치

```html
<template>
    <button id="bottom-btn">마우스를 올려보세요</button>
    <vs-tooltip target="#bottom-btn" placement="bottom" align="start">
        하단-시작 툴팁
    </vs-tooltip>
</template>
```

### 콘텐츠 호버

```html
<template>
    <button id="hover-btn">마우스를 올려보세요</button>
    <vs-tooltip target="#hover-btn" contents-hover>
        <a href="#">툴팁 내부의 링크를 클릭하세요</a>
    </vs-tooltip>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트 색상 스키마 |
| `styleSet` | `string \| VsTooltipStyleSet` | | | 컴포넌트 커스텀 스타일 세트 |
| `target` | `string` | `''` | 필수 | 트리거 요소의 CSS 선택자 |
| `align` | `Alignment` | `'center'` | | 대상에 대한 툴팁 정렬 (`start`, `center`, `end`) |
| `clickable` | `boolean` | `false` | | 열기 위해 대상 클릭 필요 |
| `contentsHover` | `boolean` | `false` | | 콘텐츠에 마우스를 올리는 동안 툴팁 유지 |
| `disabled` | `boolean` | `false` | | 툴팁 비활성화 |
| `enterDelay` | `string \| number` | `0` | | 툴팁 표시 전 딜레이 (ms) |
| `escClose` | `boolean` | `true` | | Escape 키 누를 때 툴팁 닫기 |
| `leaveDelay` | `string \| number` | `0` | | 툴팁 숨김 전 딜레이 (ms) |
| `margin` | `string \| number` | `10` | | 대상과 툴팁 사이의 간격 (px) |
| `noAnimation` | `boolean` | `false` | | 열기/닫기 애니메이션 비활성화 |
| `placement` | `Placement` | `'top'` | | 툴팁 배치 (`top`, `bottom`, `left`, `right`) |

## 타입

```typescript
interface VsTooltipStyleSet {
    variables?: {
        arrowColor?: string;
        arrowSize?: string;
    };
    component?: CSSProperties;
}
```

### StyleSet 예시

```html
<template>
    <button id="styled-btn">마우스를 올려보세요</button>
    <vs-tooltip
        target="#styled-btn"
        :style-set="{
            variables: { arrowColor: '#323232', arrowSize: '0.5rem' },
            component: {
                backgroundColor: '#323232',
                color: '#ffffff',
                borderRadius: '0.25rem',
                padding: '0.4rem 0.8rem',
            },
        }"
    >
        커스텀 툴팁
    </vs-tooltip>
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 툴팁 내용 |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |
