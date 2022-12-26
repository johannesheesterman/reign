
namespace Reign.Server.Components;

public class TypeComponent : Component
{
    public string Type { get; }

    public TypeComponent(string type)
    {
        Type = type;
    }   
}