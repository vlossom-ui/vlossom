# VsBlock

콘텐츠를 명확히 구분하고 그룹핑하는 블록형 컨테이너 컴포넌트입니다. 제목과 본문 콘텐츠를 분리하여 표시할 수 있으며, Container Query를 활용한 반응형 패딩을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 블록

```html
<template>
    <vs-block>
        <p>블록 내부의 콘텐츠입니다.</p>
    </vs-block>
</template>
```

### 제목이 있는 블록

```html
<template>
    <vs-block>
        <template #title>
            <h2>블록 제목</h2>
        </template>
        <p>블록 본문 콘텐츠입니다.</p>
        <p>여러 줄의 내용을 포함할 수 있습니다.</p>
    </vs-block>
</template>
```

### VsGrid와 함께 사용

VsGrid 컴포넌트와 조합하여 반응형 그리드 레이아웃을 구성할 수 있습니다.

```html
<template>
    <!-- 3컬럼 그리드에서 각 블록이 1컬럼씩 차지 -->
    <vs-grid grid-size="3" column-gap="16px" row-gap="16px">
        <vs-block grid="1">
            <template #title>카드 1</template>
            <p>첫 번째 카드 내용</p>
        </vs-block>
        <vs-block grid="1">
            <template #title>카드 2</template>
            <p>두 번째 카드 내용</p>
        </vs-block>
        <vs-block grid="2">
            <template #title>넓은 카드</template>
            <p>2컬럼을 차지하는 넓은 카드</p>
        </vs-block>
    </vs-grid>
</template>
```

화면 크기에 따라 다른 컬럼 수를 지정할 수도 있습니다.

```html
<template>
    <vs-grid grid-size="12">
        <vs-block :grid="{ xs: 12, sm: 6, md: 4, lg: 3 }">
            <template #title>반응형 블록</template>
            <p>화면 크기에 따라 크기가 변경되는 블록입니다.</p>
            <ul>
                <li>모바일(xs): 전체 너비</li>
                <li>태블릿(sm): 절반 너비</li>
                <li>데스크탑(md): 1/3 너비</li>
                <li>대형 화면(lg): 1/4 너비</li>
            </ul>
        </vs-block>
    </vs-grid>
</template>
```

## Props

| Prop          | Type                              | Default | Required | Description                       |
| ------------- | --------------------------------- | ------- | -------- | --------------------------------- |
| `colorScheme` | `ColorScheme`                     | -       | -        | 컴포넌트 색상 테마                |
| `styleSet`    | `string \| VsBlockStyleSet`       | -       | -        | 커스텀 스타일 설정 객체           |
| `grid`        | `string \| number \| Breakpoints` | -       | -        | 그리드 컬럼 수 지정 (반응형 지원) |
| `width`       | `string \| number`                | -       | -        | 블록 너비 설정                    |
| `height`      | `string \| number`                | -       | -        | 블록 높이 설정                    |

## Types

```typescript
interface VsBlockStyleSet {
    variables?: {
        border?: string;
    };
    component?: CSSProperties;
    title?: CSSProperties;
    content?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <!-- 기본 스타일 커스터마이징 -->
    <vs-block :style-set="{
        variables: {
            border: '2px solid #3498db',
        },
        component: {
            backgroundColor: '#ecf0f1',
            borderRadius: '12px',
        },
        title: {
            backgroundColor: '#3498db',
            color: '#ffffff',
            padding: '1rem 1.5rem',
        },
    }">
        <template #title>커스텀 블록</template>
        블록 내용
    </vs-block>
</template>
```

## Slots

| Slot      | Description               |
| --------- | ------------------------- |
| `title`   | 블록 상단에 표시할 제목   |
| `default` | 블록 본문에 표시할 콘텐츠 |

## 특징

- **명확한 콘텐츠 구분**: 제목과 본문을 시각적으로 분리하여 정보 구조를 명확히 함
- **Container Query 반응형**: 컨테이너 크기에 따라 자동으로 패딩이 조정되어 모든 화면 크기에서 최적화된 레이아웃 제공
- **반응형 그리드 지원**: `grid` prop을 통해 `VsGrid`와 함께 화면 크기별로 다른 컬럼 수를 지정하여 유연한 레이아웃 구성 가능
- **독립적인 스타일링**: 제목과 본문 영역을 각각 다른 스타일로 커스터마이징 가능

## Container Query 동작

블록은 다음과 같이 반응형 패딩을 제공합니다:

- **1024px 초과**: 제목 `0.8rem 1.6rem`, 본문 `1.6rem 1.6rem`
- **768px~1024px**: 제목 `0.6rem 1.4rem`, 본문 `1.2rem 1.4rem`
- **640px~768px 이하**: 제목 `0.6rem 1.2rem`, 본문 `1rem 1.2rem`
- **640px 이하**: 제목 `0.6rem 1rem`, 본문 `0.8rem 1rem`
