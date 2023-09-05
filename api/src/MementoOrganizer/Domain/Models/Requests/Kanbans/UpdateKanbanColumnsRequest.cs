using System;
using System.Collections.Generic;

namespace MementoOrganizer.Domain.Models.Requests.Kanbans;

public class UpdateKanbanColumnsRequest
{
    public List<AddKanbanColumnRequest>? Add { get; set; }
    public List<ReplaceKanbanColumnRequest>? Replace { get; set; }
    public List<string>? Delete { get; set; }
}

public class AddKanbanColumnRequest
{
    public string? Name { get; set; }
    public int Order { get; set; }
}

public class ReplaceKanbanColumnRequest
{
    public string? Id { get; set; }
    public string? ColumnToReplaceId { get; set; }
    
}
