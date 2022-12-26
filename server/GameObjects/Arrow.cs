

namespace Reign.Server.GameObjects;

public class Arrow : GameObject
{
    private const float SPEED = 0.01f;
    private const int LIFETIME = 3000;
    private readonly string ownerId;

    public override string Type => "arrow";

    protected override float CollisionRadius => .1f;

    public Arrow(string ownerId)
    {
        this.ownerId = ownerId;
    }

    public override void Update(long delta)
    {
        X += MathF.Sin(-Rotation) * SPEED * delta;
        Z += MathF.Cos(Rotation) * SPEED * delta;

        if (this.T + LIFETIME < DateTimeOffset.Now.ToUnixTimeMilliseconds())
            Destroy();

        foreach (var gameObject in WorldState.Instance.State)
        {
            if (gameObject.Value == this || gameObject.Key == ownerId) continue;
            
            if (gameObject.Value is Player && gameObject.Value.IsColliding(this))
            {
                ((Player)gameObject.Value).TakeDamage(40);
                Destroy();
            }
        }
    }
}