
using System.Numerics;
using Microsoft.AspNetCore.SignalR;
using Reign.Server.Hubs;

namespace Reign.Server;

public class WorldStateService
{
    private readonly IHubContext<GameHub> _hubContext;
    private Dictionary<string, object> _worldState = new ();

    public WorldStateService(IHubContext<GameHub> hubcontext)
    {
        this._hubContext = hubcontext;
        InitializeServerLoop();
    }

    public WorldObjectState GetWorldObjectState(string key)
    {
        if (!_worldState.TryGetValue(key, out var state))
        {
            state = new WorldObjectState();
            _worldState[key] = state;
        }
        return state as WorldObjectState;            
    }

    public void Remove(string key)
    {
        _worldState.Remove(key);
    }

    private void InitializeServerLoop()
    {
        new Thread(async () => 
        {
            while(true)
            {
                _worldState["T"] = DateTimeOffset.Now.ToUnixTimeMilliseconds();
                await _hubContext.Clients.All.SendAsync("worldState", _worldState);  
                await Task.Delay(100);
            }
        }).Start();
    }
}


public class WorldObjectState 
{
    public float X { get; set; }
    public float Y { get; set; }
    public float Z { get; set; }
    public float Rotation { get; set; }
    public long Time { get; set; }
}