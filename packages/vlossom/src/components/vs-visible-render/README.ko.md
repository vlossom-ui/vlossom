> For English documentation, see [README.md](./README.md).

# VsVisibleRender

IntersectionObserver를 사용하여 자식 요소의 가시성을 추적하고 렌더링 성능을 최적화하는 컨테이너 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- `IntersectionObserver`를 사용하여 뷰포트에서 어떤 자식이 보이는지 추적
- CSS 기반 표시/숨김을 위해 각 자식에 `data-io-visible` 속성 설정
- `MutationObserver`를 사용하여 DOM 변경에 자동으로 반응
- 세밀한 교차 제어를 위한 설정 가능한 `rootMargin` 및 `threshold`
- 선택적 `height` prop으로 내부 스크롤 컨테이너 생성
- 노출된 메서드를 통한 프로그래밍 방식 스크롤 지원
- 모든 자식을 한 번에 표시하기 위해 비활성화 가능

## 기본 사용법

```html
<template>
    <vs-visible-render>
        <div v-for="item in items" :key="item.id">
            {{ item.name }}
        </div>
    </vs-visible-render>
</template>
```

### 고정 높이 (내부 스크롤)

```html
<template>
    <vs-visible-render height="400px">
        <div v-for="item in largeList" :key="item.id" class="list-item">
            {{ item.name }}
        </div>
    </vs-visible-render>
</template>
```

### 비활성화 모드

```html
<template>
    <vs-visible-render disabled>
        <div v-for="item in items" :key="item.id">
            {{ item.name }}
        </div>
    </vs-visible-render>
</template>
```

### 커스텀 루트 마진 및 임계값

```html
<template>
    <vs-visible-render root-margin="100px" :threshold="0.5">
        <div v-for="item in items" :key="item.id">
            {{ item.name }}
        </div>
    </vs-visible-render>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `disabled` | `boolean` | `false` | | 교차 관찰 비활성화; 모든 자식이 표시됨 |
| `height` | `string \| number` | | | 주어진 높이의 내부 스크롤 가능한 컨테이너 생성 |
| `rootMargin` | `string` | `'0px'` | | 교차 계산을 위한 루트 주변 마진 |
| `selector` | `string` | `null` | | 컴포넌트 내 스크롤 컨테이너 요소를 찾는 CSS 선택자 |
| `tag` | `string` | `'div'` | | 컨테이너 요소의 HTML 태그 |
| `threshold` | `number` | `0` | | 교차 비율 임계값 (0~1) |

## 타입

이 컴포넌트에는 StyleSet이 없습니다.

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 관찰할 자식 요소 |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |
| `scrollToElement` | `element: HTMLElement` | 주어진 요소가 보이도록 컨테이너를 스크롤 |

## 주의사항

`threshold` prop은 `0`에서 `1` 사이의 숫자여야 합니다(포함). 이 범위 밖의 값은 prop 유효성 검사 오류를 발생시킵니다.
