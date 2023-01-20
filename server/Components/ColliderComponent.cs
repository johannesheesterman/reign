
namespace Reign.Server.Components;

public class ColliderComponent : Component
{
    public ColliderComponent(float radius)
    {
        Radius = radius;
    }

    public float Radius { get; }
}