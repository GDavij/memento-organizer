using System;
using System.Collections.Generic;
using MementoOrganizer.Domain.Providers;

namespace MementoOrganizer.Domain.Entities;

public class Kanban<TId>
{
    public TId Id { get; init; }
    public TId Owner { get; init; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<KanbanColumn<TId>> Columns { get; set; }
    public List<KanbanTask<TId>> Tasks { get; set; }
    public DateTime Issued { get; init; }
    public DateTime LastUpdate { get; set; }

    public Kanban(
        IIdentityProvider<TId> identityProvider,
        TId owner,
        string name,
        string description,
        List<KanbanColumn<TId>> columns,
        DateTime issued)
    {
        Id = identityProvider.GenerateNewId();
        Owner = owner;
        Name = name;
        Description = description;
        Columns = columns;
        Tasks = new List<KanbanTask<TId>>();
        Issued = issued;
        LastUpdate = issued;
    }
}

public class KanbanColumn<TId>
{
    public TId Id { get; init; }
    public TId Owner { get; init; }
    public string Name { get; init; }
    public int Order { get; set; }
    public DateTime Issued { get; init; }
    public DateTime LastUpdate { get; set; }

    public KanbanColumn(
        IIdentityProvider<TId> identityProvider,
        TId owner,
        string name,
        int order,
        DateTime issued)
    {
        Id = identityProvider.GenerateNewId();
        Owner = owner;
        Name = name;
        Order = order;
        Issued = issued;
        LastUpdate = LastUpdate;
    }
}
public class KanbanTask<TId>
{
    public TId Id { get; init; }
    public TId Owner { get; init; }
    public string Name { get; set; }
    public string Content { get; set; }
    public TId Column { get; set; }
    public DateTime Issued { get; init; }
    public DateTime LastUpdate { get; set; }

    public KanbanTask(
        IIdentityProvider<TId> identityProvider,
        TId owner,
        string name,
        string content,
        TId column,
        DateTime issued)
    {
        Id = identityProvider.GenerateNewId();
        Owner = owner;
        Name = name;
        Content = content;
        Column = column;
        Issued = issued;
        LastUpdate = issued;
    }
}