---
name: vlossom
description: >
  Use when working with Vlossom UI components — checking component list, reporting bugs,
  requesting enhancements, or asking questions via the vlossom-mcp MCP server.
  Trigger on: "컴포넌트 목록", "이슈 등록", "버그 리포트", "vlossom 이슈", component name lookups.
---

# Vlossom MCP Tool 사용 가이드

vlossom-mcp MCP 서버 도구를 직접 호출하여 컴포넌트 정보를 조회하고 GitHub 이슈를 등록합니다.

## Step 0: 인증

도구를 처음 사용하기 전에 인증이 필요합니다.

```
mcp__vlossom__authenticate 호출
→ OAuth 인증 URL을 사용자에게 안내
→ 사용자가 브라우저에서 인증 완료
→ 이후 실제 도구들이 자동으로 활성화됨
```

인증이 이미 완료된 경우 이 단계를 건너뜁니다.

---

## 사용 시나리오

### 1. 컴포넌트 목록 조회

**트리거**: "컴포넌트 목록", "어떤 컴포넌트가 있나요?", 특정 컴포넌트 이름 검색

```
mcp__vlossom__list_components 호출
→ 결과에서 관련 컴포넌트 필터링하여 사용자에게 안내
```

### 2. 이슈 등록

**트리거**: "이슈 등록", "버그 리포트", "기능 요청", "질문"

**반드시 이 순서를 따릅니다:**

```
Step 1. mcp__vlossom__CheckGitHubToken() 호출
        → IsConfigured: false이면 사용자에게 GitHub PAT 입력 요청
           "GitHub Personal Access Token(PAT)을 입력해주세요. (issues:write 권한 필요)"
        → 입력받은 토큰으로 mcp__vlossom__SetGitHubToken(token) 호출
        → IsConfigured: true이면 바로 Step 2로 진행

Step 2. mcp__vlossom__DraftIssue(summary, type) 호출
        type: "bug" | "enhancement" | "question"
        → SuggestedTitle, BodyTemplate, RequiredSections 반환

Step 3. RequiredSections 항목을 사용자와 하나씩 확인
        → 모든 필수 항목 수집

Step 4. 최종 내용을 사용자에게 보여주고 승인 받기
        "이 내용으로 이슈를 등록할까요?" — 반드시 확인

Step 5. mcp__vlossom__ReportIssue(title, body, labels?) 호출
        → 등록된 이슈 URL과 번호 반환하여 사용자에게 안내
```

> ⚠️ `ReportIssue`는 실제 GitHub 이슈를 생성합니다. 사용자 명시적 승인 없이 절대 호출하지 마세요.

---

## 이슈 타입별 RequiredSections

| type | 필수 항목 |
|------|-----------|
| `bug` | 재현 방법, 예상 동작, 실제 동작, 코드 예시 |
| `enhancement` | 동기 / 사용 사례, 제안하는 API / 동작 |
| `question` | 시도한 것, 관련 코드 |

## 라벨 가이드

| 상황 | labels |
|------|--------|
| 버그 | `["bug"]` |
| 기능 요청 | `["enhancement"]` |
| 질문 | `["question"]` |
| 특정 컴포넌트 | `["bug", "vs-button"]` |

---

## 사용 예시

**컴포넌트 조회**
```
사용자: "드롭다운 관련 컴포넌트 있나요?"
→ mcp__vlossom__list_components 호출 후 관련 항목 안내
```

**버그 리포트**
```
사용자: "VsSelect에서 v-model이 안 돼요"
→ mcp__vlossom__DraftIssue("VsSelect v-model not updating", "bug")
→ 재현 방법 → 예상 동작 → 실제 동작 → 코드 예시 순서로 확인
→ 사용자 승인 후 mcp__vlossom__ReportIssue 호출
```

**기능 요청**
```
사용자: "VsButton에 loading 텍스트 추가 요청하고 싶어요"
→ mcp__vlossom__DraftIssue("Add loading text to VsButton", "enhancement")
→ 동기/사용 사례 → 제안 API 순서로 확인
→ 사용자 승인 후 mcp__vlossom__ReportIssue 호출
```
