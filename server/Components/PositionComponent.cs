
using System.Numerics;

namespace Reign.Server.Components;

public class PositionComponent : Component
{
    public Vector3 Position { get; set; }
    public float Rotation { get; set; }
    
    public PositionComponent(Vector3? position = null, float? rotation = null)
    {
        Position = position ?? Vector3.Zero;
        Rotation = rotation ?? 0f;
    }
}