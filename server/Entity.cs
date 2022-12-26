
using Reign.Server.Components;

namespace Reign.Server;

public class Entity 
{
    public string Id { get; }
    private Dictionary<Type, Component> components;

    public Entity(string id)
    {
        Id = id;
        components = new Dictionary<Type, Component>();
    }

    public void AddComponent(Component component)
    {
        components[component.GetType()] = component;
    }

    public void RemoveComponent<T>() where T : Component
    {
        components.Remove(typeof(T));
    }

    public T GetComponent<T>() where T : Component
    {
        return (T)components[typeof(T)];
    }
 
    public bool HasComponent(Type type)
    {
        return components.ContainsKey(type);
    }

    public bool HasComponent<T>() where T : Component
    {
        return components.ContainsKey(typeof(T));
    }
}