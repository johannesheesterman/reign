
using Microsoft.AspNetCore.SignalR;
using Reign.Server.Components;
using Reign.Server.Hubs;

namespace Reign.Server.Systems;

public class WorldStateBroadcastSystem : GameSystem
{
    private readonly IHubContext<GameHub> hubContext;

    public WorldStateBroadcastSystem(IHubContext<GameHub> hubContext)
    {
        this.hubContext = hubContext;
    }

    public override void UpdateAll(float deltaTime)
    {
        var worldState = new Dictionary<string, Dictionary<string, object>>();
        foreach (var entity in Entities)
        {
            worldState[entity.Id] = new Dictionary<string, object>
            {
                { "x", entity.GetComponent<PositionComponent>().Position.X },
                { "y", entity.GetComponent<PositionComponent>().Position.Y },
                { "z", entity.GetComponent<PositionComponent>().Position.Z },
                { "r", entity.GetComponent<PositionComponent>().Rotation },
                { "type", entity.GetComponent<TypeComponent>().Type }
            };
        }

        Task.Run(async () => 
        {
            await hubContext.Clients.All.SendAsync("worldState", worldState); 
        });
    }
}