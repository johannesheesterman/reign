using Reign.Server;
using Reign.Server.Hubs;

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
builder.Services.AddSingleton<WorldStateService>();

var app = builder.Build();
app.UseCors("CorsPolicy");
app.MapGet("/", () => "Hello World!");
app.MapHub<GameHub>("/game");
app.Run();
