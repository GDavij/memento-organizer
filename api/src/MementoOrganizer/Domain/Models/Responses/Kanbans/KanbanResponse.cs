using System;
using System.Collections.Generic;

namespace MementoOrganizer.Domain.Models.Responses.Kanbans;

public record KanbanResponse
{
    public string Id { get; init; }
    public string Owner { get; init; }
    public string Name { get; init; }
    public string Description { get; init; }
    public List<KanbanColumnResponse> Columns { get; init; }
    public string Issued { get; init; }
    public string LastUpdate { get; set; }

    public KanbanResponse(
        string id,
        string owner,
        string name,
        string description,
        List<KanbanColumnResponse> columns,
        DateTime issued,
        DateTime lastUpdate)
    {
        Id = id;
        Owner = owner;
        Name = name;
        Description = description;
        Columns = columns;
        Issued = issued.ToString("O");
        LastUpdate = lastUpdate.ToString("O");
    }
}

public record KanbanColumnResponse
{
   public string Id { get; init; }
   public string Owner { get; init; }
   public string Name { get; init; }
   public int Order { get; init; }
   public string Issued { get; init; }
   public string LastUpdate { get; init; }

   public KanbanColumnResponse(
       string id,
       string owner,
       string name,
       int order,
       DateTime issued,
       DateTime lastUpdate)
   {
       Id = id;
       Owner = owner;
       Name = name;
       Order = order;
       Issued = issued.ToString("O");
       LastUpdate = lastUpdate.ToString("O");
   }
}