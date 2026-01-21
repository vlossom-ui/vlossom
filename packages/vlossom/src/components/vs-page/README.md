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

### StyleSet 사용 예시

```html
<template>
    <vs-page
        :style-set="{
            variables: {
                padding: '3rem 4rem',
                title: {
                    padding: '0 0 1.5rem 0',
                },
                description: {
                    padding: '0 0 2rem 0',
                },
            },
            component: {
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
            },
        }"
    >
        <template #title>
            <h1>커스텀 스타일 페이지</h1>
        </template>
        <template #description>
            <p>패딩과 배경색이 커스터마이징된 페이지입니다.</p>
        </template>
        <section>
            <p>페이지 컨텐츠</p>
        </section>
    </vs-page>
</template>
```

## Props

| Prop       | Type                       | Default | Required | Description             |
| ---------- | -------------------------- | ------- | -------- | ----------------------- |
| `styleSet` | `string \| VsPageStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |

## Types

```typescript
interface VsPageStyleSet {
    variables?: {
        padding?: string;
        title?: {
            padding?: string;
        };
        description?: {
            padding?: string;
        };
    };
    component?: CSSProperties;
}
```

## Slots

| Slot          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `default`     | 페이지의 메인 콘텐츠 영역                                       |
| `title`       | 페이지 제목 (선택적, 볼드체 XL 사이즈, 줄바꿈 방지 기본 스타일) |
| `description` | 페이지 설명 (선택적, 라이트 웨이트 SM 사이즈 기본 스타일)       |

## 특징

- **반응형 패딩**: TailwindCSS의 Container Query를 사용하여 화면 크기에 따라 자동으로 패딩 조정
    - 1024px 이하: `1.8rem 2.5rem`
    - 768px 이하: `1.4rem 2rem`
    - 640px 이하: `1rem 1.5rem`
- **구조적 레이아웃**: title, description, content를 명확하게 구분한 시멘틱 구조
- **선택적 슬롯**: title과 description은 필요에 따라 선택적으로 사용 가능
