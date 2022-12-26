using Microsoft.AspNetCore.SignalR;
using Reign.Server;
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
builder.Services.AddSingleton<World>();

var app = builder.Build();

var world = app.Services.GetService<World>()!;
world.AddSystem(app.Services.GetService<WorldStateBroadcastSystem>()!);

var gameServer = new GameServer(
    world
);

app.UseCors("CorsPolicy");
app.MapGet("/", () => "Hello World!");
app.MapHub<GameHub>("/game");
app.Run();
