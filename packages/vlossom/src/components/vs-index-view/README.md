# VsIndexView

슬롯 콘텐츠 중 특정 인덱스에 해당하는 항목만 렌더링하는 인덱스 기반 뷰 컴포넌트입니다. v-model을 통해 현재 표시할 인덱스를 제어할 수 있으며, keep-alive 옵션으로 컴포넌트 상태 보존이 가능합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 인덱스 뷰

```html
<template>
    <vs-index-view v-model="currentIndex">
        <div>첫 번째 콘텐츠</div>
        <div>두 번째 콘텐츠</div>
        <div>세 번째 콘텐츠</div>
    </vs-index-view>
</template>

<script setup>
import { ref } from 'vue';

const currentIndex = ref(0);
</script>
```

### keep-alive 비활성화

```html
<template>
    <vs-index-view v-model="currentIndex" :keep-alive="false">
        <MyComponent />
        <AnotherComponent />
        <ThirdComponent />
    </vs-index-view>
</template>
```

### v-for를 사용한 동적 콘텐츠

```html
<template>
    <vs-index-view v-model="currentIndex">
        <div v-for="item in items" :key="item.id" class="item-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
        </div>
    </vs-index-view>
</template>
```

## Props

| Prop         | Type                              | Default | Required | Description                                    |
| ------------ | --------------------------------- | ------- | -------- | ---------------------------------------------- |
| `modelValue` | `number`                          | `0`     | -        | 현재 표시할 슬롯의 인덱스 (v-model로 바인딩)   |
| `keepAlive`  | `boolean`                         | `false` | -        | 컴포넌트 상태 보존을 위한 keep-alive 사용 여부 |
| `width`      | `string \| number \| Breakpoints` | -       | -        | 반응형 너비 설정                               |
| `grid`       | `string \| number \| Breakpoints` | -       | -        | 반응형 그리드 컬럼 수                          |

## Events

| Event               | Payload  | Description                |
| ------------------- | -------- | -------------------------- |
| `update:modelValue` | `number` | 인덱스 값이 변경될 때 발생 |

## Methods

| Method        | Parameter | Description                     |
| ------------- | --------- | ------------------------------- |
| `updateIndex` | `number`  | 인덱스를 변경하고 이벤트를 emit |

## Types

```typescript
interface Breakpoints {
    xs?: string | number; // 0px 이상
    sm?: string | number; // 640px 이상
    md?: string | number; // 768px 이상
    lg?: string | number; // 1024px 이상
    xl?: string | number; // 1280px 이상
}
```

## Slots

| Slot      | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| `default` | 인덱스 기반으로 표시할 콘텐츠들. 각 자식 요소가 하나의 인덱스가 됨 |

## 특징

- **v-model 지원**: `modelValue` prop과 `update:modelValue` 이벤트를 통한 양방향 데이터 바인딩
- **Keep-alive 옵션**: vue 내장 컴포넌트 KeepAlive를 이용해서 view 상태 보존 가능
- **Fragment 노드 평면화**: `v-for`로 생성된 여러 요소들이 각각 개별 인덱스로 인식
- **자동 주석 필터링**: HTML 주석과 빈 텍스트 노드는 자동으로 제외되어 정확한 인덱싱 보장
- **반응형 지원**: `width`와 `grid` props를 통한 반응형 레이아웃 구현
- **vs-responsive 래핑**: 내부적으로 vs-responsive 컴포넌트로 래핑되어 일관된 반응형 동작 제공
- **유연한 콘텐츠**: 일반 HTML 요소, Vue 컴포넌트 등 다양한 슬롯 콘텐츠 지원

## 사용 사례

- **탭 인터페이스**: 여러 패널 중 하나만 표시하는 탭 UI
- **스텝 플로우**: 단계별 프로세스에서 현재 단계만 표시
- **조건부 렌더링**: 상태에 따라 다른 컨텐츠 표시
