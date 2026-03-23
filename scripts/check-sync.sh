#!/usr/bin/env bash
# 영/한 README 파일 쌍 동기화 확인 스크립트
# README.md (영어) + README.ko.md (한국어) 쌍이 모두 존재하는지 검사

REPO_ROOT="$(git rev-parse --show-toplevel)"

TARGETS=(
  "packages/vlossom/src/components/vs-accordion"
  "packages/vlossom/src/components/vs-avatar"
  "packages/vlossom/src/components/vs-bar"
  "packages/vlossom/src/components/vs-block"
  "packages/vlossom/src/components/vs-button"
  "packages/vlossom/src/components/vs-checkbox"
  "packages/vlossom/src/components/vs-chip"
  "packages/vlossom/src/components/vs-container"
  "packages/vlossom/src/components/vs-dimmed"
  "packages/vlossom/src/components/vs-divider"
  "packages/vlossom/src/components/vs-drawer"
  "packages/vlossom/src/components/vs-expandable"
  "packages/vlossom/src/components/vs-file-drop"
  "packages/vlossom/src/components/vs-floating"
  "packages/vlossom/src/components/vs-focus-trap"
  "packages/vlossom/src/components/vs-footer"
  "packages/vlossom/src/components/vs-form"
  "packages/vlossom/src/components/vs-grid"
  "packages/vlossom/src/components/vs-grouped-list"
  "packages/vlossom/src/components/vs-header"
  "packages/vlossom/src/components/vs-image"
  "packages/vlossom/src/components/vs-index-view"
  "packages/vlossom/src/components/vs-inner-scroll"
  "packages/vlossom/src/components/vs-input"
  "packages/vlossom/src/components/vs-input-wrapper"
  "packages/vlossom/src/components/vs-label-value"
  "packages/vlossom/src/components/vs-layout"
  "packages/vlossom/src/components/vs-loading"
  "packages/vlossom/src/components/vs-message"
  "packages/vlossom/src/components/vs-modal"
  "packages/vlossom/src/components/vs-page"
  "packages/vlossom/src/components/vs-pagination"
  "packages/vlossom/src/components/vs-progress"
  "packages/vlossom/src/components/vs-radio"
  "packages/vlossom/src/components/vs-render"
  "packages/vlossom/src/components/vs-responsive"
  "packages/vlossom/src/components/vs-search-input"
  "packages/vlossom/src/components/vs-select"
  "packages/vlossom/src/components/vs-skeleton"
  "packages/vlossom/src/components/vs-steps"
  "packages/vlossom/src/components/vs-switch"
  "packages/vlossom/src/components/vs-table"
  "packages/vlossom/src/components/vs-tabs"
  "packages/vlossom/src/components/vs-textarea"
  "packages/vlossom/src/components/vs-text-wrap"
  "packages/vlossom/src/components/vs-theme-button"
  "packages/vlossom/src/components/vs-toast"
  "packages/vlossom/src/components/vs-toggle"
  "packages/vlossom/src/components/vs-tooltip"
  "packages/vlossom/src/components/vs-visible-render"
  "packages/vlossom/src/plugins/alert-plugin"
  "packages/vlossom/src/plugins/confirm-plugin"
  "packages/vlossom/src/plugins/modal-plugin"
  "packages/vlossom/src/plugins/prompt-plugin"
  "packages/vlossom/src/plugins/toast-plugin"
)

OK=0
MISSING_EN=0
MISSING_KO=0

echo "=== README 동기화 확인 ==="
echo ""

for dir in "${TARGETS[@]}"; do
  en="$REPO_ROOT/$dir/README.md"
  ko="$REPO_ROOT/$dir/README.ko.md"
  has_en=false
  has_ko=false

  [ -f "$en" ] && has_en=true
  [ -f "$ko" ] && has_ko=true

  if $has_en && $has_ko; then
    echo "[OK]      $dir"
    ((OK++))
  elif $has_en && ! $has_ko; then
    echo "[NO KO]   $dir  ← README.ko.md 없음"
    ((MISSING_KO++))
  elif ! $has_en && $has_ko; then
    echo "[NO EN]   $dir  ← README.md(영어) 없음"
    ((MISSING_EN++))
  else
    echo "[MISSING] $dir  ← 양쪽 모두 없음"
    ((MISSING_EN++))
    ((MISSING_KO++))
  fi
done

echo ""
echo "=== 결과 ==="
echo "  완료: ${OK}개"
echo "  영어 누락: ${MISSING_EN}개"
echo "  한국어 누락: ${MISSING_KO}개"

if [ $MISSING_EN -eq 0 ] && [ $MISSING_KO -eq 0 ]; then
  echo ""
  echo "✓ 모든 파일 쌍이 존재합니다."
  exit 0
else
  exit 1
fi
