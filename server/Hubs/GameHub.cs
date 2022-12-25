
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
        _worldStateService.Remove(Context.ConnectionId);
    }

    public async Task UpdatePos(float x, float y, float z, float r, long t)
    {
        var playerPosition = _worldStateService.GetWorldObjectState(Context.ConnectionId);

        if (playerPosition == null)
        {
            playerPosition = new Player();
            _worldStateService.RegisterGameObject(Context.ConnectionId, playerPosition);
        }

        playerPosition.X = x;
        playerPosition.Y = y;
        playerPosition.Z = z;
        playerPosition.Rotation = r;
        playerPosition.T = t;
    }    

    public async Task Shoot(float x, float y, float z, float angle, long t) 
    {
        var obj = new Arrow();
        obj.X = x;
        obj.Y = y;
        obj.Z = z;
        obj.Rotation = angle;
        obj.T = DateTimeOffset.Now.ToUnixTimeMilliseconds();

        _worldStateService.RegisterGameObject(Guid.NewGuid().ToString(), obj);
    }
}