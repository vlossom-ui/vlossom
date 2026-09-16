# VsTable 셀 입력 포커스 이탈 — 작업 인수인계

작성일: 2026-09-16 / 기준 커밋: `9410d867` / 작업 브랜치: 미생성(워킹트리 변경만 있음, 커밋 안 함)

## 1. 문제

`vs-table > vs-accordion > vs-table > vs-label-value > vs-input` 구조에서 셀 안의 input에 연속 입력하면
**한 글자만 입력되고 포커스가 빠진다.**

- 테이블 아이템은 class instance로 주입
- `v-model` 대신 `:model-value` + `@update:model-value`로 getter/setter 분리
- 데이터는 mutable하게 수정

## 2. 원인 (재현·계측으로 확인)

### 원인 1 — 행 정체성이 아이템 객체 identity에 묶여 있음

`TableCellBuilder`가 행 key를 `WeakMap<item, id>`로 발급하고, 셀 id도 `${tableId}-${colKey}-${rowKey}`로 만든다
(`src/components/vs-table/models/table-cell-builder.ts`). `<td>`의 `:key`가 이 cell id이므로
**아이템 객체가 새 인스턴스로 교체되면 행/셀 DOM이 remount**되고, 편집 중이던 input이 언마운트된다.

MutationObserver 실측:

```
blur (isConnected: true)
removed: tr.vs-table-body-row < tbody.vs-table-body < table < div.vs-table-content
added:   tr.vs-table-body-row ...
```

### 원인 2 — VsInput이 외부 modelValue 변경을 되돌려 emit (echo)

`src/composables/input/input-composable.ts:85-94`에서 `modelValue` prop 변경 → `inputValue` 대입 →
`inputValue` watcher(:61-83)가 다시 `emit('update:modelValue', value)`.

즉 **부모가 값을 바꾸면 그 input이 setter를 다시 호출**한다. 실측으로 확인:
같은 데이터를 바인딩한 A 테이블에 타이핑했는데 **C 테이블의 setter가 호출**됐다
(`__replaceCalls: [{ group: 'Group A', label: 'alpha', value: 'x' }]`).

setter가 새 인스턴스를 만드는 구현이면 → 원인 1이 발동 → 사용자가 건드리지도 않은 테이블이 원인이 되어 포커스가 빠진다.

## 3. 완료된 작업 — 원인 1 수정 (`item-key` prop 추가)

opt-in 방식. 지정하면 행 정체성이 객체 identity가 아니라 데이터 필드에서 나온다.

| 파일 | 변경 |
|---|---|
| `models/table-cell-builder.ts` | `itemKey` 생성자 파라미터 + `updateItemKey()`. `getRowKey`가 `objectUtil.get(item, itemKey)` 우선, 값 없으면 기존 WeakMap 폴백 |
| `composables/table-composable.ts` | `itemKey` 정규화 후 빌더 전달, `TableComposable` 타입에 노출 |
| `VsTable.vue` | `itemKey: { type: String, default: '' }` |
| `README.md` / `README.ko.md` | Props 표 + "Row Identity / 행 식별" 섹션 |
| `__stories__/vs-table.stories.ts` | `itemKey` argType |
| `__tests__/table-cell-builder.test.ts` | 2건 (객체 교체 시 key·cell id 유지 / 점 경로 + 폴백) |
| `__tests__/vs-table.test.ts` | 2건 (`describe('itemKey')`: 지정 시 셀 DOM 유지, 미지정 시 재생성) |
| `playground/Sandbox.vue` | 재현 지그 (아래 5번) |

- 점 경로 지원 (`item-key="meta.id"`), 값 없으면 객체 identity 폴백
- **auto-detect(`id` 필드 자동 사용)은 일부러 넣지 않음** — 기존 사용자 동작이 조용히 바뀌는 걸 피하려고. 기본값 정책은 미결
- 중복 key 검증 없음 (Vue duplicate key 경고에 의존). 필요하면 `logUtil.propWarning` 추가 후보

