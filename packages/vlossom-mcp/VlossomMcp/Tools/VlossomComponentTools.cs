using System.ComponentModel;
using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using ModelContextProtocol.Server;
using VlossomMcp.Services;

namespace VlossomMcp.Tools;

[McpServerToolType]
public class VlossomComponentTools(
    ComponentRegistry registry,
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration,
    GitHubTokenStore tokenStore)
{
    [McpServerTool]
    [Description("Get a list of all Vlossom UI components with their names and descriptions.")]
    public IReadOnlyList<ComponentInfo> ListComponents()
        => registry.GetComponents();

    [McpServerTool]
    [Description("Check whether a GitHub token is configured for submitting issues.")]
    public GitHubTokenStatus CheckGitHubToken()
    {
        var isConfigured = tokenStore.IsConfigured
            || !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("VLOSSOM_GITHUB_TOKEN"))
            || !string.IsNullOrEmpty(configuration["VlossomMcp:GitHubToken"]);

        return new GitHubTokenStatus(isConfigured);
    }

    [McpServerTool]
    [Description(
        "Set the GitHub Personal Access Token (PAT) for submitting issues. " +
        "Required scope: issues:write. " +
        "The token is stored in memory for the current session only.")]
    public GitHubTokenStatus SetGitHubToken(
        [Description("GitHub Personal Access Token with issues:write scope")] string token)
    {
        tokenStore.Set(token);
        return new GitHubTokenStatus(true);
    }

    [McpServerTool]
    [Description(
        "Generate a structured Markdown template for a GitHub issue. " +
        "ALWAYS call this before ReportIssue. " +
        "After receiving the template, go through each RequiredSection with the user one by one " +
        "to collect detailed information before submitting.")]
    public IssueDraft DraftIssue(
        [Description("Brief one-line summary of the issue")] string summary,
        [Description("Issue type: 'bug', 'enhancement', or 'question'")] string type = "bug")
    {
        var (title, template, required) = type switch
        {
            "enhancement" => (
                $"feat: {summary}",
                $"## 요청 기능\n\n{summary}\n\n" +
                $"## 동기 / 사용 사례\n\n<!-- 이 기능이 왜 필요한지 설명해주세요 -->\n\n" +
                $"## 제안하는 API / 동작\n\n```vue\n<!-- 예상 사용 예시 -->\n```\n\n" +
                $"## 추가 컨텍스트\n\n<!-- 참고 자료, 스크린샷 등 -->",
                new[] { "동기 / 사용 사례", "제안하는 API / 동작" }
            ),
            "question" => (
                $"question: {summary}",
                $"## 질문\n\n{summary}\n\n" +
                $"## 시도한 것\n\n<!-- 이미 시도해본 것들을 적어주세요 -->\n\n" +
                $"## 관련 코드\n\n```vue\n<!-- 관련 코드 -->\n```",
                new[] { "시도한 것", "관련 코드" }
            ),
            _ => (
                $"fix: {summary}",
                $"## 버그 설명\n\n{summary}\n\n" +
                $"## 재현 방법\n\n1. \n2. \n3. \n\n" +
                $"## 예상 동작\n\n<!-- 어떻게 동작해야 하나요? -->\n\n" +
                $"## 실제 동작\n\n<!-- 실제로는 어떻게 동작하나요? -->\n\n" +
                $"## 코드 예시\n\n```vue\n<!-- 재현 코드 -->\n```\n\n" +
                $"## 환경\n\n- Vlossom 버전: \n- Vue 버전: \n- 브라우저: ",
                new[] { "재현 방법", "예상 동작", "실제 동작", "코드 예시" }
            )
        };

        return new IssueDraft(title, template, required);
    }

    [McpServerTool]
    [Description(
        "Create a GitHub issue on the Vlossom repository. " +
        "Call DraftIssue first and fill in all RequiredSections with the user before calling this. " +
        "Always confirm the final content with the user before submitting. " +
        "Uses VLOSSOM_GITHUB_TOKEN env var if set, otherwise falls back to 'gh auth token'.")]
    public async Task<ReportIssueResult> ReportIssue(
        [Description("Issue title")] string title,
        [Description("Issue body in Markdown, with all sections filled in")] string body,
        [Description("Optional labels such as 'bug', 'enhancement', 'question'")] string[]? labels = null)
    {
        var token = Environment.GetEnvironmentVariable("VLOSSOM_GITHUB_TOKEN")
            ?? configuration["VlossomMcp:GitHubToken"]
            ?? tokenStore.Token
            ?? throw new InvalidOperationException(
                "No GitHub token found. Call SetGitHubToken first.");

        var client = httpClientFactory.CreateClient("github");

        var request = new HttpRequestMessage(HttpMethod.Post, "repos/vlossom-ui/vlossom/issues")
        {
            Content = JsonContent.Create(new { title, body, labels = labels ?? [] })
        };
        request.Headers.Authorization = new("Bearer", token);

        var response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<GitHubIssueResponse>()
            ?? throw new InvalidOperationException("Unexpected empty response from GitHub API.");

        return new ReportIssueResult(result.HtmlUrl, result.Number);
    }

}

public record GitHubTokenStatus(bool IsConfigured);

public record IssueDraft(
    string SuggestedTitle,
    string BodyTemplate,
    string[] RequiredSections
);

public record ReportIssueResult(string IssueUrl, int IssueNumber);

file record GitHubIssueResponse(
    [property: System.Text.Json.Serialization.JsonPropertyName("html_url")] string HtmlUrl,
    [property: System.Text.Json.Serialization.JsonPropertyName("number")] int Number
);
