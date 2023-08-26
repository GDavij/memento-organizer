using System.Collections.Generic;
using MementoOrganizer.Domain.Entities;

namespace MementoOrganizer.Domain.Models.Requests.Kanban;

public class UpdateKanbanTasksRequest
{
    public List<KanbanTaskAddRequest>? Add { get; set; }
    public List<KanbanTaskReplaceRequest>? Replace { get; set; }
    public List<string>? Delete { get; set; }
}

public class KanbanTaskAddRequest
{
    public string? Name { get; set; }
    public string? Content { get; set; }
    public string? Column { get; set; }
}


public class KanbanTaskReplaceRequest
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Content { get; set; }
    public string? Column { get; set; }
}