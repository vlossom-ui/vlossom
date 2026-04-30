> For English documentation, see [README.md](./README.md).

# VsTooltip

기본 슬롯에 트리거 요소를 감싸고, `tooltip` 네임드 슬롯으로 툴팁 내용을 렌더링하는 플로팅 툴팁 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 기본 슬롯으로 트리거 요소를 감싸므로 별도의 selector나 `id` 연결이 필요 없습니다
- disabled 상태인 트리거(예: `<vs-button disabled>`)에서도 정상 동작합니다 — 리스너가 트리거가 아닌 wrapper에 붙어 있기 때문입니다
- 호버, 클릭 열기, 콘텐츠 호버 모드 지원
- 설정 가능한 배치 (top, bottom, left, right) 및 정렬 (start, center, end)
- 색상 및 크기를 커스터마이징할 수 있는 화살표 인디케이터
- Escape 키로 툴팁 닫기 (설정 가능)
- 설정 가능한 표시/숨김 딜레이

## 기본 사용법

```html
<template>
    <vs-tooltip>
        <vs-button>마우스를 올려보세요</vs-button>
        <template #tooltip>툴팁입니다</template>
    </vs-tooltip>
</template>
```

트리거 wrapper는 `display: contents`로 처리되어 트리거 주변에 레이아웃 박스를 만들지 않습니다 — 트리거 요소의 원래 레이아웃 동작이 그대로 유지됩니다.

### 클릭 열기 툴팁

```html
<template>
    <vs-tooltip clickable>
        <vs-button>클릭하세요</vs-button>
        <template #tooltip>클릭으로 열림</template>
    </vs-tooltip>
</template>
```

### 하단 배치

```html
<template>
    <vs-tooltip placement="bottom" align="start">
        <vs-button>마우스를 올려보세요</vs-button>
        <template #tooltip>하단-시작 툴팁</template>
    </vs-tooltip>
</template>
```

### 콘텐츠 호버

```html
<template>
    <vs-tooltip contents-hover>
        <vs-button>마우스를 올려보세요</vs-button>
        <template #tooltip>
            <a href="#">툴팁 내부의 링크를 클릭하세요</a>
        </template>
    </vs-tooltip>
</template>
```

### Disabled 트리거

```html
<template>
    <vs-tooltip>
        <vs-button disabled>비활성</vs-button>
        <template #tooltip>권한이 없습니다</template>
    </vs-tooltip>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트 색상 스키마 |
| `styleSet` | `string \| VsTooltipStyleSet` | | | 컴포넌트 커스텀 스타일 세트 |
| `align` | `Alignment` | `'center'` | | 트리거에 대한 툴팁 정렬 (`start`, `center`, `end`) |
| `clickable` | `boolean` | `false` | | 열기 위해 트리거 클릭 필요 |
| `contentsHover` | `boolean` | `false` | | 콘텐츠에 마우스를 올리는 동안 툴팁 유지 |
| `disabled` | `boolean` | `false` | | 툴팁 비활성화 |
| `enterDelay` | `string \| number` | `0` | | 툴팁 표시 전 딜레이 (ms) |
| `escClose` | `boolean` | `true` | | Escape 키 누를 때 툴팁 닫기 |
| `leaveDelay` | `string \| number` | `0` | | 툴팁 숨김 전 딜레이 (ms) |
| `margin` | `string \| number` | `10` | | 트리거와 툴팁 사이의 간격 (px) |
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
    <vs-tooltip
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
        <vs-button>마우스를 올려보세요</vs-button>
        <template #tooltip>커스텀 툴팁</template>
    </vs-tooltip>
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 트리거 요소. 호버/클릭/포커스 리스너가 이 슬롯을 감싸는 wrapper에 부착됩니다. |
| `tooltip` | 플로팅 레이어에 표시될 툴팁 내용. |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |
