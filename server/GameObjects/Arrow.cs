

namespace Reign.Server.GameObjects;

public class Arrow : GameObject
{
    private const float SPEED = 0.01f;

    public override string Type => "arrow";

    public override void Update(long delta)
    {
        X += MathF.Sin(-Rotation) * SPEED * delta;
        Z += MathF.Cos(Rotation) * SPEED * delta;
    }
}