namespace MementoOrganizer.Domain.Models.Requests.Users;

public class LoginUserRequest
{
    public string? Email { get; init; }
    public string? Passphrase { get; init; }
}
