# VsTooltip

다양한 트리거 방식과 위치를 지원하는 툴팁 컴포넌트입니다. 호버, 클릭, 키보드 포커스 등 다양한 상호작용을 통해 툴팁을 표시할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 툴팁

```html
<template>
    <vs-button id="my-button">Hover Me</vs-button>
    <vs-tooltip target="#my-button">
        <span>이것은 툴팁입니다</span>
    </vs-tooltip>
</template>
```

### 클릭 가능한 툴팁

```html
<template>
    <vs-button id="clickable-button">Click me</vs-button>
    <vs-tooltip target="#clickable-button" clickable>
        <span>클릭으로 열리는 툴팁입니다</span>
    </vs-tooltip>
</template>
```

### 툴팁 내용에 호버 가능

```html
<template>
    <vs-button id="hover-button">Hover Me</vs-button>
    <vs-tooltip target="#hover-button" contents-hover>
        <span>툴팁 내용에도 호버할 수 있습니다</span>
    </vs-tooltip>
</template>
```

### 클릭 가능하고 툴팁 내용에 호버 가능한 툴팁

```html
<template>
    <vs-button id="click-hover-button">Click and Hover Me</vs-button>
    <vs-tooltip target="#click-hover-button" clickable contents-hover>
        <span>클릭으로 열리고 툴팁 내용에도 호버할 수 있습니다</span>
    </vs-tooltip>
</template>
```

### 다양한 위치

```html
<template>
    <div style="display: flex; gap: 1rem;">
        <vs-button id="top-button">Top</vs-button>
        <vs-tooltip target="#top-button" placement="top">top</vs-tooltip>

        <vs-button id="right-button">Right</vs-button>
        <vs-tooltip target="#right-button" placement="right">right</vs-tooltip>

        <vs-button id="bottom-button">Bottom</vs-button>
        <vs-tooltip target="#bottom-button" placement="bottom">bottom</vs-tooltip>

        <vs-button id="left-button">Left</vs-button>
        <vs-tooltip target="#left-button" placement="left">left</vs-tooltip>
    </div>
</template>
```

### 정렬 옵션

```html
<template>
    <div style="display: flex; gap: 1rem;">
        <vs-button id="start-button">Start</vs-button>
        <vs-tooltip target="#start-button" placement="top" align="start">start</vs-tooltip>

        <vs-button id="center-button">Center</vs-button>
        <vs-tooltip target="#center-button" placement="top" align="center">center</vs-tooltip>

        <vs-button id="end-button">End</vs-button>
        <vs-tooltip target="#end-button" placement="top" align="end">end</vs-tooltip>
    </div>
</template>
```

## Props

| Prop            | Type                                     | Default    | Required | Description                            |
| --------------- | ---------------------------------------- | ---------- | -------- | -------------------------------------- |
| `target`        | `string`                                 | -          | ✅       | 툴팁을 표시할 대상 요소의 CSS selector |
| `colorScheme`   | `string`                                 | -          | -        | 컴포넌트 색상 테마                     |
| `styleSet`      | `string \| VsTooltipStyleSet`            | -          | -        | 커스텀 스타일 설정 객체                |
| `align`         | `'start' \| 'center' \| 'end'`           | `'center'` | -        | 툴팁의 정렬 방식                       |
| `clickable`     | `boolean`                                | `false`    | -        | 클릭 시 툴팁 열기/닫기                 |
| `contentsHover` | `boolean`                                | `false`    | -        | 툴팁 내용에 호버 가능                  |
| `disabled`      | `boolean`                                | `false`    | -        | 툴팁 비활성화                          |
| `enterDelay`    | `number`                                 | `0`        | -        | 툴팁 표시 지연 시간 (ms)               |
| `escClose`      | `boolean`                                | `true`     | -        | ESC 키로 툴팁 닫기                     |
| `leaveDelay`    | `number`                                 | `0`        | -        | 툴팁 숨김 지연 시간 (ms)               |
| `margin`        | `string \| number`                       | `10`       | -        | 툴팁과 트리거 요소 간의 간격           |
| `noAnimation`   | `boolean`                                | `false`    | -        | 애니메이션 비활성화                    |
| `placement`     | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    | -        | 툴팁 표시 위치                         |

## Types

```typescript
interface VsTooltipStyleSet {
    variables?: {
        arrowColor?: string;
        arrowSize?: string;
    };
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <div>
        <button id="my-button">Hover me</button>
        <vs-tooltip
            target="#my-button"
            :style-set="{
                variables: {
                    arrowColor: '#333',
                    arrowSize: '0.5rem',
                },
                component: {
                    backgroundColor: '#333',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    color: 'white',
                },
            }"
        >
            Custom styled tooltip
        </vs-tooltip>
    </div>
</template>
```

## Slots

| Slot      | Description |
| --------- | ----------- |
| `default` | 툴팁 내용   |

## 특징

- **다양한 트리거 방식**: 호버, 클릭, 키보드 포커스 지원
- **유연한 위치 설정**: 4방향 위치와 3가지 정렬 옵션
- **애니메이션 지원**: 부드러운 페이드 인/아웃 효과
- **접근성**: 키보드 네비게이션과 ESC 키 지원
- **지연 시간 설정**: 표시/숨김 지연 시간 커스터마이징
