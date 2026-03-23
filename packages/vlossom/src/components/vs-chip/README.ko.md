> English: [README.md](./README.md)

# VsChip

작은 정보나 태그를 표시하는 칩 컴포넌트입니다. 아이콘과 닫기 버튼을 지원하여 다양한 용도로 활용할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 칩

```html
<template>
    <vs-chip>기본 칩</vs-chip>
</template>
```

### 아이콘이 있는 칩

```html
<template>
    <vs-chip>
        <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        </template>
        성공
    </vs-chip>
</template>
```

### 닫기 버튼이 있는 칩

```html
<template>
    <vs-chip closable @close="handleClose">닫을 수 있는 칩</vs-chip>
</template>
```

### 다양한 스타일의 칩

```html
<template>
    <vs-chip primary>Primary 칩</vs-chip>
    <vs-chip size="sm">작은 칩</vs-chip>
    <vs-chip size="lg">큰 칩</vs-chip>
    <vs-chip closable>닫기 가능한 칩</vs-chip>
</template>
```

## Props

| Prop          | Type                                   | Default | Required | Description                             |
| ------------- | -------------------------------------- | ------- | -------- | --------------------------------------- |
| `colorScheme` | `string`                               | -       | -        | 컴포넌트 색상 테마                      |
| `styleSet`    | `string \| VsChipStyleSet`             | -       | -        | 커스텀 스타일 설정 객체                 |
| `closable`    | `boolean`                              | `false` | -        | 닫기 버튼 표시 여부                     |
| `outline`     | `boolean`                              | `false` | -        | outline 스타일 설정                     |
| `primary`     | `boolean`                              | `false` | -        | 주요 정보를 위한 프라이머리 스타일 적용 |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | -       | -        | 칩 크기                                 |

## Types

```typescript
interface VsChipStyleSet {
    variables?: {
        height?: string;
    };
    component?: CSSProperties;
    icon?: CSSProperties;
    closeButton?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-chip
        :style-set="{
            variables: {
                height: '3rem',
            },
            component: {
                backgroundColor: '#f3e5f5',
                border: '2px solid #9c27b0',
                borderRadius: '20px',
                color: '#7b1fa2',
            },
        }"
    >
        커스텀 칩
    </vs-chip>
</template>
```

## Slots

| Slot      | Description             |
| --------- | ----------------------- |
| `default` | 칩 내부에 표시할 콘텐츠 |
| `icon`    | 칩 앞쪽에 표시할 아이콘 |

## Events

| Event   | Description            | Payload |
| ------- | ---------------------- | ------- |
| `close` | 닫기 버튼 클릭 시 발생 | -       |

## 특징

- **색상 테마**: `colorScheme` prop으로 미리 정의된 색상 조합 적용
- **스타일 커스터마이징**: `styleSet` prop으로 세밀한 스타일 조정
- **아이콘 지원**: `icon` slot을 통해 아이콘 추가 가능
- **닫기 기능**: `closable` prop으로 닫기 버튼 표시 및 이벤트 처리
- **크기 변형**: `size` 속성을 통한 크기 조절 (`xs`, `sm`, `md`, `lg`, `xl`)
