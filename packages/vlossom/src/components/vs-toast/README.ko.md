> For English documentation, see [README.md](./README.md).

# VsToast

자동 닫기, 호버 일시 정지, 닫기 버튼을 지원하는 토스트 알림 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 설정 가능한 타임아웃 후 자동 닫기 (기본 5초)
- 마우스가 토스트 위에 있을 때 자동 닫기 타이머 일시 정지
- `close` 이벤트를 발생시키는 내장 닫기 버튼
- Primary 및 일반 시각적 변형
- 여러 토스트 관리를 위해 `VsToastView`와 함께 사용하도록 설계

## 기본 사용법

```html
<template>
    <vs-toast @close="handleClose">
        작업이 성공적으로 완료되었습니다!
    </vs-toast>
</template>
```

### 커스텀 타임아웃

```html
<template>
    <vs-toast :timeout="3000" @close="handleClose">
        이 토스트는 3초 후에 닫힙니다.
    </vs-toast>
</template>
```

### 수동 닫기 전용

```html
<template>
    <vs-toast :auto-close="false" @close="handleClose">
        X 버튼을 클릭하여 닫으세요.
    </vs-toast>
</template>
```

### VsToastView 사용

`VsToastView`는 모든 활성 토스트를 렌더링하는 컨테이너 컴포넌트입니다. 앱 루트에 한 번 배치하세요.

```html
<template>
    <vs-toast-view />
</template>
```

토스트는 일반적으로 `$vs.toast` 플러그인 API를 통해 트리거됩니다.

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트 색상 스키마 |
| `styleSet` | `string \| VsToastStyleSet` | | | 컴포넌트 커스텀 스타일 세트 |
| `autoClose` | `boolean` | `true` | | `timeout` ms 후 자동으로 닫기 |
| `primary` | `boolean` | `true` | | 토스트에 Primary 색상 적용 |
| `timeout` | `number` | `5000` | | 자동 닫기까지 대기 시간(밀리초) |

## 타입

```typescript
interface VsToastStyleSet {
    closeButton?: Omit<VsButtonStyleSet, 'loading'>;
    component?: CSSProperties;
}
```

> [!NOTE]
> `closeButton`은 [`VsButtonStyleSet`](../vs-button/README.ko.md)을 사용합니다(`loading` 제외).

### StyleSet 예시

```html
<template>
    <vs-toast
        :style-set="{
            component: {
                backgroundColor: '#323232',
                color: '#ffffff',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
            },
            closeButton: {
                component: { color: '#ffffff' },
            },
        }"
    >
        커스텀 스타일 토스트
    </vs-toast>
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `close` | | 토스트를 닫아야 할 때 발생 (자동 닫기 또는 닫기 버튼 클릭) |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 토스트 메시지 내용 |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |
