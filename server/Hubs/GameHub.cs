
using Microsoft.AspNetCore.SignalR;
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
        _worldStateService.Remove(Context.ConnectionId);
    }

    public async Task UpdatePos(float x, float y, float z, float r, long t)
    {
        var playerPosition = _worldStateService.GetWorldObjectState(Context.ConnectionId);
        playerPosition.Type = "player";
        playerPosition.X = x;
        playerPosition.Y = y;
        playerPosition.Z = z;
        playerPosition.Rotation = r;
        playerPosition.T = t;
    }    

    public async Task Shoot(float x, float y, float z, float angle, long t) 
    {
        var obj = _worldStateService.GetWorldObjectState(Guid.NewGuid().ToString());
        obj.Type = "arrow";
        obj.X = x;
        obj.Y = y;
        obj.Z = z;
        obj.Rotation = angle;
        obj.T = DateTimeOffset.Now.ToUnixTimeMilliseconds();
    }
}