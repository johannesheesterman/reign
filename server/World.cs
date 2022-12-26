
using Reign.Server.Components;
using Reign.Server.Systems;

namespace Reign.Server;

public class World
{
    public Dictionary<string, Entity> entities;
    private Dictionary<Type, GameSystem> systems;
    private List<string> toDelete;

    public World()
    {
        entities = new Dictionary<string, Entity>();
        systems = new Dictionary<Type, GameSystem>();
        toDelete = new List<string>();
    }

    public Entity AddEntity(string id)
    {
        var entity = new Entity(id);
        entities[entity.Id] = entity;
        return entity;
    }

    public void DeleteEntity(string id)
    {
        toDelete.Add(id);
    }

    public bool EntityExists(string id)
    {
        return entities.ContainsKey(id);
    }

    public bool TryGetEntityById(string id, out Entity? entity)
    {
        entity = null;
        if (!EntityExists(id)) return false;

        entity = GetEntityById(id);
        return true;
    }

    public Entity GetEntityById(string id)
    {
        return entities[id];
    }


    public void AddComponentToEntity(Entity entity, Component component)
    {
        entity.AddComponent(component);
        UpdateEntityRegistration(entity);
    }

    public void RemoveComponentFromEntity<T>(Entity entity) where T : Component
    {
        entity.RemoveComponent<T>();
        UpdateEntityRegistration(entity);
    }

    private void UpdateEntityRegistration(Entity entity)
    {
        foreach (var system in systems.Values)
        {
            system.UpdateEntityRegistration(entity);
        }
    }

    public void AddSystem(GameSystem system)
    {
        systems[system.GetType()] = system;
        system.BindWorld(this);
    }

    public T GetSystem<T>() where T : GameSystem
    {
        return (T)systems[typeof(T)];
    }

    public void Update(float deltaTime)
    {
        foreach (var system in systems.Values)
        {
            system.UpdateAll(deltaTime);
        }
        Flush();
    }

    private void Flush()
    {
        foreach (var id in toDelete)
        {
            if (!EntityExists(id))
                continue;

            foreach (var system in systems.Values)
            {
                system.DeleteEntity(id);
            }

            entities.Remove(id);
        }
        toDelete.Clear();
    }
}