
using System.Numerics;

namespace Reign.Server.Components;

public class VelocityComponent : Component
{
    public VelocityComponent(Vector3 velocity)
    {
        Velocity = velocity;
    }

    public Vector3 Velocity { get; }
}