const GITHUB_API_URL = "https://api.github.com/repos/vlossom-ui/vlossom/issues";

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
        throw new Error(`GitHub API error ${response.status}: ${text}`);
    }

    const data = (await response.json()) as { html_url: string; number: number };
    return { issueUrl: data.html_url, issueNumber: data.number };
}
