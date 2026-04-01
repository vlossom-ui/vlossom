using Microsoft.AspNetCore.Authentication.JwtBearer;
using Serilog;
using Sprout.Hosting;
using VlossomMcp.Services;
using VlossomMcp.Tools;

var builder = WebApplication.CreateBuilder(args);

builder.InitSproutBuilder(appName: "vlossom-mcp");

builder.Host.UseSerilog((ctx, lc) => lc
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft.AspNetCore.Hosting", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Routing", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Http", Serilog.Events.LogEventLevel.Warning)
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"));

builder.Services.AddSingleton<ComponentRegistry>();

builder.Services
    .AddMcpServer()
    .WithHttpTransport()
    .WithTools<VlossomComponentTools>();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var azureAdConfig = builder.Configuration.GetSection("AzureAd");
        options.Authority = $"https://login.microsoftonline.com/{azureAdConfig["TenantId"]}/v2.0";
        options.Audience = azureAdConfig["ClientId"];
    });
builder.Services.AddAuthorization();

var app = builder.Build();

app.InitSproutApp();

app.UseSerilogRequestLogging();

app.UseAuthentication();
app.UseAuthorization();

// OAuth 메타데이터 오버라이드 - Sprout 기본값(localhost/authorize)을 Azure AD 엔드포인트로 교체
app.MapGet("/.well-known/oauth-authorization-server", (IConfiguration config) =>
{
    var tenantId = config["AzureAd:TenantId"];
    var clientId = config["AzureAd:ClientId"];
    return Results.Ok(new
    {
        issuer = $"https://login.microsoftonline.com/{tenantId}/v2.0",
        authorization_endpoint = $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/authorize",
        token_endpoint = $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token",
        registration_endpoint = "http://localhost:5100/register",
        scopes_supported = new[] { "openid", "profile", "offline_access", $"{clientId}/.default" },
        response_types_supported = new[] { "code" },
        grant_types_supported = new[] { "authorization_code" },
        code_challenge_methods_supported = new[] { "S256" }
    });
}).AllowAnonymous();

// OAuth 2.0 Dynamic Client Registration (RFC 7591)
// MCP 클라이언트(Claude Code)가 OAuth 플로우 시작 전 호출하는 엔드포인트
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

// 로컬 개발 환경에서는 인증 불필요
if (app.Environment.IsDevelopment())
{
    app.MapMcp("/mcp").AllowAnonymous();
}
else
{
    app.MapMcp("/mcp");
}

app.Run();
