namespace MementoOrganizer.Domain.Models.Requests.Users;

public class CreateAdminRequest
{
    public string? Email { get; init; }
    public string? Passphrase { get; init; }
    public string? AdminToken { get; init; }
}
