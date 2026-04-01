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

    public ComponentRegistry(ILogger<ComponentRegistry> logger, IConfiguration configuration)
    {
        _logger = logger;

        // dotnet run 실행 디렉토리(프로젝트 폴더) 기준으로 경로 계산
        var configuredPath = configuration["VlossomMcp:ComponentsPath"] ?? "../../vlossom/src/components";
        _componentsPath = Path.GetFullPath(
            Path.Combine(Directory.GetCurrentDirectory(), configuredPath)
        );
    }

    public IReadOnlyList<ComponentInfo> GetComponents()
    {
        return _components ??= LoadComponents();
    }

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
                var name = KebabToPascalCase(kebabName);
                var description = ReadDescription(dir);
                return new ComponentInfo(name, kebabName, description);
            })
            .OrderBy(c => c.Name)
            .ToList();

        _logger.LogInformation("컴포넌트 {Count}개를 로드했습니다.", components.Count);
        return components;
    }

    private static string KebabToPascalCase(string kebab)
    {
        return string.Concat(
            kebab.Split('-')
                 .Select(part => char.ToUpperInvariant(part[0]) + part[1..])
        );
    }

    private static string ReadDescription(string componentDir)
    {
        var readmePath = Path.Combine(componentDir, "README.md");
        if (!File.Exists(readmePath))
            return string.Empty;

        // README 형식:
        // (선택) > 한국어 문서 안내
        // (빈 줄)
        // # VsComponentName
        // (빈 줄)
        // 설명 텍스트
        var lines = File.ReadLines(readmePath)
            .Select(l => l.Trim())
            .Where(l => !l.StartsWith(">") && !l.StartsWith("#") && l.Length > 0)
            .Take(1);

        return lines.FirstOrDefault() ?? string.Empty;
    }
}
