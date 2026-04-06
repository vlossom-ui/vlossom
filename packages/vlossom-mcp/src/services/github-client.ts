const GITHUB_API_URL = "https://api.github.com/repos/vlossom-ui/vlossom/issues";

function getSafeErrorMessage(status: number): string {
    if (status === 401) return "GitHub token is invalid or expired. Please provide a valid PAT.";
    if (status === 403) return "GitHub token does not have required permissions (issues:write).";
    if (status === 404) return "Repository not found or token lacks read access.";
    if (status === 422) return "Invalid issue data. Check that title and labels are correct.";
    if (status === 429) return "GitHub API rate limit exceeded. Please wait and try again.";
    if (status >= 500) return "GitHub API is temporarily unavailable. Please try again later.";
    return "GitHub API request failed. Please try again.";
}

export interface CreateIssueResult {
    issueUrl: string;
    issueNumber: number;
}

let runtimeToken: string | undefined;

export function setGitHubToken(token: string): void {
    runtimeToken = token;
}

export function getGitHubToken(): string | undefined {
    return runtimeToken || process.env["VLOSSOM_GITHUB_TOKEN"] || undefined;
}

export async function createIssue(
    token: string,
    title: string,
    body: string,
    labels?: string[]
): Promise<CreateIssueResult> {
    const response = await fetch(GITHUB_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "vlossom-mcp",
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body, labels: labels ?? [] }),
    });

    if (!response.ok) {
        const text = await response.text();
        process.stderr.write(`GitHub API error ${response.status}: ${text}\n`);
        throw new Error(getSafeErrorMessage(response.status));
    }

    const data = (await response.json()) as { html_url: string; number: number };
    return { issueUrl: data.html_url, issueNumber: data.number };
}
