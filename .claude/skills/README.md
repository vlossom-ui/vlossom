# Vlossom Style-Set Skills

이 디렉토리에는 Vlossom의 새로운 Style-Set 시스템 개발을 지원하는 Claude Code skills가 포함되어 있습니다.

## 📚 사용 가능한 Skills

### 1. `/component-review` - 컴포넌트 종합 평가

**목적**: Props, StyleSet, 이벤트, 슬롯, 접근성, expose, 문서화, 테스트를 종합 평가

**사용 시기**:

- 새 컴포넌트 PR 머지 전
- 기존 컴포넌트 품질 감사
- 컴포넌트 개선 포인트 파악

**예제**:

```
/component-review VsAccordion
/component-review packages/vlossom/src/components/vs-button
```

**제공하는 것**:

- 📊 8개 영역별 ✅/⚠️/❌ 점수표
- 🔍 우선순위별 이슈 목록 (코드 위치 포함)
- 💡 구체적인 수정 제안
- ✅ 잘된 점 정리

---

### 2. `/style-set-review` - StyleSet 코드 리뷰

**목적**: 기존 StyleSet 구현을 철학에 맞게 검증하고 개선 제안

**사용 시기**:

- PR 리뷰 시
- 새로운 StyleSet 작성 후
- 기존 코드 품질 확인

**예제**:

```
/style-set-review VsButton
/style-set-review packages/vlossom/src/components/vs-card
```

**제공하는 것**:

- ✅ 철학 준수 체크리스트 검증
- ⚠️ 안티패턴 탐지
- 💡 구체적인 개선 제안
- 📊 개선 효과 예측

---

### 2. `/style-set-create` - 새 StyleSet 생성

**목적**: 새 컴포넌트의 StyleSet을 철학에 맞게 설계하고 생성

**사용 시기**:

- 새 컴포넌트 개발 시작
- StyleSet 설계 방향이 불확실할 때
- 처음부터 올바르게 구현하고 싶을 때

**예제**:

```
/style-set-create VsCard
/style-set-create VsDataTable
```

**제공하는 것**:

- 📋 단계별 가이드 (분석 → 설계 → 구현 → 검증)
- 💻 완전한 코드 템플릿
- 📝 타입 정의, 컴포넌트, CSS 생성
- ✅ 검증 체크리스트

---

### 3. `/style-set-migrate` - 기존 컴포넌트 마이그레이션

**목적**: 레거시 컴포넌트를 새 Style-Set 시스템으로 전환

**사용 시기**:

- 기존 컴포넌트 업그레이드
- Breaking change 리팩토링
- 시스템 전환 작업

**예제**:

```
/style-set-migrate VsButton
/style-set-migrate packages/vlossom/src/components/vs-input
```

**제공하는 것**:

- 🔍 현재 상태 분석
- 🎨 새 인터페이스 설계
- 🔧 단계별 구현 가이드
- 🧪 테스트 전략
- 📖 문서화 및 배포 가이드
- 📊 마이그레이션 메트릭

---

## 🎯 Style-Set 철학

모든 skills는 다음 핵심 철학을 기반으로 합니다:

### "최소한의 변수, 최대한의 유연성"

> Variables for Variability, Properties for Predictability

#### 핵심 원칙

1. **명확한 관심사 분리**
   - `variables`: CSS 변수로 노출할 커스터마이징 포인트
   - `component`: CSSProperties로 직접 스타일 제어
   - 하위 컴포넌트: 중첩된 StyleSet으로 전파

2. **"Only What Needs to Vary" 원칙**
   - 실제로 자주 커스터마이징되는 것만 `variables`로 노출
   - 대부분의 스타일은 CSS에 직접 하드코딩
   - 불필요한 CSS 변수 남발 금지

3. **3단계 병합 시스템**

   ```
   baseStyleSet < styleSet < additionalStyleSet
   ```

