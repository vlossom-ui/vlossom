#!/usr/bin/env bash
# README.md → README.ko.md 일괄 rename 스크립트
# 내용 변경 없이 rename만 수행 (git history 보존)
set -e

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

RENAMED=0
SKIPPED=0

for dir in "${TARGETS[@]}"; do
  src="$REPO_ROOT/$dir/README.md"
  dst="$REPO_ROOT/$dir/README.ko.md"

  if [ ! -f "$src" ]; then
    echo "[SKIP] $dir/README.md not found"
    ((SKIPPED++))
    continue
  fi

  if [ -f "$dst" ]; then
    echo "[SKIP] $dir/README.ko.md already exists"
    ((SKIPPED++))
    continue
  fi

  git -C "$REPO_ROOT" mv "$dir/README.md" "$dir/README.ko.md"
  echo "[DONE] $dir/README.md → README.ko.md"
  ((RENAMED++))
done

echo ""
echo "=== 완료: ${RENAMED}개 rename, ${SKIPPED}개 skip ==="
