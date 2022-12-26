
namespace Reign.Server.Components;

public class HealthComponent : Component
{
    public HealthComponent(int health)
    {
        Health = health;
    }

    public int Health { get; set; }
}