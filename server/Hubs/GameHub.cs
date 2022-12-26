
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
        if (!world.TryGetEntityById(Context.ConnectionId, out var entity))
        {
            // TODO: method to instantiate player entities
            entity = world.AddEntity(Context.ConnectionId);
            world.AddComponentToEntity(entity, new PositionComponent());
            world.AddComponentToEntity(entity, new TypeComponent("player"));
        }

        entity!.GetComponent<PositionComponent>().Position = new Vector3(x, y, z);
    }    

    public async Task Shoot(float x, float y, float z, float angle, long t) 
    {
        // var obj = new Arrow(Context.ConnectionId);
        // obj.X = x;
        // obj.Y = y;
        // obj.Z = z;
        // obj.Rotation = angle;
        // obj.T = DateTimeOffset.Now.ToUnixTimeMilliseconds();

       // World.Instance.State.Add(Guid.NewGuid().ToString(), obj);
    }
}