
using System.Numerics;
using Reign.Server.Components;

namespace Reign.Server.Systems;

public class PhysicsSystem : GameSystem
{
    public PhysicsSystem()
    {
        AddRequiredComponent<PositionComponent>();
        AddRequiredComponent<VelocityComponent>();
    }

    protected override void Update(Entity entity, float deltaTime)
    {
        var position = entity.GetComponent<PositionComponent>();
        var velocity = entity.GetComponent<VelocityComponent>();

        position.Position = new Vector3(
            position.Position.X + velocity.Velocity.X * deltaTime,
            position.Position.Y + velocity.Velocity.Y * deltaTime,
            position.Position.Z + velocity.Velocity.Z * deltaTime
        );
    }
}