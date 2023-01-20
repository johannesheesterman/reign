

using System.Numerics;
using Reign.Server.Components;

namespace Reign.Server.Systems;

public class ProjectileDamageSystem : GameSystem
{
    private readonly World world;

    public ProjectileDamageSystem(World world)
    {
        AddRequiredComponent<ProjectileComponent>();
        AddRequiredComponent<ColliderComponent>();
        AddRequiredComponent<PositionComponent>();
        AddRequiredComponent<DamageComponent>();
        this.world = world;
    }

    protected override void Update(Entity entity, float deltaTime)
    {
        var projectile = entity.GetComponent<ProjectileComponent>();

        projectile.Lifetime -= deltaTime;

        if (projectile.Lifetime < 0)
        {
            Destroy(entity);
            return;
        }


        foreach (var target in world.entities.Values.Where(e =>
            e != entity
            && e.Id != projectile.OwnerId
            && e.HasComponent<HealthComponent>()
            && e.HasComponent<PositionComponent>()
            && e.HasComponent<ColliderComponent>()))
        {
            if (!IsColliding(entity, target)) continue;
            
            var health = target.GetComponent<HealthComponent>();
            var damage = entity.GetComponent<DamageComponent>();
            health.Health -= damage.Damage;
            Destroy(entity);
            return;
        }
    }

    private void Destroy(Entity entity)
    {
        world.DeleteEntity(entity.Id);
    }

    private bool IsColliding(Entity entity, Entity target)
    {
        var pos0 = entity.GetComponent<PositionComponent>().Position;
        var pos1 = target.GetComponent<PositionComponent>().Position;
        var colRad0 = entity.GetComponent<ColliderComponent>().Radius;
        var colRad1 = target.GetComponent<ColliderComponent>().Radius;

        var distance = Vector2.Distance(new Vector2(pos0.X, pos0.Z), new Vector2(pos1.X, pos1.Z));
        return distance < colRad0 + colRad1;
    }
}