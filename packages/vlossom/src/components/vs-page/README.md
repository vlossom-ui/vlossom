# VsPage

페이지의 메인 콘텐츠 영역을 구성하는 페이지 컴포넌트입니다. 제목과 설명을 표시하는 헤더 영역을 제공하며, 반응형 패딩을 통해 다양한 화면 크기에서 최적화된 레이아웃을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 페이지

```html
<template>
    <vs-page>
        <template #title>
            <h1>페이지 제목</h1>
        </template>
        <template #description>
            <p>이 페이지는 Vlossom의 페이지 컴포넌트입니다.</p>
        </template>
        <section>
            <p>페이지의 컨텐츠를 여기에 표시합니다.</p>
        </section>
    </vs-page>
</template>
```

### 커스텀 스타일링

VsPage는 전체 페이지, title 영역, description 영역에 대해 각각 독립적인 스타일링을 제공합니다.

#### 기본 스타일링

```html
<template>
    <vs-page :style-set="pageStyle">
        <template #title>
            <h1>커스텀 스타일 페이지</h1>
        </template>
        <template #description>
            <p>개별 영역에 다른 스타일이 적용된 페이지입니다.</p>
        </template>
        <p>메인 콘텐츠 영역입니다.</p>
    </vs-page>
</template>

<script setup>
const pageStyle = {
    padding: '2rem 3rem',
    fontColor: '#2c3e50',
    title: {
        fontColor: '#e74c3c',
        fontSize: '2.5rem',
        fontWeight: 'bold'
    },
    description: {
        fontColor: '#7f8c8d',
        fontSize: '1.1rem'
    }
};
</script>
```

#### 개별 영역 세부 스타일링

title과 description 영역은 각각의 패딩과 텍스트 스타일을 독립적으로 설정할 수 있습니다:

```html
<template>
    <vs-page :style-set="detailedPageStyle">
        <template #title>
            <h1>상세 커스텀 페이지</h1>
        </template>
        <template #description>
            <p>각 영역별로 세밀한 스타일 조정이 가능합니다.</p>
        </template>
        <div>메인 콘텐츠</div>
    </vs-page>
</template>

<script setup>
const detailedPageStyle = {
    // 전체 페이지 스타일
    padding: '3rem 4rem',
    fontColor: '#2c3e50',
    fontSize: '1rem',
    lineHeight: '1.6',

    // 제목 영역 스타일
    title: {
        padding: '0 0 2rem 0', // 제목 하단에 더 큰 여백
        fontColor: '#e74c3c',
        fontSize: '3rem',
        fontWeight: '700',
        lineHeight: '1.2',
        whiteSpace: 'nowrap' // 제목이 긴 경우 줄바꿈 방지
    },

    // 설명 영역 스타일
    description: {
        padding: '0 0 1.5rem 0', // 설명 하단 여백
        fontColor: '#7f8c8d',
        fontSize: '1.2rem',
        fontWeight: '300',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap' // 줄바꿈 허용
    }
};
</script>
```

### 미리 정의된 스타일 세트 사용

글로벌 스타일 세트를 미리 정의하여 여러 컴포넌트에서 재사용할 수 있습니다:

```html
<template>
    <vs-page style-set="myCustomPageStyle">
        <template #title>
            <h1>스타일 세트 페이지</h1>
        </template>
        <template #description>
            <p>미리 정의된 스타일이 적용된 설명입니다.</p>
        </template>
        <p>미리 정의된 스타일이 적용된 페이지입니다.</p>
    </vs-page>
</template>

<script setup>
import { useVlossom } from '@/framework';

// 글로벌 스타일 세트 등록
useVlossom().styleSet = {
    myCustomPageStyle: {
        VsPage: {
            padding: '3rem 4rem',
            fontColor: '#34495e',
            fontSize: '1.1rem',
            title: {
                fontColor: '#2c3e50',
                fontSize: '2.8rem',
                fontWeight: 'bold',
                padding: '0 0 1.5rem 0'
            },
            description: {
                fontColor: '#95a5a6',
                fontSize: '1.2rem',
                fontWeight: '300'
            }
        }
    }
};
</script>
```

