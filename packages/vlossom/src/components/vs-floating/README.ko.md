> For English documentation, see [README.md](./README.md).

# VsFloating

텔레포트 오버레이에 렌더링되며 대상 요소를 기준으로 자동으로 위치를 잡는 플로팅 요소 컴포넌트로, 선택적 애니메이션을 지원합니다.

**사용 가능 버전**: 2.0.0+

## 기능

- CSS 선택자 대상 요소를 기준으로 자동 위치 지정
- 네 가지 배치 방향(`top`, `bottom`, `left`, `right`) 및 `middle` 모드 지원
- 정렬(`start`, `center`, `end`) 및 마진 오프셋 설정 가능
- 대상 요소의 너비와 일치하는 옵셔널 follow-width 모드
- 방향별 페이드 인/아웃 애니메이션 (`noAnimation`으로 비활성화 가능)
- 표시/숨김 지연 시간 설정 가능

## 기본 사용법

```html
<template>
    <div id="my-anchor">마우스를 올려보세요</div>
    <vs-floating v-model="show" target="#my-anchor" placement="bottom">
        <div class="tooltip-box">플로팅 콘텐츠</div>
    </vs-floating>
</template>

<script setup>
import { ref } from 'vue';
const show = ref(false);
</script>
```

### 상단 배치와 너비 따라가기

```html
<template>
    <input id="search-input" type="text" @focus="dropdownOpen = true" @blur="dropdownOpen = false" />
    <vs-floating v-model="dropdownOpen" target="#search-input" placement="bottom" follow-width>
        <div class="dropdown-list">드롭다운 항목들</div>
    </vs-floating>
</template>

<script setup>
import { ref } from 'vue';
const dropdownOpen = ref(false);
</script>
```

### 표시/숨김 지연 설정

```html
<template>
    <button id="delayed-btn">툴팁을 위해 마우스를 올려보세요</button>
    <vs-floating v-model="visible" target="#delayed-btn" placement="top" :enter-delay="300" :leave-delay="200">
        <div>지연된 툴팁</div>
    </vs-floating>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `target` | `string` | `''` | ✓ | 위치 기준이 되는 대상 요소의 CSS 선택자 |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | | 교차 축 방향의 정렬 |
| `disabled` | `boolean` | `false` | | 플로팅 요소 표시 방지 |
| `enterDelay` | `string \| number` | `0` | | 표시 전 지연 시간(밀리초) |
| `leaveDelay` | `string \| number` | `0` | | 숨김 전 지연 시간(밀리초) |
| `margin` | `string \| number` | `5` | | 대상과 플로팅 요소 사이의 픽셀 간격 |
| `noAnimation` | `boolean` | `false` | | 페이드 인/아웃 애니메이션 비활성화 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'middle'` | `'bottom'` | | 플로팅 요소의 선호 배치 방향 |
| `followWidth` | `boolean` | `false` | | 플로팅 요소 너비를 대상 요소 너비에 맞추기 |
| `overlayId` | `string` | `'#vs-floating-overlay'` | | 텔레포트 컨테이너의 CSS 선택자 |
| `modelValue` | `boolean` | `false` | | 플로팅 요소 표시/숨김을 위한 v-model 바인딩 |

## 타입

VsFloating은 `StyleSet` 인터페이스가 없습니다.

### StyleSet 예시

VsFloating은 `styleSet` prop을 사용하지 않습니다. 기본 슬롯을 통해 콘텐츠를 스타일링하세요.

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `update:modelValue` | `boolean` | 가시성이 변경될 때 발생 |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 플로팅 콘텐츠. 계산된 배치 방향을 반영하는 `{ placement: string }` 슬롯 props 제공 |

## 메서드

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
