using System;
namespace MementoOrganizer.Domain.Connections;

public interface IDatabaseConnection<TypeDatabase>
{
    public TypeDatabase Resolve();
}
