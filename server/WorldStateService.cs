
using System.Numerics;
using Microsoft.AspNetCore.SignalR;
using Reign.Server.GameObjects;
using Reign.Server.Hubs;

namespace Reign.Server;

public class WorldStateService
{
    private readonly IHubContext<GameHub> _hubContext;
    private Dictionary<string, GameObject> _worldState = new ();

    public WorldStateService(IHubContext<GameHub> hubcontext)
    {
        this._hubContext = hubcontext;
        InitializeServerLoop();
    }

    public GameObject? GetWorldObjectState(string key)
    {
        if (_worldState.TryGetValue(key, out var state)) return state;
        return null;
    }

    public void RegisterGameObject(string key, GameObject gameObject)
    {
        _worldState[key] = gameObject;
    }

    public void Remove(string key)
    {
        _worldState.Remove(key);
    }

    private void InitializeServerLoop()
    {
        var delta = 50;
        new Thread(async () => 
        {
            while(true)
            {
                Console.Clear();
                
                var t = DateTimeOffset.Now.ToUnixTimeMilliseconds();

                foreach (var key in _worldState.Keys.ToArray())
                {                   
                    var obj = _worldState[key];
                    obj.Update(delta);
                    Console.WriteLine($"{key} {obj}");

                    if (obj.Type == "arrow")
                    {
                        if (obj.T + 3000 < t)
                        {
                            _worldState.Remove(key);
                        }
                    }
                }
                
                await _hubContext.Clients.All.SendAsync("worldState", _worldState); 
                
                Console.WriteLine($"World state contains {_worldState.Count} entities."); 
                await Task.Delay(delta);
            }
        }).Start();
    }
}