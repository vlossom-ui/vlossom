using Sprout.Hosting;
using VlossomMcp.Services;
using VlossomMcp.Tools;

var builder = WebApplication.CreateBuilder(args);

builder.InitSproutBuilder(appName: "vlossom-mcp");

builder.Services.AddSingleton<ComponentRegistry>();

builder.Services
    .AddMcpServer()
    .WithTools<VlossomComponentTools>();

var app = builder.Build();

app.InitSproutApp();

app.MapMcp();

app.Run();
