> For English documentation, see [README.md](./README.md).

# Vlossom 유틸 함수

Vlossom 내부에서 사용되며 애플리케이션 코드에서도 사용할 수 있는 유틸리티 모듈 모음입니다. 각 유틸리티는 `vlossom` 패키지에서 내보내집니다.

**사용 가능 버전**: 2.0.0+

## 기본 사용법

```typescript
import { arrayUtil, clipboardUtil, compareUtil, deviceUtil, domUtil, functionUtil, logUtil, objectUtil, propsUtil, stringUtil } from 'vlossom';
```

또는 개별 유틸리티를 가져옵니다:

```typescript
import { stringUtil } from 'vlossom';

const id = stringUtil.createID();
const size = stringUtil.toStringSize(100); // '100px'
```

## 메서드

### arrayUtil

| 카테고리  | 메서드   | 파라미터                     | 설명                                                                       |
| --------- | -------- | ---------------------------- | -------------------------------------------------------------------------- |
| arrayUtil | `uniqBy` | `array: T[], field: keyof T` | 지정된 필드 값을 기준으로 중복 항목이 제거된 새 배열을 반환합니다.         |

### clipboardUtil

| 카테고리      | 메서드  | 파라미터            | 설명                                                                                                         |
| ------------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------ |
| clipboardUtil | `copy`  | `text: string`      | `text`를 시스템 클립보드에 복사합니다. 성공 시 `true`, 실패 또는 Clipboard API를 지원하지 않는 경우 `false`를 반환하는 `Promise<boolean>`을 반환합니다. |

### compareUtil

| 카테고리    | 메서드          | 파라미터                          | 설명                                                                                                                                       |
| ----------- | --------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| compareUtil | `compareValues` | `aValue: unknown, bValue: unknown` | 두 값을 비교하여 숫자를 반환합니다: `a < b`이면 음수, `a > b`이면 양수, 같으면 `0`. `null`, `string`, `number`, `Date`, `boolean`, `object` 타입을 처리합니다. |

### deviceUtil

| 카테고리   | 메서드          | 파라미터 | 설명                                                                                             |
| ---------- | --------------- | -------- | ------------------------------------------------------------------------------------------------ |
| deviceUtil | `isTouchDevice` | —        | 현재 기기가 터치 입력을 지원하는 경우 `true`를 반환합니다 (`ontouchstart`, `maxTouchPoints`, 포인터 미디어 쿼리를 확인). |

### domUtil

| 카테고리 | 메서드          | 파라미터               | 설명                                                                                             |
| -------- | --------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| domUtil  | `isBrowser`     | —                      | 브라우저 환경(`window`가 정의된 경우)에서 실행 중이면 `true`를 반환합니다.                       |
| domUtil  | `getClientRect` | `element: HTMLElement` | `getBoundingClientRect()`를 통해 요소의 `DOMRect`를 반환합니다.                                  |
| domUtil  | `isScrollableX` | `element: HTMLElement` | 요소가 수평 스크롤이 가능한 경우 `true`를 반환합니다 (`overflow-x` 및 콘텐츠 너비 기반).         |
| domUtil  | `isScrollableY` | `element: HTMLElement` | 요소가 수직 스크롤이 가능한 경우 `true`를 반환합니다 (`overflow-y` 및 콘텐츠 높이 기반).         |

### functionUtil

| 카테고리     | 메서드       | 파라미터                                                                          | 설명                                                                                                                                 |
| ------------ | ------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| functionUtil | `throttle`   | *(radash에서 가져옴)* `fn, interval`                                              | `interval` 밀리초당 최대 한 번 실행되는 스로틀된 버전의 함수를 반환합니다.                                                          |
| functionUtil | `debounce`   | *(radash에서 가져옴)* `fn, delay`                                                 | 마지막 호출 후 `delay` 밀리초가 지날 때까지 실행을 지연하는 디바운스된 버전의 함수를 반환합니다.                                     |
| functionUtil | `toCallable` | `maybeFn: undefined \| TResult \| ((...args: TArgs) => TResult)` | 값 또는 함수를 호출 가능한 함수로 정규화합니다. `undefined`이면 `undefined`를 반환하는 함수를 반환합니다. 일반 값이면 함수로 감쌉니다. |

### logUtil

