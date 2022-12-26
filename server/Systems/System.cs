
using Reign.Server.Components;

namespace Reign.Server.Systems;

public abstract class GameSystem
{
    private HashSet<string> registeredEntityIds;
    private List<Type> requiredComponents;
    private World world;

    public GameSystem()
    {
        registeredEntityIds = new HashSet<string>();
        requiredComponents = new List<Type>();
    }


    public void BindWorld(World world)
    {
        this.world = world;
    }
    
    public void UpdateEntityRegistration(Entity entity)
    {
        bool matches = Matches(entity);
        if (registeredEntityIds.Contains(entity.Id))
        {
            if (!matches)
            {
                registeredEntityIds.Remove(entity.Id);
            }
        }
        else
        {
            if (matches)
            {
                registeredEntityIds.Add(entity.Id);
            }
        }
    }
 
    private bool Matches(Entity entity)
    {
        foreach (Type required in requiredComponents)
        {
            if (!entity.HasComponent(required))
                return false;
        }
        return true;
    }

    protected void AddRequiredComponent<T>() where T : Component
    {
        requiredComponents.Add(typeof(T));
    }

    protected Entity[] Entities
    {
        get
        {
            return registeredEntityIds
                .Where(world.EntityExists)
                .Select(world.GetEntityById)
                .ToArray();
        }
    }

    public virtual void UpdateAll(float deltaTime)
    {
        foreach (var entity in Entities)
        {
            Update(entity, deltaTime);
        }
    }
    
    protected virtual void Update(Entity entity, float deltaTime) { }

    public virtual void DeleteEntity(string id)
    {
        if (registeredEntityIds.Contains(id))
        {
            registeredEntityIds.Remove(id);
        }
    }
}