using Microsoft.AspNetCore.Authentication.JwtBearer;
using Serilog;
using Sprout.Hosting;
using VlossomMcp.Services;
using VlossomMcp.Tools;

var builder = WebApplication.CreateBuilder(args);

// appsettings.Local.json — git 제외, 로컬 시크릿 (GitHub PAT 등) 저장용
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: false);

builder.InitSproutBuilder(appName: "vlossom-mcp");

builder.Host.UseSerilog((ctx, lc) => lc
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft.AspNetCore.Hosting", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Routing", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Http", Serilog.Events.LogEventLevel.Warning)
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"));

builder.Services.AddSingleton<ComponentRegistry>();
builder.Services.AddSingleton<GitHubTokenStore>();

builder.Services.AddHttpClient("github", client =>
{
    client.BaseAddress = new Uri("https://api.github.com/");
    client.DefaultRequestHeaders.Add("User-Agent", "vlossom-mcp");
    client.DefaultRequestHeaders.Add("Accept", "application/vnd.github+json");
    client.DefaultRequestHeaders.Add("X-GitHub-Api-Version", "2022-11-28");
});

builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .WithTools<VlossomComponentTools>();

var azureAdConfig = builder.Configuration.GetSection("AzureAd");

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.Authority = $"https://login.microsoftonline.com/{azureAdConfig["TenantId"]}/v2.0";
        options.Audience = azureAdConfig["ClientId"];
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidAudiences = new[]
            {
                azureAdConfig["ClientId"]!,
                $"api://{azureAdConfig["ClientId"]}"
            }
        };
    });

builder.Services.AddAuthorization();

// ────────────────────────────────────────────────────────────────────────────

var app = builder.Build();

app.InitSproutApp();
app.UseSerilogRequestLogging();
app.UseAuthentication();
app.UseAuthorization();

// Sprout이 자동 등록하는 OAuth 메타데이터의 authorization_endpoint가 localhost를 가리키므로
// Azure AD 엔드포인트로 오버라이드 (프로덕션 환경에서만 노출)
if (!app.Environment.IsDevelopment())
{
    app.MapGet("/.well-known/oauth-authorization-server", (IConfiguration config, HttpRequest request) =>
    {
        var tenantId = config["AzureAd:TenantId"];
        var clientId = config["AzureAd:ClientId"];
        var baseUrl = $"{request.Scheme}://{request.Host}";
        return Results.Ok(new
        {
            issuer = $"https://login.microsoftonline.com/{tenantId}/v2.0",
            authorization_endpoint = $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize",
            token_endpoint = $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token",
            registration_endpoint = $"{baseUrl}/register",
            scopes_supported = new[] { "openid", "profile", "offline_access", $"{clientId}/.default" },
            response_types_supported = new[] { "code" },
            grant_types_supported = new[] { "authorization_code" },
            code_challenge_methods_supported = new[] { "S256" }
        });
    }).AllowAnonymous();
}

// OAuth 2.0 Dynamic Client Registration (RFC 7591)
// MCP 클라이언트가 OAuth 플로우 시작 전 Azure AD 앱 자격증명을 얻기 위해 호출
app.MapPost("/register", async (HttpRequest request, IConfiguration config) =>
{
    using var body = await System.Text.Json.JsonDocument.ParseAsync(request.Body);
    var redirectUris = body.RootElement.TryGetProperty("redirect_uris", out var uris)
        ? uris.EnumerateArray().Select(u => u.GetString()!).ToArray()
        : Array.Empty<string>();

    return Results.Ok(new
    {
        client_id = config["AzureAd:ClientId"],
        client_id_issued_at = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
        redirect_uris = redirectUris
    });
}).AllowAnonymous();

if (app.Environment.IsDevelopment())
    app.MapMcp("/mcp").AllowAnonymous();
else
    app.MapMcp("/mcp");

app.Run();
