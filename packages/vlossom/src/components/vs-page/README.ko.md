> For English documentation, see [README.md](./README.md).

# VsPage

제목, 설명, 콘텐츠 영역을 갖춘 구조화된 페이지 컨테이너 레이아웃 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 제목(title), 설명(description), 메인 콘텐츠(default) 슬롯으로 구성된 구조적 레이아웃 제공
- 컨테이너 너비에 따라 패딩이 자동으로 반응형으로 조정됨
- 각 영역(component, title, description, content)에 대해 CSS 직접 스타일링 지원
- 추가 의존성 없이 경량 래퍼로 동작

## 기본 사용법

```html
<template>
    <vs-page>
        <template #title>페이지 제목</template>
        <template #description>페이지 설명입니다.</template>
        <p>메인 콘텐츠가 여기에 표시됩니다.</p>
    </vs-page>
</template>
```

### 슬롯 없이 사용

```html
<template>
    <vs-page>
        <p>제목과 설명 없이 콘텐츠만 표시합니다.</p>
    </vs-page>
</template>
```

## Props

| Prop       | Type                      | Default | Required | 설명                               |
| ---------- | ------------------------- | ------- | -------- | ---------------------------------- |
| `styleSet` | `string \| VsPageStyleSet` | -       | -        | 컴포넌트에 적용할 커스텀 스타일 세트 |

## Types

```typescript
interface VsPageStyleSet {
    component?: CSSProperties;
    title?: CSSProperties;
    description?: CSSProperties;
    content?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-page
        :style-set="{
            component: { backgroundColor: '#f9f9f9', padding: '2rem' },
            title: { color: '#333', fontSize: '1.5rem', fontWeight: 'bold' },
            description: { color: '#666', fontSize: '0.9rem' },
            content: { paddingTop: '1rem' },
        }"
    >
        <template #title>스타일이 적용된 페이지</template>
        <template #description>커스텀 스타일이 적용된 상태입니다.</template>
        <p>콘텐츠 영역</p>
    </vs-page>
</template>
```

## Events

| Event | Payload | 설명 |
| ----- | ------- | ---- |

## Slots

| Slot          | 설명                               |
| ------------- | ---------------------------------- |
| `default`     | 메인 콘텐츠 영역                   |
| `title`       | 페이지 제목 영역 (선택 사항)       |
| `description` | 페이지 설명 영역 (선택 사항)       |

## Methods

| Method | Parameters | 설명 |
| ------ | ---------- | ---- |
