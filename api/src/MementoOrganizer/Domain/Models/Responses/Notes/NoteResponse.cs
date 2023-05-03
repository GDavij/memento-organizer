using System;
namespace MementoOrganizer.Domain.Models.Responses.Notes;

public class NoteResponse
{
    public string Id { get; init; }
    public string Owner { get; init; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Content { get; set; }
    public string Issued { get; init; }
    public string LastUpdate { get; set; }

    public NoteResponse
    (
        string id,
        string owner,
        string name,
        string description,
        string content,
        DateTime issued,
        DateTime lastUpdate
    )
    {
        Id = id;
        Owner = owner;
        Name = name;
        Description = description;
        Content = content;
        Issued = issued.ToString();
        LastUpdate = lastUpdate.ToString();
    }
}
