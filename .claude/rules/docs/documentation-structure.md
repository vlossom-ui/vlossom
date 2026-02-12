# Optional: Scope this rule to specific files

## Rules

- • Documentation should focus on style-set definition rules, not history
- • Migration checklist exists separately; avoid redundancy
- • Large document needs content compression for clarity

- • Place practical examples near the beginning for better discoverability
- • Users should see common usage patterns before diving into details

## Reviewed Code

File: `packages/vlossom/STYLE_SET_GUIDELINES.md` (lines 457-457)

```
@@ -0,0 +1,802 @@
+# Style-Set 시스템 개발 가이드라인
+
+> 새로운 Style-Set 시스템의 철학과 구현 패턴에 대한 공식 개발 지침
+
+**버전**: 2.0.0+
+**마지막 업데이트**: 2026-01-14
+
+---
+
+## 📖 목차
+
+1. [핵심 철학](#-핵심-철학)
+2. [타입 정의 가이드](#-타입-정의-가이드)
+3. [컴포넌트 구현 패턴](#-컴포넌트-구현-패턴)
+4. [CSS 작성 가이드](#-css-작성-가이드)
+5. [마이그레이션 체크리스트](#-마이그레이션-체크리스트)
+6. [테스트 전략](#-테스트-전략)
+7. [FAQ](#-faq)
+
+---
+
+## 🎯 핵심 철학
+
+### "최소한의 변수, 최대한의 유연성"
+> Variables for Variability, Properties for Predictability
+
+새로운 Style-Set 시스템은 다음 원칙을 따릅니다:
+
+#### 1. **명확한 관심사 분리**
+- `variables`: CSS 변수로 노출할 커스터마이징 포인트
+- `component` / 구체적 요소: CSSProperties로 직접 스타일 제어
+- 하위 컴포넌트: 중첩된 StyleSet으로 전파
+
+#### 2. **"Only What Needs to Vary" 원칙**
+- 실제로 커스터마이징이 필요한 것만 `variables`로 노출
+- 대부분의 스타일은 CSS에 직접 하드코딩
+- 불필요한 CSS 변수 남발 금지
+
+#### 3. **3단계 병합 시스템**
+```
+baseStyleSet < styleSet < additionalStyleSet
+```
+- **baseStyleSet**: 컴포넌트 기본 동작 (내부 로직)
+- **styleSet**: 사용자 정의 (디자인 시스템)
+- **additionalStyleSet**: 런타임 오버라이드 (특수 케이스)
+
+#### 4. **타입 안정성 강화**
+- 불필요한 커스터마이징 포인트 제거
+- API 표면적 최소화
+- 명확한 타입으로 잘못된 사용 방지
+
+---
+
+## 📐 타입 정의 가이드
+
+### 기본 구조
+
+```typescript
+export interface Vs[ComponentName]StyleSet {
+    variables?: {
+        // 1단계: 단순 CSS 변수
+        propertyName?: string;
+
+        // 2단계: 논리적 그룹핑 (중첩 1단계까지만)
+        groupName?: {
+            property1?: string;
+            property2?: string;
+        };
+    };
+
+    // 직접 스타일 적용
+    component?: CSSProperties;
+
+    // 특정 요소별 스타일
+    elementName?: CSSProperties;
+
+    // 하위 컴포넌트 스타일 전파
+    childComponent?: ChildComponentStyleSet;
+}
+```
+
+### ✅ Good Examples
+
+#### 예제 1: VsButton (단순 + 중첩)
+
+```typescript
+interface VsButtonStyleSet {
+    variables?: {
+        padding?: string;  // 자주 변경되는 값만 노출
+    };
+    component?: CSSProperties;  // 컴포넌트 루트
+    loading?: VsLoadingStyleSet;  // 하위 컴포넌트 전파
+}
+```
+
+**이유**:
+- `width`, `height` 제거: 버튼 크기는 size prop으로 제어
+- `padding`만 variables로 노출: 가장 자주 커스터마이징되는 속성
+- `loading` 중첩: 로딩 스피너 스타일 일괄 제어
+
+#### 예제 2: VsAccordion (논리적 그룹핑)
+
+```typescript
+interface VsAccordionStyleSet {
+    variables?: {
+        arrowColor?: string;
+        arrowSize?: string;
+        arrowSpacing?: string;
+        border?: string;
+        width?: string;
+    };
+    title?: CSSProperties;
+    expand?: VsExpandableStyleSet;
+}
+```
+
+**이유**:
+- arrow 관련 속성을 개별 변수로 노출 (커스터마이징 빈도 높음)
+- `title`은 CSSProperties: 자유로운 스타일링 가능
+- `expand`는 하위 컴포넌트 스타일 전파
+
+#### 예제 3: VsSelect (복잡한 중첩)
+
+```typescript
+interface VsSelectStyleSet {
+    variables?: {
+        height?: string;
+        selected: {
+            backgroundColor?: string;
+            fontWeight?: number;
+        };
+        focused: {
+            border?: string;
+            borderRadius?: string;
+            backgroundColor?: string;
+        };
+    };
+    component?: CSSProperties;
+    chip?: VsChipStyleSet;
+    selectAllCheckbox?: VsCheckboxStyleSet;
+    options?: VsGroupedListStyleSet;
+    option?: CSSProperties;
+}
+```
+
+**이유**:
+- `selected`, `focused` 상태별로 그룹핑 (의미론적 명확성)
+- 여러 하위 컴포넌트 스타일 일괄 제어
+- `option`은 CSSProperties로 자유도 제공
+
+### ❌ Bad Examples
+
+#### 안티패턴 1: 모든 것을 변수로
+
+```typescript
+// ❌ BAD: 불필요한 변수 남발
+interface VsButtonStyleSet {
+    variables?: {
+        width?: string;
+        height?: string;
+        padding?: string;
+        margin?: string;
+        backgroundColor?: string;
+        border?: string;
+        borderRadius?: string;
+        opacity?: string;
+        fontColor?: string;
+        fontSize?: string;
+        fontWeight?: string;
+        // ... 끝없는 속성들
+    };
+}
+
+// ✅ GOOD: 필요한 것만
+interface VsButtonStyleSet {
+    variables?: {
+        padding?: string;  // 자주 변경됨
+    };
+    component?: CSSProperties;  // 나머지는 자유롭게
+}
+```
+
+#### 안티패턴 2: 깊은 중첩
+
+```typescript
+// ❌ BAD: 3단계 이상 중첩
+interface VsInputStyleSet {
+    variables?: {
+        container?: {
+            inner?: {
+                wrapper?: {
+                    padding?: string;  // 너무 깊음!
+                };
+            };
+        };
+    };
+}
+
+// ✅ GOOD: 최대 2단계
+interface VsInputStyleSet {
+    variables?: {
+        padding?: string;
+        append?: {
+            width?: string;
+            padding?: string;
+        };
+    };
+}
+```
+
+#### 안티패턴 3: 의미 없는 분리
+
+```typescript
+// ❌ BAD: 논리적 관계 없는 그룹핑
+interface VsCardStyleSet {
+    variables?: {
+        styles?: {  // 의미 없는 그룹명
+            color?: string;
+            width?: string;
+        };
+    };
+}
+
+// ✅ GOOD: 의미 있는 그룹핑
+interface VsCardStyleSet {
+    variables?: {
+        width?: string;
+        header?: {
+            backgroundColor?: string;
+            padding?: string;
+        };
+    };
+}
+```
+
+### 변수 노출 결정 기준
+
+다음 질문에 **모두 Yes**일 때만 `variables`로 노출:
+
+1. ✅ 사용자가 자주 커스터마이징하는가?
+2. ✅ CSS 변수로 런타임에 변경할 필요가 있는가?
+3. ✅ 여러 곳에서 재사용되는 값인가?
+4. ✅ 명확한 의미와 용도가 있는가?
+
+**하나라도 No라면**: `component` 또는 요소별 CSSProperties로 제공
+
+---
+
+## 🔧 컴포넌트 구현 패턴
+
+### 1. 기본 Setup 패턴
+
+```typescript
+import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
+import { VsComponent } from '@/declaration';
+import { useColorScheme, useStyleSet } from '@/composables';
+import { getColorSchemeProps, getStyleSetProps } from '@/props';
+import type { VsButtonStyleSet } from './types';
+
+const componentName = VsComponent.VsButton;
+
+export default defineComponent({
+    name: componentName,
+    props: {
+        ...getColorSchemeProps(),
+        ...getStyleSetProps<VsButtonStyleSet>(),
+        // ... 기타 props
+    },
+    setup(props) {
+        const { colorScheme, styleSet } = toRefs(props);
+
+        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
+
+        const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(
+            componentName,
+            styleSet,
+        );
+
+        return {
+            colorSchemeClass,
+            styleSetVariables,
+            componentStyleSet,
+        };
+    },
+});
+```
+
+### 2. baseStyleSet 사용 패턴
+
+하위 컴포넌트의 기본 스타일을 설정할 때:
+
+```typescript
+const baseStyleSet: ComputedRef<VsButtonStyleSet> = computed(() => {
+    return {
+        loading: {
+            component: {
+                width: '30%',
+                height: '60%',
+            },
+        },
+    };
+});
+
+const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(
+    componentName,
+    styleSet,
+    baseStyleSet,  // 기본값 전달
+);
+```
+
+**사용 시기**:
+- 하위 컴포넌트 기본 스타일 설정
+- props에 따라 동적으로 변경되는 기본값
+- 컴포넌트 내부 로직에 의한 스타일
+
+### 3. additionalStyleSet 사용 패턴
+
+런타임에 동적으로 스타일을 추가할 때:
+
+```typescript
+const additionalStyleSet: ComputedRef<VsButtonStyleSet> = computed(() => {
+    if (props.dense) {
+        return {
+            variables: {
+                padding: '0.25rem 0.5rem',
+            },
+        };
+    }
+    return {};
+});
+
+const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(
+    componentName,
+    styleSet,
+    baseStyleSet,
+    additionalStyleSet,  // 런타임 오버라이드
+);
+```
+
+**사용 시기**:
+- props 조합에 따른 스타일 조정
+- 특수한 상태의 스타일 오버라이드
+- 조건부 스타일 적용
+
+### 4. Template 적용 패턴
+
+```vue
+<template>
+    <button
+        :class="['vs-button', colorSchemeClass, classObj]"
+        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
+    >
+        <!-- styleSetVariables: CSS 변수들 -->
+        <!-- componentStyleSet.component: 직접 스타일 -->
+
+        <div v-if="loading" class="vs-button-loading">
+            <!-- 하위 컴포넌트에 스타일 전파 -->
+            <vs-loading :style-set="componentStyleSet.loading" />
+        </div>
+
+        <div class="vs-button-content" :style="componentStyleSet.content">
+            <!-- 특정 요소 스타일 -->
+            <slot />
+        </div>
+    </button>
+</template>
+```
+
+**핵심 포인트**:
+1. **루트 요소**: `styleSetVariables` + `componentStyleSet.component`
+2. **하위 컴포넌트**: `:style-set="componentStyleSet.childName"`
+3. **특정 요소**: `:style="componentStyleSet.elementName"`
+
+---
+
+## 🎨 CSS 작성 가이드
+
+### 1. CSS 변수 명명 규칙
+
+```css
+.vs-component {
+    /* 패턴: --[component-name]-[property] */
+    --vs-button-padding: initial;
+
+    /* 중첩된 경우: --[component-name]-[group]-[property] */
+    --vs-select-focused-border: initial;
+    --vs-select-focused-backgroundColor: initial;
+}
+```
+
+**규칙**:
+- 컴포넌트명은 kebab-case (자동 변환됨)
+- 속성명은 camelCase 유지 (TypeScript와 일관성)
+- 그룹명이 있으면 중간에 삽입
+
+### 2. 변수 사용 vs 직접 값
+
+```css
+.vs-button {
+    /* ❌ BAD: 모든 것을 변수로 */
+    --vs-button-backgroundColor: initial;
+    --vs-button-border: initial;
+    --vs-button-borderRadius: initial;
+    --vs-button-padding: initial;
+
+    background-color: var(--vs-button-backgroundColor, var(--vs-comp-bg));
+    border: var(--vs-button-border, 1px solid var(--vs-line-color));
+    border-radius: var(--vs-button-borderRadius, calc(var(--vs-radius-ratio) * var(--vs-radius-md)));
+    padding: var(--vs-button-padding, 0.75rem 1.5rem);
+}
+
+/* ✅ GOOD: 필요한 것만 변수로 */
+.vs-button {
+    --vs-button-padding: initial;
+
+    background-color: var(--vs-comp-bg);  /* 직접 값 */
+    border: 1px solid var(--vs-line-color);  /* 직접 값 */
+    border-radius: calc(var(--vs-radius-ratio) * var(--vs-radius-md));  /* 직접 값 */
+    padding: var(--vs-button-padding, 0.75rem 1.5rem);  /* 변수 */
+}
+```
+
+### 3. fallback 값 설정
+
+```css
+/* 항상 적절한 fallback 제공 */
+.vs-component {
+    /* 디자인 토큰 사용 */
+    color: var(--vs-component-color, var(--vs-comp-font));
+
+    /* 구체적 값 */
+    padding: var(--vs-component-padding, 1rem);
+
+    /* 계산된 값 */
+    border-radius: var(--vs-component-borderRadius, calc(var(--vs-radius-ratio) * var(--vs-radius-md)));
+}
+```
+
+### 4. 중첩된 변수 처리
+
+```css
+.vs-select {
+    /* 중첩된 그룹의 변수들 */
+    --vs-select-focused-border: initial;
+    --vs-select-focused-borderRadius: initial;
+    --vs-select-focused-backgroundColor: initial;
+}
+
+.vs-select:focus-within {
+    /* 상태별로 적용 */
+    border: var(--vs-select-focused-border, 2px solid var(--vs-primary));
+    border-radius: var(--vs-select-focused-borderRadius, 0.25rem);
+    background-color: var(--vs-select-focused-backgroundColor, transparent);
+}
+```
+
+### 5. 리팩토링 전후 비교
```

File: `packages/vlossom/src/components/vs-dimmed/README.md` (lines 48-48)

```
@@ -38,11 +38,29 @@
 
 ```typescript
 interface VsDimmedStyleSet {
-    backgroundColor?: string; // 배경 색상 (기본값: var(--vs-black))
-    opacity?: number; // 투명도 (기본값: 0.4)
+    component?: CSSProperties;
 }
 ```
 
+### StyleSet 사용 예시
+
+```html
+<template>
+    <div class="relative h-screen w-full">
+        <vs-dimmed
+            v-model="isVisible"
+            :style-set="{
+                component: {
+                    backgroundColor: '#000000',
+                    opacity: 0.6,
+                    backdropFilter: 'blur(4px)',
+                },
+            }"
+        />
+    </div>
+</template>
+```
+
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** documentation-structure, example-placement, readability, user-experience
**Category:** documentation

## Examples

### ❌ Incorrect

```
STYLE_SET_GUIDELINES
```

802-line guideline doc containing migration history to remove

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @smithoo
**Keywords:** style, documentation, guide, 마이그레이션, testing, database, style_set_guidelines, style-set, content-focus, doc-compression, separation-of-concerns, migration-history
**Category:** documentation