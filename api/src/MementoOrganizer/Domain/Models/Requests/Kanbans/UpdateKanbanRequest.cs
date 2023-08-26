using System.Collections.Generic;
using MementoOrganizer.Domain.Entities;

namespace MementoOrganizer.Domain.Models.Requests.Kanban;

public class UpdateKanbanRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
}