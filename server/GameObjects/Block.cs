namespace Reign.Server.GameObjects
{
    public class Block : GameObject
    {
        public override string Type => "block";

        protected override float CollisionRadius => 0.5f;

        public override void Update(long delta)
        {
        }
    }
}
