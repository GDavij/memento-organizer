using System;
namespace MementoOrganizer.Domain.Connections;

// Implement IDisposable to Tests LifeTime of connection till First Homologation Phase
public interface IDatabaseConnection<TypeDatabase>
{
    public TypeDatabase Resolve();
}