검증: `npm run type-check`, `npm run lint`, `npx vitest run`(91 파일 / 1556 테스트) 전부 통과.

### 브라우저 실측 (Playwright)

`item-key` 적용 상태에서 10개 시나리오 전부 통과, 대조군만 실패:

| 시나리오 | 결과 |
|---|---|
| item-key + mutate / 인스턴스 교체 / groups 배열 전체 교체 | OK |
| item-key + draggable / pagination / selectable / sticky-header | OK |
| item-key + 정렬 활성(편집 중 컬럼으로 sort) / search 필터 활성 | OK |
| item-key 없음 + 인스턴스 교체 (대조군) | 첫 글자에 포커스 이탈 |

**미해결 상태**: 사용자 앱에서는 여전히 포커스가 빠진다고 함. playground에서는 재현 실패.
다음 세션에서 앱 쪽 진단이 먼저 필요하다 (6번 참고).

## 4. 남은 작업

### (a) 원인 2 수정 — VsInput echo 차단 (사용자가 이어서 하기로 함)

`input-composable.ts`에서 prop 유래 변경일 때는 `update:modelValue`를 되쏘지 않도록 가드.
범위가 VsInput 계열 전체라 파급 큼. echo에 의존하는 앱(setter에서 정규화 후 되돌려받는 패턴)이 깨질 수 있어 별도 검증 필요.

주의: echo를 막아도 **직접 타이핑한 input의 setter가 새 인스턴스를 만들면 여전히 remount된다.**
즉 (a)만으로는 증상이 안 사라진다. `item-key`가 본체 수정.

### (b) 구조 개편 검토 결과 (사용자가 "테이블 내부를 뒤엎을까" 고민 중)

현재 구현 약 2,470줄. 설계상 문제 4가지:

1. **파생 셀 모델을 물질화** — `TableCellBuilder` + strategy 3종이 items × columns 전체를 셀 객체로 만들고
   `builtTable` computed → `rawBodyRows` ref로 복사(`table-composable.ts:216-254`).
   셀 값 하나가 바뀌면 전 행의 셀 객체가 재생성된다.

   계측(dev 빌드, 셀 1개에 한 글자 입력 → DOM 반영):

   | 행 수 | 10 | 200 | 1000 |
   |---|---|---|---|
   | 중앙값 | 3.2ms | 36.1ms | 220.6ms |

   행 수에 선형.

2. **DOM 정체성이 그 모델에 종속** — 행 key와 `<td>` `:key`를 빌더가 발급. `item-key`는 이 결합을 끊는 패치지 제거가 아님.

3. **같은 상태가 여러 층에 복제** — `rawBodyRows`(computed의 ref 복사본), `displayOrder`(VsTableBody 드래그 shadow),
   `internalPage`/`internalPageSize`, `internalSelectedItems`. watch로 동기화.
   부작용으로 한 글자 입력마다 `update:pagedItems`·`update:totalItems`가 emit된다
   (실측: 4타 입력 → 각 4회). 부모가 v-model로 되받아 `items`에 쓰면 그 자체로 루프.

4. **변형 파이프라인 분산** — 검색·정렬(`preprocessedBodyRows`) → 페이지 슬라이스(`bodyRows`) → 드래그 순서(`displayedRows`+`displayOrder`).

**뒤엎으면 해결되는 것**: items + columns에서 직접 렌더(`<tr v-for :key="rowKey(item)">` / `<td v-for :key="column.key">`)로 가면 1·2·3이 동시에 사라짐. 셀 객체 생성 0, 모델 재생성 0, 정체성 규칙 하나.

**뒤엎어도 안 되는 것**: 원인 2(VsInput echo)는 테이블 밖 문제. 앱이 식별자를 안 주고 매번 새 객체를 넘기면 index 폴백으로 remount는 막아도 정렬·삽입 시 값이 어긋남 — "식별자는 데이터가 제공한다"는 책임은 어떤 구조로도 남는다.

