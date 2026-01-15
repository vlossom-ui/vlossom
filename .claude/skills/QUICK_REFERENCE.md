# Style-Set Quick Reference

## useStyleSet의 세 번째 인자 가이드

### 언제 무엇을 사용할까?

```typescript
const { componentStyleSet, styleSetVariables } = useStyleSet(
    componentName,
    styleSet,
    ??? // 여기에 무엇을?
);
```

### Decision Tree

```
Props에 width, height, position 등이 있나?
├─ Yes → additionalStyleSet 사용
│         (Props를 StyleSet으로 변환)
│
└─ No → 하위 컴포넌트가 있나?
        ├─ Yes → baseStyleSet 사용
        │         (하위 컴포넌트 기본값 설정)
        │
        └─ No → 세 번째 인자 생략
                  (기본 useStyleSet만)
```

### 1. additionalStyleSet (Props → StyleSet 변환)

**언제 사용?**
- width, height, position 같은 props가 있을 때
- Props 값을 CSS 변수로 변환해야 할 때
- 반응형 breakpoint 지원이 필요할 때 (Object 타입)

**예시: VsFileDrop, VsBar, VsGrid 등**

```typescript
// Props 정의
props: {
    width: { type: [String, Number, Object], default: undefined },
    height: { type: [String, Number, Object], default: undefined },
}

// additionalStyleSet 사용
const { width, height } = toRefs(props);

const additionalStyleSet = computed(() => {
    return objectUtil.shake({
        width:
            width.value === undefined || objectUtil.isObject(width.value)
                ? undefined  // breakpoint 객체는 제외
                : stringUtil.toStringSize(width.value),
        height:
            height.value === undefined || objectUtil.isObject(height.value)
                ? undefined
                : stringUtil.toStringSize(height.value),
    });
});

const { componentStyleSet, styleSetVariables } = useStyleSet(
    componentName,
    styleSet,
    additionalStyleSet  // ← Props를 StyleSet으로
);
```

**⚠️ 주의**: 이미 있던 additionalStyleSet을 제거하면 Props가 동작하지 않음! (P1 이슈)

### 2. baseStyleSet (하위 컴포넌트 기본값)

**언제 사용?**
- 다른 Vlossom 컴포넌트를 하위로 사용할 때
- 하위 컴포넌트의 기본 스타일을 제어할 때
- 상위에서 일관된 스타일을 하위에 적용할 때

**예시: VsButton (VsLoading), VsSelect (VsChip) 등**

```typescript
// 하위 컴포넌트: VsLoading을 사용
import VsLoading from '@/components/vs-loading/VsLoading.vue';

// baseStyleSet으로 하위 컴포넌트 기본값 설정
const baseStyleSet: ComputedRef<VsButtonStyleSet> = computed(() => {
    return {
        loading: {  // VsLoading 컴포넌트의 StyleSet
            component: {
                width: '1rem',
                height: '1rem',
            },
        },
    };
});

const { componentStyleSet, styleSetVariables } = useStyleSet(
    componentName,
    styleSet,
    baseStyleSet  // ← 하위 컴포넌트 기본값
);
```

**Template에서 전파**:
```vue
<vs-loading
    v-if="loading"
    :style-set="componentStyleSet.loading"  <!-- baseStyleSet에서 온 기본값 -->
/>
```

### 3. 둘 다 필요한 경우?

**현재는 하나만 가능**: additionalStyleSet 우선 사용

```typescript
// additionalStyleSet만 사용
const additionalStyleSet = computed(() => ({
    width: stringUtil.toStringSize(width.value),
    // 하위 컴포넌트 기본값도 여기에
    childComponent: {
        component: { width: '100%' },
    },
}));

const { componentStyleSet, styleSetVariables } = useStyleSet(
    componentName,
    styleSet,
    additionalStyleSet
);
```

### 4. 둘 다 필요 없는 경우

**대부분의 간단한 컴포넌트**

```typescript
// 세 번째 인자 없이
const { componentStyleSet, styleSetVariables } = useStyleSet(
    componentName,
    styleSet
);
```

## 비교표

| | additionalStyleSet | baseStyleSet | 없음 |
|---|---|---|---|
| **목적** | Props → StyleSet | 하위 기본값 | 기본 사용 |
| **반응성** | ✅ Reactive | ✅ Reactive | - |
| **타입** | `Partial<StyleSet>` | `StyleSet` | - |
| **예시** | width, height props | VsLoading 스타일 | VsCard |
| **병합** | Shallow merge | Deep merge | - |

## 자주 하는 실수

### ❌ 실수 1: additionalStyleSet 제거

```typescript
// BEFORE (원본)
const additionalStyleSet = computed(() => ({
    width: stringUtil.toStringSize(width.value),
}));
const { ... } = useStyleSet(componentName, styleSet, additionalStyleSet);

// AFTER (잘못된 마이그레이션)
const { ... } = useStyleSet(componentName, styleSet);  // ❌ Props 동작 안함!
```

**결과**: width prop이 무시됨!

### ❌ 실수 2: baseStyleSet과 혼동

```typescript
// BAD - Props를 baseStyleSet으로
const baseStyleSet = computed(() => ({
    width: stringUtil.toStringSize(width.value),  // ❌ 잘못된 용도
}));

// GOOD - Props는 additionalStyleSet으로
const additionalStyleSet = computed(() => ({
    width: stringUtil.toStringSize(width.value),  // ✅ 올바름
}));
```

### ❌ 실수 3: breakpoint 체크 누락

```typescript
// BAD - Object 타입 체크 없음
const additionalStyleSet = computed(() => ({
    width: stringUtil.toStringSize(width.value),  // ❌ breakpoint 에러
}));

// GOOD - Object 체크로 breakpoint 지원
const additionalStyleSet = computed(() => ({
    width: objectUtil.isObject(width.value)
        ? undefined  // breakpoint는 다른 곳에서 처리
        : stringUtil.toStringSize(width.value),  // ✅
}));
```

## 체크리스트

마이그레이션이나 새 컴포넌트 작성 시:

- [ ] Props에 width/height/position이 있는가?
  - Yes → additionalStyleSet 필요
  - No → 다음 체크
- [ ] 하위 Vlossom 컴포넌트를 사용하는가?
  - Yes → baseStyleSet 필요
  - No → 세 번째 인자 불필요
- [ ] additionalStyleSet 사용 시 `objectUtil.isObject()` 체크했는가?
- [ ] baseStyleSet 사용 시 하위 컴포넌트에 `:style-set` 전파했는가?

## 참고 컴포넌트

**additionalStyleSet 사용**:
- VsFileDrop
- VsBar
- VsGrid
- VsTextWrap
- VsDrawer
- VsModal

**baseStyleSet 사용**:
- VsButton (VsLoading)
- VsSelect (VsChip)

**둘 다 없음**:
- VsCard
- VsChip
- VsDivider
