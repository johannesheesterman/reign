
namespace Reign.Server.Components;

public class DamageComponent : Component
{
    public DamageComponent(int damage)
    {
        Damage = damage;
    }

    public int Damage { get; set; }
}