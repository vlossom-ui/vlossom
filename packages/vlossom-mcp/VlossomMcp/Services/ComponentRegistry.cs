using Microsoft.Extensions.Hosting;

namespace VlossomMcp.Services;

public record ComponentInfo(
    string Name,
    string KebabName,
    string Description
);

public class ComponentRegistry
{
    private readonly ILogger<ComponentRegistry> _logger;
    private readonly string _componentsPath;
    private IReadOnlyList<ComponentInfo>? _components;

    public ComponentRegistry(ILogger<ComponentRegistry> logger, IConfiguration configuration, IHostEnvironment hostEnvironment)
    {
        _logger = logger;

        var configuredPath = configuration["VlossomMcp:ComponentsPath"] ?? "components";
        _componentsPath = Path.GetFullPath(Path.Combine(hostEnvironment.ContentRootPath, configuredPath));
    }

    public IReadOnlyList<ComponentInfo> GetComponents()
        => _components ??= LoadComponents();

    private IReadOnlyList<ComponentInfo> LoadComponents()
    {
        if (!Directory.Exists(_componentsPath))
        {
            _logger.LogWarning("컴포넌트 디렉토리를 찾을 수 없습니다: {Path}", _componentsPath);
            return [];
        }

        var components = Directory
            .GetDirectories(_componentsPath, "vs-*")
            .Select(dir =>
            {
                var kebabName = Path.GetFileName(dir);
                return new ComponentInfo(KebabToPascalCase(kebabName), kebabName, ReadDescription(dir));
            })
            .OrderBy(c => c.Name)
            .ToList();

        _logger.LogInformation("컴포넌트 {Count}개를 로드했습니다.", components.Count);
        return components;
    }

    private static string KebabToPascalCase(string kebab)
        => string.Concat(kebab.Split('-').Select(part => char.ToUpperInvariant(part[0]) + part[1..]));

    private static string ReadDescription(string componentDir)
    {
        var readmePath = Path.Combine(componentDir, "README.md");
        if (!File.Exists(readmePath))
            return string.Empty;

        // 첫 번째 본문 줄 추출 (> 안내문, # 제목 제외)
        return File.ReadLines(readmePath)
            .Select(l => l.Trim())
            .FirstOrDefault(l => l.Length > 0 && !l.StartsWith('>') && !l.StartsWith('#'))
            ?? string.Empty;
    }
}
