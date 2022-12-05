
using Microsoft.AspNetCore.SignalR;

namespace Reign.Server.Hubs;

public class GameHub : Hub
{
    public async Task UpdatePos(float x, float y, float z, float r)
    {
        await Clients.All.SendAsync("messageReceived", Context.ConnectionId, x, y, z, r);  
    } 
}