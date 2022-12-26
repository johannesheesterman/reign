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
    protected abstract float CollisionRadius { get; }
    public abstract void Update(long delta);
    public override string ToString()
    {
        return $"{this.GetType().Name}: {X}, {Y}, {Z}, {Rotation}";
    }

    public bool IsColliding(GameObject gameObject)
    {
        var distance = Vector2.Distance(new Vector2(X, Z), new Vector2(gameObject.X, gameObject.Z));
        return distance < CollisionRadius + gameObject.CollisionRadius;
    }

    public void Destroy()
    {
        // World.Instance.State.Remove(
        //     World.Instance.State.First(s => s.Value == this).Key);

    }
}