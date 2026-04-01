namespace VlossomMcp.Services;

public class GitHubTokenStore
{
    private string? _token;

    public string? Token => _token;
    public bool IsConfigured => !string.IsNullOrEmpty(_token);

    public void Set(string token) => _token = token.Trim();
}
