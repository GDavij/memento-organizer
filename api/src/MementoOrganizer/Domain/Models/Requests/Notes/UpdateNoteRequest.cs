namespace MementoOrganizer.Domain.Models.Requests.Notes;

public class UpdateNoteRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Content { get; set; }
}
