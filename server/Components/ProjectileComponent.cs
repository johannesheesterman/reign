

namespace Reign.Server.Components;

public class ProjectileComponent : Component
{
    public float Lifetime;
    public readonly string OwnerId;

    public ProjectileComponent(string ownerId, float lifetime)
    {
        OwnerId = ownerId;
        Lifetime = lifetime;
    }

}