using System.ComponentModel;
using ModelContextProtocol.Server;
using VlossomMcp.Services;

namespace VlossomMcp.Tools;

[McpServerToolType]
public class VlossomComponentTools(ComponentRegistry registry)
{
    [McpServerTool]
    [Description("Get a list of all Vlossom UI components with their names and descriptions.")]
    public IReadOnlyList<ComponentInfo> ListComponents()
    {
        return registry.GetComponents();
    }
}
