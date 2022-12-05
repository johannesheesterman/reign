
using Microsoft.AspNetCore.SignalR;
using System.Numerics;

namespace Reign.Server.Hubs;

public class GameHub : Hub
{

    private Dictionary<string, PlayerPosition> _playerPositions = new ();

    public async Task UpdatePos(float x, float y, float z, float r, long t)
    {
        if (!_playerPositions.ContainsKey(Context.ConnectionId))
            _playerPositions[Context.ConnectionId] = new PlayerPosition();

        var playerPosition = _playerPositions[Context.ConnectionId];
        if (t <= playerPosition.Time) return;

        playerPosition.Time = t;

        var newPosition = new Vector3(x, y, z);
        if (newPosition == playerPosition.Position && r == playerPosition.Rotation) return;

        playerPosition.Position = newPosition;
        playerPosition.Rotation = r;
        await Clients.All.SendAsync("playerPos", Context.ConnectionId, x, y, z, r, t);  
    } 
}


public class PlayerPosition 
{
    public Vector3 Position { get; set; }
    public float Rotation { get; set; }
    public long Time { get; set; }
}