4. **타입 안정성 강화**
   - API 표면적 최소화
   - 명확한 타입으로 잘못된 사용 방지

---

## 🚀 빠른 시작

### 1. 새 컴포넌트 개발

```bash
# 1단계: StyleSet 생성
/style-set-create VsNewComponent

# 2단계: 구현 (skill이 가이드 제공)

# 3단계: 리뷰
/style-set-review VsNewComponent
```

### 2. 기존 컴포넌트 개선

```bash
# 1단계: 현재 상태 리뷰
/style-set-review VsOldComponent

# 2단계: 리뷰 결과에 따라 개선
```

### 3. PR 리뷰 시

```bash
# StyleSet 변경사항 검증
/style-set-review VsButton
```

---

## 📖 타입 정의 예제

### ✅ Good Example

```typescript
interface VsButtonStyleSet {
  variables?: {
    padding?: string; // 자주 변경됨
  };
  component?: CSSProperties; // 유연성
  loading?: VsLoadingStyleSet; // 하위 컴포넌트
}
```

### ❌ Bad Example

```typescript
interface VsButtonStyleSet {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  border?: string;
  // ... 불필요한 속성 과다
}
```

---

## 🔍 Variables 결정 기준

속성을 `variables`로 노출할지 결정할 때 **모두 Yes여야 함**:

- [ ] **빈도**: 사용자가 자주 커스터마이징하는가?
- [ ] **런타임**: CSS 변수로 런타임에 변경할 필요가 있는가?
- [ ] **재사용**: 여러 곳에서 재사용되는 값인가?
- [ ] **명확성**: 명확한 의미와 용도가 있는가?

**하나라도 No라면**: `component` CSSProperties로 제공

---

## 📊 성공 메트릭

Skills를 활용한 개발의 기대 효과:

| 메트릭      | 개선 목표   |
| ----------- | ----------- |
| API 표면적  | 50-80% 감소 |
| CSS 변수 수 | 50-70% 감소 |
| 코드 가독성 | 향상        |
| 타입 안정성 | 향상        |
| 개발 시간   | 단축        |
| 리뷰 품질   | 향상        |

---

## 🔗 관련 문서

- [Style-Set 가이드라인](../../packages/vlossom/STYLE_SET_GUIDELINES.md)
- [useStyleSet Composable](../../packages/vlossom/src/composables/style-set-composable.ts)
- [컴포넌트 예제](../../packages/vlossom/src/components/)

---

## 💡 팁

### Skill 활용 팁

1. **순서대로 사용**: create → 구현 → review
2. **자주 리뷰**: 작은 단위로 자주 검증
3. **가이드라인 참고**: 상세한 내용은 STYLE_SET_GUIDELINES.md 참고
4. **예제 학습**: 기존 컴포넌트(VsButton, VsAccordion 등) 참고

### 일반적인 실수 방지

- ❌ 모든 CSS 속성을 variables로 노출
- ❌ 3단계 이상 중첩
- ❌ 의미 없는 그룹명 사용
- ❌ BoxStyleSet 같은 공통 인터페이스 extends

---

## ❓ FAQ

**Q: 언제 어떤 skill을 사용해야 하나요?**

- 새 컴포넌트: `/style-set-create`
- 기존 검증: `/style-set-review`
- 시스템 전환: `/style-set-migrate`

**Q: Skills가 자동으로 코드를 수정하나요?**

- 아니요. Skills는 가이드, 제안, 템플릿을 제공하며, 최종 구현은 개발자가 결정합니다.

**Q: 모든 컴포넌트를 한번에 마이그레이션해야 하나요?**

- 아니요. 점진적 마이그레이션을 권장합니다. 우선순위에 따라 단계적으로 진행하세요.

---

## 🤝 기여

Skills 개선 제안이나 새로운 skill 아이디어가 있다면 이슈를 생성해주세요!

---

**Version**: 1.0.0
**Last Updated**: 2026-01-14
