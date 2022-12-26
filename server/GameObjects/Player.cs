
namespace Reign.Server.GameObjects;

public class Player : GameObject
{
    public int Health { get; private set; } = 100;
    public override string Type => "player";

    protected override float CollisionRadius => .25f;

    public void TakeDamage(int damage)
    {
        Health -= damage;
        if (Health <= 0)
        {
            Health = 100;
            X = 0;
            Z = 0;
        }
    }

    public override void Update(long delta)
    {
    }
}