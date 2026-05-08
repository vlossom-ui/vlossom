const GITHUB_REPO = 'vlossom-ui/vlossom';
const GITHUB_API_BASE_URL = `https://api.github.com/repos/${GITHUB_REPO}`;
const GITHUB_RAW_BASE_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}`;
const GITHUB_ISSUES_API_URL = `${GITHUB_API_BASE_URL}/issues`;

function getSafeErrorMessage(status: number): string {
    if (status === 401) return 'GitHub token is invalid or expired. Please provide a valid PAT.';
    if (status === 403) return 'GitHub token does not have required permissions (issues:write).';
    if (status === 404) return 'Repository not found or token lacks read access.';
    if (status === 422) return 'Invalid issue data. Check that title and labels are correct.';
    if (status === 429) return 'GitHub API rate limit exceeded. Please wait and try again.';
    if (status >= 500) return 'GitHub API is temporarily unavailable. Please try again later.';
    return 'GitHub API request failed. Please try again.';
}

export interface CreateIssueResult {
    issueUrl: string;
    issueNumber: number;
}

export function getGitHubToken(): string | undefined {
    return process.env['VLOSSOM_GITHUB_TOKEN'] || undefined;
}

function getGitHubHeaders(extra?: Record<string, string>): HeadersInit {
    const token = getGitHubToken();
    return {
        'User-Agent': 'vlossom-mcp',
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

function getReadErrorMessage(status: number): string {
    if (status === 401) return 'GitHub authentication failed while reading repository data.';
    if (status === 403) return 'GitHub API rate limit or permissions blocked repository data access.';
    if (status === 404) return 'GitHub repository content was not found.';
    if (status === 429) return 'GitHub API rate limit exceeded. Please wait and try again.';
    if (status >= 500) return 'GitHub API is temporarily unavailable. Please try again later.';
    return 'GitHub repository data request failed.';
}

export async function fetchGitHubJson<T>(path: string): Promise<T> {
    const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
        headers: getGitHubHeaders(),
    });

    if (!response.ok) {
        throw new Error(getReadErrorMessage(response.status));
    }

    return (await response.json()) as T;
}

export interface GitHubContentEntry {
    name: string;
    path: string;
    type: 'file' | 'dir' | 'symlink' | 'submodule';
}

export async function fetchGitHubDirectory(path: string, ref = 'main'): Promise<GitHubContentEntry[]> {
    const cleanPath = path.replace(/^\/+/, '');
    return fetchGitHubJson<GitHubContentEntry[]>(`/contents/${cleanPath}?ref=${encodeURIComponent(ref)}`);
}

export function getRawGitHubUrl(path: string, ref = 'main'): string {
    return `${GITHUB_RAW_BASE_URL}/${encodeURIComponent(ref)}/${path.replace(/^\/+/, '')}`;
}

export async function fetchGitHubRawText(path: string, ref?: string): Promise<string> {
    const url = getRawGitHubUrl(path, ref);
    const response = await fetch(url, {
        headers: getGitHubHeaders({ Accept: 'text/plain' }),
    });

    if (!response.ok) {
        throw new Error(getReadErrorMessage(response.status));
    }

    return response.text();
}

export async function createIssue(
    token: string,
    title: string,
    body: string,
    labels?: string[],
): Promise<CreateIssueResult> {
    const response = await fetch(GITHUB_ISSUES_API_URL, {
        method: 'POST',
        headers: {
            ...getGitHubHeaders(),
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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
