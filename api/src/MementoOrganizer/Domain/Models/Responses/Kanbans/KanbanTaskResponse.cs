using System;

namespace MementoOrganizer.Domain.Models.Responses.Kanbans;

public record KanbanTaskResponse
{
    public string Id { get; init; }
    public string Owner { get; init; }
    public string Name { get; init; }
    public string Content { get; init; }
    public string Column { get; init; }
    public string Issued { get; init; }
    public string LastUpdate { get; init; }

    public KanbanTaskResponse(
        string id,
        string owner,
        string name,
        string content,
        string column,
        DateTime issued,
        DateTime lastUpdate)
    {
        Id = id;
        Owner = owner;
        Name = name;
        Content = content;
        Column = column;
        Issued = issued.ToString("O");
        LastUpdate = lastUpdate.ToString("O");
    }
}