**진짜 비용**: 공개 슬롯 API가 셀 모델에 묶여 있음 — `body-${cell.id}` 슬롯 이름 해석(`VsTableBodyRow.findMatchingSlotName`의 6단계 우선순위), 슬롯 payload(`item`/`value`/`colIdx`/`rowIdx`), `click-cell`·`select-row`·`expand-row`의 `VsTableBodyCell[]` 페이로드. 호환 레이어 작업이 대부분을 차지한다. vs-table 테스트 123개가 계약을 어느 정도 고정.

**제안한 순서** (사용자 미결정):

1. ~~`item-key`~~ 완료
2. **셀 모델 제거** — 렌더 시점 계산으로 전환. 내부 한정, 슬롯 API 유지. 효과 최대 / 위험 중간
3. **shadow state 정리** — `rawBodyRows` ref 제거(computed 직결), `displayOrder` 제거, `update:pagedItems`/`totalItems`는 값이 실제로 달라질 때만 emit
4. **VsInput echo 수정**

전면 재작성은 2번이 실익 대부분을 가져가므로, 슬롯 API까지 다시 설계하고 싶을 때 하는 게 합리적이라고 판단.

## 5. 재현 지그 — `packages/vlossom/playground/Sandbox.vue`

dev 서버: `cd packages/vlossom && npm run dev` (기본 http://localhost:3001, Sandbox가 첫 탭)

- `?cases=a` … `?cases=j` — 시나리오 선택(복수 지정 가능, 예 `?cases=ai`). `SCENARIOS` 배열 참고
  - a: item-key + mutate / b: item-key + 인스턴스 교체 / c: draggable / d: pagination / e: search
  - f: value 컬럼 정렬 / g: selectable / h: item-key 없음 + mutate / i: **대조군**(item-key 없음 + 인스턴스 교체) / j: groups 배열 전체 교체
- `?bench=1000` — 플랫 테이블 N행 벤치 (`#case-bench`)
- `#emit-counts` — `update:pagedItems` / `update:totalItems` emit 횟수 표시

포커스 이탈 판정 스크립트(Playwright `browser_run_code_unsafe`에서 사용한 것):

```js
const target = page.locator('#case-a table table input[type=text]').first();
await target.click();
const inputId = await target.getAttribute('id');
for (const ch of 'abcd') {
  await page.keyboard.type(ch);
  await page.waitForTimeout(120);
  console.log(await page.evaluate((i) => ({
    v: document.getElementById(i)?.value ?? '(gone)',
    a: document.activeElement?.id || document.activeElement?.tagName,
  }), inputId));
}
```

`(gone)/BODY`가 찍히면 remount로 포커스가 빠진 것.

## 6. 다음 세션에서 먼저 할 것

사용자 앱에서 아직 포커스가 빠진다고 함. playground 재현이 안 되므로 앱 쪽 진단부터:

```js
const el = document.activeElement;
new MutationObserver(ms => ms.forEach(m => m.removedNodes.forEach(n =>
    n.contains?.(el) && console.log('removed:', n.tagName, n.className, '| parent:', m.target.className)
))).observe(document.body, { childList: true, subtree: true });
```

- `tr` 제거 → 행 key 문제 (item-key 미적용 또는 key 불안정)
- `td` 제거 → cell id 문제
- 그보다 위(`div` 등) → 테이블 밖에서 오는 재생성

흔한 함정:

- **중첩 테이블인데 안쪽/바깥쪽 중 하나에만 `item-key`를 준 경우 — 둘 다 필요**
- 편집 중인 필드를 key로 지정(`item-key="name"`인데 name을 편집) → key가 매 글자 바뀜
- key 값 중복 또는 undefined(→ identity 폴백)

## 7. 미결 사항

- `item-key` 기본값 정책: auto-detect(`id` 자동 사용)로 갈지 opt-in 유지할지
- 중복 key 검증(`logUtil.propWarning`) 추가 여부
- 구조 개편 범위: 2·3번만 할지, 전면 재작성까지 갈지
- 커밋 미생성. Conventional Commits 기준으로 `feat(VsTable): add item-key prop for row identity` 정도가 적절
