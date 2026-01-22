---
title: "Naming Style"
keywords: ["naming", "variable", "style", "documentation", "comment", "go", "class", "interface", "struct", "클래스", "CSS custom properties", "WCAG", "contrast ratio", "user interface design", "interactive elements", "color accessibility", "design system", "component styling"]
category: "style"
created_from: "PR #312, Comment by smithoo"
created_at: "2026-01-22"
last_updated: "2026-01-22"
llm_enhanced: true
---
# Naming Style

## 요약
When styling buttons, ensure sufficient visual contrast and accessibility by carefully evaluating color choices, particularly when using CSS variables like --vs-no-color for background colors, as poor contrast can impact visibility and readability.

## 규칙
This convention addresses UI/UX accessibility concerns in CSS styling, specifically for button components. When implementing button styles using CSS variables, developers must consider the visual contrast between the button's background color and its surrounding elements or text. The use of certain CSS variables (such as --vs-no-color) may result in insufficient contrast, making buttons difficult to see or read. This is particularly important for maintaining accessibility standards and ensuring a good user experience. The convention suggests modifying the 'clear-btn' class while being mindful of these visibility concerns. Proper attention to color scheme selection helps maintain readability and ensures that interactive elements like buttons remain clearly distinguishable to all users.

## 출처
이 컨벤션은 [PR #312](https://github.com/vlossom-ui/vlossom/pull/312)의 리뷰 과정에서 확립되었습니다.
- 작성자: smithoo
- 작성일: 2026. 1. 22.
