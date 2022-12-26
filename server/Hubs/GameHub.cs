
using Microsoft.AspNetCore.SignalR;
using Reign.Server.GameObjects;
using System.Numerics;

namespace Reign.Server.Hubs;

public class GameHub : Hub
{
    private readonly WorldStateService _worldStateService;

    public GameHub(WorldStateService worldStateService)
    {
        this._worldStateService = worldStateService;
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        WorldState.Instance.State.Remove(Context.ConnectionId);
    }

    public async Task UpdatePos(float x, float y, float z, float r, long t)
    {
        if(!WorldState.Instance.State.TryGetValue(Context.ConnectionId, out var playerPosition))
        {
            playerPosition = new Player();
            WorldState.Instance.State.Add(Context.ConnectionId, playerPosition);
        }

        playerPosition.X = x;
        playerPosition.Y = y;
        playerPosition.Z = z;
        playerPosition.Rotation = r;
        playerPosition.T = t;
    }    

    public async Task Shoot(float x, float y, float z, float angle, long t) 
    {
        var obj = new Arrow(Context.ConnectionId);
        obj.X = x;
        obj.Y = y;
        obj.Z = z;
        obj.Rotation = angle;
        obj.T = DateTimeOffset.Now.ToUnixTimeMilliseconds();

        WorldState.Instance.State.Add(Guid.NewGuid().ToString(), obj);
    }
}