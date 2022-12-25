using System.Numerics;

namespace Reign.Server.GameObjects;

public abstract class GameObject
{
    public float X { get; set; }
    public float Y { get; set; }
    public float Z { get; set; }
    public long T { get; set; }
    public float Rotation { get; set; }
    public abstract string Type { get; }
    
    public abstract void Update(long delta);
    public override string ToString()
    {
        return $"{this.GetType().Name}: {X}, {Y}, {Z}, {Rotation}";
    }

}