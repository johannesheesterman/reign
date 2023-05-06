using Microsoft.AspNetCore.SignalR;
using Reign.Server;
using Reign.Server.Components;
using Reign.Server.Hubs;
using Reign.Server.Systems;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR();
builder.Services.AddCors(options => options.AddPolicy("CorsPolicy",
    builder =>
    {
        builder.AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed((host) => true)
                .AllowCredentials();
    }));



builder.Services.AddTransient<WorldStateBroadcastSystem>();
builder.Services.AddTransient<PhysicsSystem>();
builder.Services.AddTransient<ProjectileDamageSystem>();
builder.Services.AddSingleton<World>();

var app = builder.Build();

var world = app.Services.GetService<World>()!;
world.AddSystem(app.Services.GetService<WorldStateBroadcastSystem>()!);
world.AddSystem(app.Services.GetService<PhysicsSystem>()!);
world.AddSystem(app.Services.GetService<ProjectileDamageSystem>()!);

var gameServer = new GameServer(
    world
);


for (int i = 0; i < 4; i++)
{
    var block = world.AddEntity(Guid.NewGuid().ToString());
    world.AddComponentToEntity(block, new PositionComponent(
        new System.Numerics.Vector3(i-1.5f, -.5f, 0)));
    world.AddComponentToEntity(block, new TypeComponent("block"));
}

app.UseCors("CorsPolicy");
app.MapGet("/", () => "Hello World!");
app.MapHub<GameHub>("/game");
app.Run();