## Props

| Prop       | Type                       | Default | Required | Description             |
| ---------- | -------------------------- | ------- | -------- | ----------------------- |
| `styleSet` | `string \| VsPageStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |

## Types

```typescript
interface VsPageStyleSet extends TextStyleSet {
    padding?: string; // 페이지 전체 패딩
    title?: TextStyleSet & { padding?: string }; // 제목 영역 스타일
    description?: TextStyleSet & { padding?: string }; // 설명 영역 스타일
}

interface TextStyleSet {
    fontColor?: string; // 텍스트 색상
    fontSize?: string; // 폰트 크기
    fontWeight?: string | number; // 폰트 굵기
    lineHeight?: string; // 줄 간격
    whiteSpace?: string; // 공백 처리 방식
}
```

## Slots

| Slot          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `default`     | 페이지의 메인 콘텐츠 영역                                       |
| `title`       | 페이지 제목 (선택적, 볼드체 XL 사이즈, 줄바꿈 방지 기본 스타일) |
| `description` | 페이지 설명 (선택적, 라이트 웨이트 SM 사이즈 기본 스타일)       |

### 슬롯별 기본 스타일

각 슬롯은 다음과 같은 기본 스타일이 적용됩니다:

- **title**: 볼드체(`font-weight: bold`), 큰 사이즈(`font-size: xl`), 줄바꿈 방지(`white-space: nowrap`)로 설정되어 단일 줄의 강조된 제목에 최적화
- **description**: 라이트 웨이트(`font-weight: light`), 작은 사이즈(`font-size: sm`)로 설정되어 부가 설명 텍스트에 적합
- **default(content)**: 시스템 기본 폰트 스타일을 사용하여 본문 콘텐츠에 적합한 가독성 제공

## CSS 변수

컴포넌트는 다음 CSS 변수를 생성합니다:

### 페이지 전체

- `--vs-page-padding`: 페이지 내부 여백
- `--vs-page-fontColor`: 메인 콘텐츠 텍스트 색상
- `--vs-page-fontSize`: 메인 콘텐츠 폰트 크기
- `--vs-page-fontWeight`: 메인 콘텐츠 폰트 굵기
- `--vs-page-lineHeight`: 메인 콘텐츠 줄 간격
- `--vs-page-whiteSpace`: 메인 콘텐츠 공백 처리

### 제목 영역

- `--vs-page-title-padding`: 제목 영역 패딩
- `--vs-page-title-fontColor`: 제목 텍스트 색상
- `--vs-page-title-fontSize`: 제목 폰트 크기
- `--vs-page-title-fontWeight`: 제목 폰트 굵기
- `--vs-page-title-lineHeight`: 제목 줄 간격
- `--vs-page-title-whiteSpace`: 제목 공백 처리

### 설명 영역

- `--vs-page-description-padding`: 설명 영역 패딩
- `--vs-page-description-fontColor`: 설명 텍스트 색상
- `--vs-page-description-fontSize`: 설명 폰트 크기
- `--vs-page-description-fontWeight`: 설명 폰트 굵기
- `--vs-page-description-lineHeight`: 설명 줄 간격
- `--vs-page-description-whiteSpace`: 설명 공백 처리

## 특징

- **반응형 패딩**: TailwindCSS의 Container Query를 사용하여 화면 크기에 따라 자동으로 패딩 조정
    - 1024px 이하: `1.8rem 2.5rem`
    - 768px 이하: `1.4rem 2rem`
    - 640px 이하: `1rem 1.5rem`
- **구조적 레이아웃**: title, description, content를 명확하게 구분한 시멘틱 구조
- **개별 영역 스타일링**: title과 description 각각에 대해 독립적인 스타일 적용 가능
- **유연한 스타일링**: 인라인 객체 또는 미리 정의된 스타일 세트 모두 지원
- **선택적 슬롯**: title과 description은 필요에 따라 선택적으로 사용 가능
