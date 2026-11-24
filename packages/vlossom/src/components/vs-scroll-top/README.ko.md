> For English documentation, see [README.md](./README.md).

# VsScrollTop

스크롤이 일정 거리 이상 내려가면 나타나고, 클릭하면 스크롤 컨테이너(기본값은 `window`)의 맨 위로 이동시키는 버튼입니다.

**사용 가능 버전**: 2.4.0+

## 기능

- `threshold`만큼 스크롤되면 자동으로 나타나고, 다시 올라가면 사라짐
- `window`뿐 아니라 `target` selector로 지정한 내부 스크롤 컨테이너도 지원
- 기본은 `position: absolute`이고, `fixed`를 지정하면 viewport 기준으로 고정
- 기본 위치는 우하단이며 `styleSet`으로 변경
- 기본 버튼의 동작과 외형은 `VsButton`에 위임 (`primary`, `outline`, `ghost`, `size`)
- `default` slot으로 버튼 전체를 교체 가능 (`scrollToTop`을 slot props로 제공)
- `noAnimation`으로 fade 애니메이션과 smooth scroll을 함께 끔
- 사용자 OS의 `prefers-reduced-motion` 설정을 존중해 애니메이션 없이 즉시 이동
- 다국어 aria-label 기본 제공 (`VS_ARIA_SCROLL_TOP`)

## 기본 사용법

```html
<template>
    <vs-scroll-top fixed />
</template>
```

### 내부 스크롤 컨테이너

```html live
<template>
    <div style="position: relative">
        <div id="scroll-area" style="height: 300px; overflow-y: auto">
            <p v-for="i in 50" :key="i">Line {{ i }}</p>
        </div>
        <vs-scroll-top target="#scroll-area" />
    </div>
</template>
```

### Threshold 지정

```html
<template>
    <vs-scroll-top fixed :threshold="500" primary />
</template>
```

### 커스텀 버튼

```html
<template>
    <vs-scroll-top fixed v-slot="{ scrollToTop }">
        <vs-button outline aria-label="맨 위로" @click="scrollToTop">TOP</vs-button>
    </vs-scroll-top>
</template>
```

## Props

| Prop          | Type                            | Default | Required | Description                                                                              |
| ------------- | ------------------------------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| `colorScheme` | `ColorScheme`                   |         |          | 컴포넌트 color scheme                                                                    |
| `styleSet`    | `string \| VsScrollTopStyleSet` |         |          | 커스텀 style set                                                                         |
| `ghost`       | `boolean`                       | `false` |          | 기본 버튼에 ghost 스타일 적용                                                            |
| `outline`     | `boolean`                       | `false` |          | 기본 버튼에 outline 스타일 적용                                                          |
| `primary`     | `boolean`                       | `false` |          | 기본 버튼에 primary 스타일 적용                                                          |
| `size`        | `Size`                          | `'md'`  |          | 기본 버튼 크기 (`xs`~`xl`)                                                               |
| `fixed`       | `boolean`                       | `false` |          | `position: fixed`로 viewport 기준 고정                                                   |
| `noAnimation` | `boolean`                       | `false` |          | fade 애니메이션과 smooth scroll을 끄고 즉시 이동 (`prefers-reduced-motion` 시 항상 적용) |
| `target`      | `string`                        | `''`    |          | 스크롤 컨테이너의 CSS selector. 비어 있으면 `window`                                     |
| `threshold`   | `number \| string`              | `200`   |          | 버튼이 나타나는 스크롤 거리(px). `0`이면 항상 표시                                       |

## 타입

```typescript
interface VsScrollTopStyleSet extends CSSProperties {
    $button?: VsButtonStyleSet;
}

interface VsScrollTopRef extends ComponentPublicInstance<typeof VsScrollTop> {
    scrollToTop: () => void;
}
```

> [!NOTE]
> 루트 `CSSProperties`는 위치를 담당하는 래퍼에 적용됩니다. 기본값은 `right: 2rem`, `bottom: 2rem`입니다.
> `$button`은 기본 버튼에 적용되는 `VsButtonStyleSet`입니다. 자세한 내용은 [VsButton 문서](../vs-button/README.ko.md)를 참고하세요.

### StyleSet 예시

```html
<template>
    <vs-scroll-top
        fixed
        :style-set="{
            right: 'auto',
            left: '1rem',
            bottom: '5rem',
            $button: {
                borderRadius: '50%',
                width: '3rem',
                height: '3rem',
            },
        }"
    />
</template>
```

## 이벤트

| Event  | Payload | Description |
| ------ | ------- | ----------- |
| (없음) |         |             |

## 슬롯

| Slot      | Description                                                                                                     |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| `default` | 버튼 전체를 교체. slot props로 `{ scrollToTop: () => void }`를 받음. 기본값은 `ArrowUpIcon`이 들어간 `VsButton` |

## 메서드

| Method        | Parameters | Description                                                                                 |
| ------------- | ---------- | ------------------------------------------------------------------------------------------- |
| `scrollToTop` | -          | 대상 컨테이너를 맨 위로 스크롤 (`noAnimation`이거나 `prefers-reduced-motion`이면 즉시 이동) |

## 주의사항

- 기본값이 `position: absolute`이므로 `window` 스크롤에 쓸 때는 `fixed`를 지정해야 합니다. 지정하지 않으면 버튼이 문서와 함께 스크롤됩니다.
- `target`을 쓸 때는 버튼을 스크롤 컨테이너 **밖**의 `position: relative` 래퍼 안에 두어야 합니다. 컨테이너 안에 두면 버튼도 같이 스크롤됩니다.
- `target`은 mount 시점에 한 번만 조회합니다. 대상 요소가 나중에 렌더링되면 `v-if`/`key`로 `vs-scroll-top`도 함께 다시 mount해야 합니다. 일치하는 요소가 없으면 `threshold`가 `0`이어도 버튼을 렌더링하지 않습니다.
- 위치를 왼쪽이나 위쪽으로 옮길 때는 기본값을 `right: 'auto'` 또는 `bottom: 'auto'`로 해제해야 합니다. 해제하지 않으면 양쪽 값이 함께 적용됩니다.
- `default` slot을 사용하면 `ghost`, `outline`, `primary`, `size`, `$button`과 기본 aria-label은 적용되지 않습니다. 클릭 처리(`scrollToTop`)와 접근성 속성은 slot 내용에서 직접 지정해야 합니다.
- 클릭으로 스크롤이 `threshold` 위로 올라가면 버튼이 제거되므로 키보드 focus는 `body`로 이동합니다. 키보드 사용자를 위해 상단으로 focus를 옮겨야 한다면 `scrollToTop` 호출 뒤 직접 이동시키세요 (예: `default` slot에서).
