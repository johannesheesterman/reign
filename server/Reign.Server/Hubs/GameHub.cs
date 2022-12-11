
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
    }    

    public async Task Shoot(float x, float y, float z, float angle, long t) 
    {
        Console.WriteLine($"Add projectile {x}, {y}, {z}, {angle}");
    }
}