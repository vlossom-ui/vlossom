# VsToast & VsToastView

토스트 알림 메시지를 표시하는 컴포넌트 시스템입니다. `VsToast`는 개별 토스트 아이템 컴포넌트이고, `VsToastView`는 여러 토스트를 그룹화하여 위치별로 관리하는 컨테이너 컴포넌트입니다.

**Available Version**: 2.0.0+

> **참고**: 실제 사용 예시는 `toast-plugin`을 통해 제공됩니다. 자세한 사용법은 플러그인 문서를 참고하세요.

## VsToast

개별 토스트 메시지를 표시하는 컴포넌트입니다. 자동 닫기 기능, 색상 테마, 커스텀 스타일 등을 지원합니다.

### 기본 사용법

```html
<template>
    <!-- 기본 토스트 -->
    <vs-toast @close="handleClose">
        메시지 내용
    </vs-toast>

    <!-- 자동 닫기 비활성화 -->
    <vs-toast :auto-close="false" @close="handleClose">
        수동으로 닫아야 하는 메시지
    </vs-toast>

    <!-- 커스텀 타임아웃 -->
    <vs-toast :timeout="3000" @close="handleClose">
        3초 후 자동으로 닫히는 메시지
    </vs-toast>
</template>
```

### Props

| Prop          | Type                        | Default | Required | Description                                               |
| ------------- | --------------------------- | ------- | -------- | --------------------------------------------------------- |
| `colorScheme` | `string`                    | -       | -        | 토스트의 색상 테마                                        |
| `styleSet`    | `string \| VsToastStyleSet` | -       | -        | 커스텀 스타일 설정 객체                                   |
| `autoClose`   | `boolean`                   | `true`  | -        | 자동 닫기 기능 활성화 여부                                |
| `primary`     | `boolean`                   | `true`  | -        | 주요 스타일 적용 여부                                     |
| `timeout`     | `number`                    | `5000`  | -        | 자동 닫기 시간 (밀리초), `autoClose`가 `true`일 때만 적용 |

### Types

```typescript
interface VsToastStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: number;

    height?: string;
    fontColor?: string;
}
```

### Slots

| Slot      | Description                 |
| --------- | --------------------------- |
| `default` | 토스트 내부에 표시할 콘텐츠 |

### Events

| Event   | Description                                              | Payload |
| ------- | -------------------------------------------------------- | ------- |
| `close` | 토스트가 닫힐 때 발생 (닫기 버튼 클릭 또는 자동 닫기 시) | -       |

### 특징

- **자동 닫기**: `autoClose` prop과 `timeout`을 통해 지정된 시간 후 자동으로 닫힘
- **호버 일시정지**: 마우스를 올리면 타이머가 설정되어 있더라도 닫히지 않게 처리함
- **색상 테마**: `colorScheme` prop으로 일관된 색상 스키마 적용
- **스타일 커스터마이징**: `styleSet` prop으로 세밀한 스타일 조정 가능
- **닫기 버튼**: 기본적으로 닫기 버튼이 제공되어 수동으로 닫을 수 있음

---

## VsToastView

여러 토스트를 위치별로 그룹화하여 렌더링하는 컨테이너 컴포넌트입니다.
`toast-plugin`을 통해 자동으로 마운트되며, 각 토스트의 `placement`와 `align` 속성에 따라 적절한 위치에 배치합니다.

### Props

| Prop        | Type     | Default  | Required | Description                       |
| ----------- | -------- | -------- | -------- | --------------------------------- |
| `container` | `string` | `'body'` | -        | 토스트가 렌더링될 컨테이너 선택자 |

### 특징

- **자동 그룹화**: `placement`와 `align` 속성에 따라 토스트를 자동으로 그룹화
- **위치별 렌더링**: 동일한 위치의 토스트들을 하나의 컨테이너에 렌더링
- **전환 효과**: `TransitionGroup`을 사용하여 토스트 추가/제거 시 부드러운 애니메이션 적용
- **고정 위치**: `container`가 `'body'`일 때 `position: fixed` 스타일 적용

---

### 컴포넌트 관계

`VsToastView`는 내부적으로 `VsToast` 컴포넌트를 사용하여 각 토스트 메시지를 렌더링합니다.
`toast-plugin`을 통해 토스트를 추가하면, `VsToastView`가 자동으로 마운트되고 해당 토스트가 적절한 위치에 표시됩니다.
