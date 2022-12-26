using System.Diagnostics;

namespace Reign.Server;

public class GameServer
{
    private readonly World world;

    public GameServer(World world)
    {
        this.world = world;
        InitializeServerLoop();
    }

    private void InitializeServerLoop()
    {
        var sw = new Stopwatch();
        sw.Start();
        var delta = 50;
        new Thread(async () => 
        {
            while(true)
            {
                var start = sw.ElapsedMilliseconds;        
                world.Update(delta);
                await Task.Delay(TimeSpan.FromMilliseconds(start + delta - sw.ElapsedMilliseconds));
            }
        }).Start();
    }
}