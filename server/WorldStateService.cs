
using System.Numerics;
using Microsoft.AspNetCore.SignalR;
using Reign.Server.Hubs;

namespace Reign.Server;

public class WorldStateService
{
    private readonly IHubContext<GameHub> _hubContext;
    private Dictionary<string, WorldObjectState> _worldState = new ();

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
                
                Console.WriteLine($"World state contains {_worldState.Count} entities.");
                await _hubContext.Clients.All.SendAsync("worldState", _worldState);  
                await Task.Delay(delta);
            }
        }).Start();
    }
}


public class WorldObjectState 
{
    public float X { get; set; }
    public float Y { get; set; }
    public float Z { get; set; }
    public long T { get; set; }
    public float Rotation { get; set; }
    public string Type { get; set; }


    public void Update(int delta) 
    {
        if (Type == "player") return;

        if (Type == "arrow")
        {
            var speed =  0.01f;
            var dx = MathF.Sin(-Rotation) * speed * delta;
            var dy = MathF.Cos(Rotation) * speed * delta;
            X += dx;
            Z += dy;
        }
    }


    public override string ToString()
    {
        return $"{Type}: {X}, {Y}, {Z}, {Rotation}";
    }
}