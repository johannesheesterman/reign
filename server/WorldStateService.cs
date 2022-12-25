
using System.Numerics;
using Microsoft.AspNetCore.SignalR;
using Reign.Server.GameObjects;
using Reign.Server.Hubs;

namespace Reign.Server;

public class WorldState 
{
    public Dictionary<string, GameObject> State = new();
    private static WorldState? _instance = null;

    private WorldState()
    {

    }

    public static WorldState Instance
    {
        get
        {
            if (_instance == null) 
                _instance = new WorldState();

            return _instance;
        }        
    }
}

public class WorldStateService
{
    private readonly IHubContext<GameHub> _hubContext;

    public WorldStateService(IHubContext<GameHub> hubcontext)
    {
        this._hubContext = hubcontext;
        InitializeServerLoop();
    }

    public void AddGameObject(string key, GameObject gameObject)
    {
        WorldState.Instance.State.Add(key, gameObject);
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

                foreach (var key in WorldState.Instance.State.Keys.ToArray())
                {                   
                    var obj = WorldState.Instance.State[key];
                    obj.Update(delta);
                    Console.WriteLine($"{key} {obj}");

                    if (obj.Type == "arrow")
                    {
                        if (obj.T + 3000 < t)
                        {
                            WorldState.Instance.State.Remove(key);
                        }
                    }
                }
                
                await _hubContext.Clients.All.SendAsync("worldState", WorldState.Instance.State); 
                
                Console.WriteLine($"World state contains {WorldState.Instance.State.Count} entities."); 
                await Task.Delay(delta);
            }
        }).Start();
    }
}