# VsConfirm

확인(Confirm) 다이얼로그를 렌더링하는 경량 컴포넌트입니다. 기본적으로 두 개의 버튼(확인/취소)을 제공하며, `confirm-plugin`과 함께 사용하면 프로그래매틱하게 확인 창을 쉽게 띄울 수 있습니다.

**Available Version**: 2.0.0+

> **참고**: 일반적인 사용 흐름은 `confirm-plugin`에서 모달 형태로 `VsConfirm`을 마운트하는 방식입니다. 모달 시스템과 통합된 사용법은 플러그인 문서를 참고하세요.

## 기본 사용법

`confirm-plugin`을 사용하는 예시는 다음과 같습니다.

```ts
import { useVlossom } from '@/framework';

const { confirm } = useVlossom();

async function handleDelete() {
    const result = await confirm.open('정말로 삭제하시겠습니까?', {
        okText: '삭제',
        cancelText: '취소',
        colorScheme: 'red',
    });

    if (result) {
        // 삭제 로직 실행
    }
}
```

## Props

| Prop          | Type                          | Default    | Required | Description                                |
| ------------- | ----------------------------- | ---------- | -------- | ------------------------------------------ |
| `colorScheme` | `string`                      | -          | -        | 확인 창에서 사용할 컬러 스킴               |
| `styleSet`    | `string \| VsConfirmStyleSet` | -          | -        | 확인/취소 버튼에 적용할 커스텀 스타일 세트 |
| `okText`      | `string`                      | `'OK'`     | -        | 확인 버튼 레이블                           |
| `cancelText`  | `string`                      | `'Cancel'` | -        | 취소 버튼 레이블                           |
| `swapButtons` | `boolean`                     | `false`    | -        | 버튼을 오른쪽-왼쪽으로 교차 배치할지 여부  |

## Types

```typescript
interface VsConfirmStyleSet {
    width?: string;
    height?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: number;
    boxShadow?: string;
    fontColor?: string;
    zIndex?: string;
    dimmed?: {
        backgroundColor?: string;
        opacity?: number;
    };
    layout?: {
        header?: {
            padding?: string;
        };
        padding?: string;
        footer?: {
            padding?: string;
        };
    };
    okButton?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        padding?: string;
        opacity?: string;
        fontColor?: string;
    };
    cancelButton?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        padding?: string;
        opacity?: string;
        fontColor?: string;
    };
}
```

## Slots

| Slot      | Description                |
| --------- | -------------------------- |
| `default` | 확인 창 본문에 표시할 내용 |

## 특징

- **간단한 API**: 기본 제공되는 확인/취소 버튼과 텍스트만으로 즉시 사용 가능
- **스타일 커스터마이징**: `styleSet`을 통해 버튼 스타일을 개별적으로 제어
- **모달 플러그인 연동**: `confirm-plugin`을 이용하면 비동기적으로 결과를 받을 수 있는 확인 다이얼로그를 손쉽게 띄울 수 있음
- **콜백 이벤트 연동**: 내부적으로 `vlossom:confirm-ok`, `vlossom:confirm-cancel` 오버레이 콜백을 트리거하여 플러그인과 자연스럽게 동작
