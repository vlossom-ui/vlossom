---
# Optional: Scope this rule to specific files
# paths:
#   - "src/**/*.ts"
---

# Determinism Testing

## Rules

- • Command may produce inconsistent results on repeated execution
- • Lack of determinism creates uncertainty in testing and usage
- • Consider adding reproducibility or documenting expected variability

## Reviewed Code

File: `.claude/skills/README.md` (lines 132-132)

```
@@ -0,0 +1,241 @@
+# Vlossom Style-Set Skills
+
+이 디렉토리에는 Vlossom의 새로운 Style-Set 시스템 개발을 지원하는 Claude Code skills가 포함되어 있습니다.
+
+## 📚 사용 가능한 Skills
+
+### 1. `/style-set-review` - StyleSet 코드 리뷰
+**목적**: 기존 StyleSet 구현을 철학에 맞게 검증하고 개선 제안
+
+**사용 시기**:
+- PR 리뷰 시
+- 새로운 StyleSet 작성 후
+- 기존 코드 품질 확인
+
+**예제**:
+```
+/style-set-review VsButton
+/style-set-review packages/vlossom/src/components/vs-card
+```
+
+**제공하는 것**:
+- ✅ 철학 준수 체크리스트 검증
+- ⚠️ 안티패턴 탐지
+- 💡 구체적인 개선 제안
+- 📊 개선 효과 예측
+
+---
+
+### 2. `/style-set-create` - 새 StyleSet 생성
+**목적**: 새 컴포넌트의 StyleSet을 철학에 맞게 설계하고 생성
+
+**사용 시기**:
+- 새 컴포넌트 개발 시작
+- StyleSet 설계 방향이 불확실할 때
+- 처음부터 올바르게 구현하고 싶을 때
+
+**예제**:
+```
+/style-set-create VsCard
+/style-set-create VsDataTable
+```
+
+**제공하는 것**:
+- 📋 단계별 가이드 (분석 → 설계 → 구현 → 검증)
+- 💻 완전한 코드 템플릿
+- 📝 타입 정의, 컴포넌트, CSS 생성
+- ✅ 검증 체크리스트
+
+---
+
+### 3. `/style-set-migrate` - 기존 컴포넌트 마이그레이션
+**목적**: 레거시 컴포넌트를 새 Style-Set 시스템으로 전환
+
+**사용 시기**:
+- 기존 컴포넌트 업그레이드
+- Breaking change 리팩토링
+- 시스템 전환 작업
+
+**예제**:
+```
+/style-set-migrate VsButton
+/style-set-migrate packages/vlossom/src/components/vs-input
+```
+
+**제공하는 것**:
+- 🔍 현재 상태 분석
+- 🎨 새 인터페이스 설계
+- 🔧 단계별 구현 가이드
+- 🧪 테스트 전략
+- 📖 문서화 및 배포 가이드
+- 📊 마이그레이션 메트릭
+
+---
+
+## 🎯 Style-Set 철학
+
+모든 skills는 다음 핵심 철학을 기반으로 합니다:
+
+### "최소한의 변수, 최대한의 유연성"
+> Variables for Variability, Properties for Predictability
+
+#### 핵심 원칙
+
+1. **명확한 관심사 분리**
+   - `variables`: CSS 변수로 노출할 커스터마이징 포인트
+   - `component`: CSSProperties로 직접 스타일 제어
+   - 하위 컴포넌트: 중첩된 StyleSet으로 전파
+
+2. **"Only What Needs to Vary" 원칙**
+   - 실제로 자주 커스터마이징되는 것만 `variables`로 노출
+   - 대부분의 스타일은 CSS에 직접 하드코딩
+   - 불필요한 CSS 변수 남발 금지
+
+3. **3단계 병합 시스템**
+   ```
+   baseStyleSet < styleSet < additionalStyleSet
+   ```
+
+4. **타입 안정성 강화**
+   - API 표면적 최소화
+   - 명확한 타입으로 잘못된 사용 방지
+
+---
+
+## 🚀 빠른 시작
+
+### 1. 새 컴포넌트 개발
+```bash
+# 1단계: StyleSet 생성
+/style-set-create VsNewComponent
+
+# 2단계: 구현 (skill이 가이드 제공)
+
+# 3단계: 리뷰
+/style-set-review VsNewComponent
+```
+
+### 2. 기존 컴포넌트 개선
+```bash
+# 1단계: 현재 상태 리뷰
+/style-set-review VsOldComponent
+
+# 2단계: 개선 방안 확인
+
+# 3단계: 필요시 마이그레이션
+/style-set-migrate VsOldComponent
+```
+
+### 3. PR 리뷰 시
+```bash
+# StyleSet 변경사항 검증
+/style-set-review VsButton
```

---

**Source:** [PR #303](https://github.com/vlossom-ui/vlossom/pull/303) by @sunio00000
**Keywords:** determinism, reproducibility, consistency, testing, ai-tools
**Category:** testing
