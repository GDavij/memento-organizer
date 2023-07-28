namespace MementoOrganizer.Domain.Models.Requests.Users;

public class LoginAdminRequest
{
    public string? Email { get; init; }
    public string? Passphrase { get; init; }
}