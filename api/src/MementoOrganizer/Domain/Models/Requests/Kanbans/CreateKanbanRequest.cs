namespace MementoOrganizer.Domain.Models.Requests.Kanbans;

public class CreateKanbanRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
}