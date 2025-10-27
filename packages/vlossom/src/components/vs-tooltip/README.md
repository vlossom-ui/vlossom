# VsTooltip

다양한 트리거 방식과 위치를 지원하는 툴팁 컴포넌트입니다. 호버, 클릭, 키보드 포커스 등 다양한 상호작용을 통해 툴팁을 표시할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 툴팁

```html
<template>
    <vs-tooltip>
        <vs-button>호버해보세요</vs-button>
        <template #tooltip>
            <span>이것은 툴팁입니다</span>
        </template>
    </vs-tooltip>
</template>
```

### 클릭 가능한 툴팁

```html
<template>
    <vs-tooltip clickable>
        <vs-button>클릭해보세요</vs-button>
        <template #tooltip>
            <span>클릭으로 열리는 툴팁입니다</span>
        </template>
    </vs-tooltip>
</template>
```

### 툴팁 내용에 호버 가능

```html
<template>
    <vs-tooltip contents-hover>
        <vs-button>호버해보세요</vs-button>
        <template #tooltip>
            <span>툴팁 내용에도 호버할 수 있습니다</span>
        </template>
    </vs-tooltip>
</template>
```

### 클릭 가능하고 툴팁 내용에 호버 가능한 툴팁

```html
<template>
    <vs-tooltip clickable contents-hover>
        <vs-button>클릭하고 호버해보세요</vs-button>
        <template #tooltip>
            <span>클릭으로 열리고 툴팁 내용에도 호버할 수 있습니다</span>
        </template>
    </vs-tooltip>
</template>
```

### 다양한 위치

```html
<template>
    <div style="display: flex; gap: 1rem;">
        <vs-tooltip placement="top">
            <vs-button>Top</vs-button>
            <template #tooltip>위쪽 툴팁</template>
        </vs-tooltip>

        <vs-tooltip placement="right">
            <vs-button>Right</vs-button>
            <template #tooltip>오른쪽 툴팁</template>
        </vs-tooltip>

        <vs-tooltip placement="bottom">
            <vs-button>Bottom</vs-button>
            <template #tooltip>아래쪽 툴팁</template>
        </vs-tooltip>

        <vs-tooltip placement="left">
            <vs-button>Left</vs-button>
            <template #tooltip>왼쪽 툴팁</template>
        </vs-tooltip>
    </div>
</template>
```

### 정렬 옵션

```html
<template>
    <div style="display: flex; gap: 1rem;">
        <vs-tooltip placement="top" align="start">
            <vs-button>Start</vs-button>
            <template #tooltip>시작 정렬</template>
        </vs-tooltip>

        <vs-tooltip placement="top" align="center">
            <vs-button>Center</vs-button>
            <template #tooltip>중앙 정렬</template>
        </vs-tooltip>

        <vs-tooltip placement="top" align="end">
            <vs-button>End</vs-button>
            <template #tooltip>끝 정렬</template>
        </vs-tooltip>
    </div>
</template>
```

## Props

| Prop            | Type                                     | Default    | Required | Description                  |
| --------------- | ---------------------------------------- | ---------- | -------- | ---------------------------- |
| `colorScheme`   | `string`                                 | -          | -        | 툴팁의 색상 테마             |
| `styleSet`      | `string \| VsTooltipStyleSet`            | -          | -        | 커스텀 스타일 설정 객체      |
| `align`         | `'start' \| 'center' \| 'end'`           | `'center'` | -        | 툴팁의 정렬 방식             |
| `clickable`     | `boolean`                                | `false`    | -        | 클릭으로 툴팁 열기/닫기      |
| `contentsHover` | `boolean`                                | `false`    | -        | 툴팁 내용에 호버 가능        |
| `disabled`      | `boolean`                                | `false`    | -        | 툴팁 비활성화                |
| `enterDelay`    | `number`                                 | `0`        | -        | 툴팁 표시 지연 시간 (ms)     |
| `escClose`      | `boolean`                                | `true`     | -        | ESC 키로 툴팁 닫기           |
| `leaveDelay`    | `number`                                 | `0`        | -        | 툴팁 숨김 지연 시간 (ms)     |
| `margin`        | `string \| number`                       | `'0.5rem'` | -        | 툴팁과 트리거 요소 간의 간격 |
| `noAnimation`   | `boolean`                                | `false`    | -        | 애니메이션 비활성화          |
| `placement`     | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`    | -        | 툴팁 표시 위치               |

## Types

```typescript
interface VsTooltipStyleSet {
    width?: string;
    height?: string;

    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: string | number;

    arrowColor?: string;
    arrowSize?: string;
}
```

## Slots

| Slot      | Description      |
| --------- | ---------------- |
| `default` | 툴팁 트리거 요소 |
| `tooltip` | 툴팁 내용        |

## 특징

- **다양한 트리거 방식**: 호버, 클릭, 키보드 포커스 지원
- **유연한 위치 설정**: 4방향 위치와 3가지 정렬 옵션
- **애니메이션 지원**: 부드러운 페이드 인/아웃 효과
- **접근성**: 키보드 네비게이션과 ESC 키 지원
- **지연 시간 설정**: 표시/숨김 지연 시간 커스터마이징
