
using Microsoft.AspNetCore.SignalR;
using Reign.Server.Components;
using Reign.Server.GameObjects;
using System.Numerics;

namespace Reign.Server.Hubs;

public class GameHub : Hub
{
    private readonly World world;

    public GameHub(World world)
    {
        this.world = world;
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        world.DeleteEntity(Context.ConnectionId);
    }

    public async Task UpdatePos(float x, float y, float z, float r, long t)
    {
        // TODO: method to instantiate player entities
        if (!world.TryGetEntityById(Context.ConnectionId, out var entity))
        {
            entity = world.AddEntity(Context.ConnectionId);
            world.AddComponentToEntity(entity, new PositionComponent());
            world.AddComponentToEntity(entity, new HealthComponent(100));
            world.AddComponentToEntity(entity, new TypeComponent("player"));
        }

        entity!.GetComponent<PositionComponent>().Position = new Vector3(x, y, z);
    }    

    public async Task Shoot(float x, float y, float z, float angle, long t) 
    {
        // TODO: method to instantiate arrows
        var entity = world.AddEntity(Guid.NewGuid().ToString());
        world.AddComponentToEntity(entity, new PositionComponent(
            new Vector3(x, y, z), angle
        ));
        world.AddComponentToEntity(entity, new VelocityComponent(
            new Vector3(
                MathF.Sin(-angle) * .01f,
                0f,
                MathF.Cos(angle) * .01f
            )
        ));
        world.AddComponentToEntity(entity, new DamageComponent(40));
        world.AddComponentToEntity(entity, new TypeComponent("arrow"));
    }
}