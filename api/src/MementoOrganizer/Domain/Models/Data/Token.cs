namespace MementoOrganizer.Domain.Models.Data;

public class Token<TId>
{
    public TId Id { get; init; }
    public string Passphrase { get; init; }

    public Token(TId id, string passphrase)
    {
        Id = id;
        Passphrase = passphrase;
    }
}
