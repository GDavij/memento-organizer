using System;
using MementoOrganizer.Domain.Providers;
namespace MementoOrganizer.Domain.Entities;

public class Note<TId>
{
    public TId Id { get; init; }
    public TId Owner { get; init; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Content { get; set; }
    public DateTime Issued { get; init; }
    public DateTime LastUpdate { get; set; }

    public Note(
        IIdentityProvider<TId> identityProvider,
        TId owner,
        string name,
        string description,
        string content,
        DateTime issued)
    {
        Id = identityProvider.GenerateNewId();
        Owner = owner;
        Name = name;
        Description = description;
        Content = content;
        Issued = issued;
        LastUpdate = issued;
    }
}