| 카테고리 | 메서드        | 파라미터                                                       | 설명                                                                  |
| -------- | ------------- | -------------------------------------------------------------- | --------------------------------------------------------------------- |
| logUtil  | `error`       | `target: string, message: string`                              | `[Vlossom] {target}:` 접두사가 붙은 오류 메시지를 기록합니다.         |
| logUtil  | `warning`     | `target: string, message: string`                              | `[Vlossom] {target}:` 접두사가 붙은 경고 메시지를 기록합니다.         |
| logUtil  | `propError`   | `componentName: string, property: string, message: string`     | `error`를 사용하여 컴포넌트 속성에 대한 오류를 기록합니다.            |
| logUtil  | `propWarning` | `componentName: string, property: string, message: string`     | `warning`을 사용하여 컴포넌트 속성에 대한 경고를 기록합니다.          |

### objectUtil

| 카테고리   | 메서드     | 파라미터            | 설명                                                                                                     |
| ---------- | ---------- | ------------------- | -------------------------------------------------------------------------------------------------------- |
| objectUtil | `assign`   | *(radash에서 가져옴)* | 소스 객체의 속성을 대상 객체에 깊은 복사로 할당합니다.                                                  |
| objectUtil | `crush`    | *(radash에서 가져옴)* | 중첩된 객체를 점 표기법 키를 사용하는 단일 레벨 객체로 평탄화합니다.                                    |
| objectUtil | `get`      | *(radash에서 가져옴)* | 점 표기법 경로를 통해 객체에서 중첩된 값을 안전하게 가져옵니다.                                         |
| objectUtil | `isEmpty`  | *(radash에서 가져옴)* | 값이 빈 객체, 배열, 문자열, `null` 또는 `undefined`이면 `true`를 반환합니다.                            |
| objectUtil | `isEqual`  | *(radash에서 가져옴)* | 두 값 간의 깊은 동등성 비교를 수행합니다.                                                               |
| objectUtil | `isObject` | *(radash에서 가져옴)* | 값이 일반 객체(배열이나 null이 아닌)인 경우 `true`를 반환합니다.                                        |
| objectUtil | `omit`     | *(radash에서 가져옴)* | 지정된 키가 제거된 객체의 복사본을 반환합니다.                                                          |
| objectUtil | `shake`    | *(radash에서 가져옴)* | 모든 falsy 값(또는 조건자와 일치하는 값)이 제거된 객체의 복사본을 반환합니다.                           |

### propsUtil

| 카테고리  | 메서드              | 파라미터                                                         | 설명                                                                                                          |
| --------- | ------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| propsUtil | `checkValidNumber`  | `componentName: string, property: string, value: number \| string` | 값이 안전한 JavaScript 숫자인지 유효성을 검사합니다. 유효하지 않으면 `logUtil`을 통해 prop 오류를 기록하고 `false`를 반환합니다. |

### stringUtil

| 카테고리   | 메서드              | 파라미터                            | 설명                                                                                                            |
| ---------- | ------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| stringUtil | `createID`          | `size?: number` (기본값 10)         | 주어진 길이의 무작위 알파벳 문자열 ID를 생성합니다. ID는 숫자로 시작하지 않습니다.                              |
| stringUtil | `convertToString`   | `value: any`                        | 임의의 값을 문자열로 변환합니다. 객체는 `JSON.stringify`로 직렬화되고, 다른 타입은 `String()`을 사용합니다.    |
| stringUtil | `toStringSize`      | `value: number \| string`           | 순수한 숫자를 픽셀 문자열로 변환합니다 (예: `100` → `'100px'`). 기존 단위가 있는 문자열은 그대로 반환됩니다.   |
| stringUtil | `toFileSizeFormat`  | `bytes: number`                     | 바이트 수를 사람이 읽기 쉬운 문자열로 포맷합니다 (예: `1024` → `'1 KB'`).                                     |
| stringUtil | `hash`              | `str: string`                       | `vs-` 접두사가 붙은 짧은 결정론적 해시 문자열을 계산합니다 (base-36 인코딩).                                   |
| stringUtil | `kebabCase`         | *(change-case에서 가져옴)*          | 문자열을 kebab-case로 변환합니다 (예: `'fooBar'` → `'foo-bar'`).                                               |

## 주의사항

- `clipboardUtil.copy`는 보안 컨텍스트(HTTPS 또는 localhost)가 필요합니다. Clipboard API를 사용할 수 없는 경우 `false`를 반환하고 오류를 기록합니다.
- `functionUtil.throttle`과 `functionUtil.debounce`는 [radash](https://radash-docs.vercel.app/)에서 재내보내집니다. 전체 API는 radash 문서를 참고하세요.
- `objectUtil` 메서드는 [radash](https://radash-docs.vercel.app/)에서 재내보내집니다. 자세한 동작은 radash 문서를 참고하세요.
- `stringUtil.kebabCase`는 [change-case](https://github.com/blakeembrey/change-case)에서 재내보내집니다.
