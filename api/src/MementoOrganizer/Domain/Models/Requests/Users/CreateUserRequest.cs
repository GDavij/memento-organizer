namespace MementoOrganizer.Domain.Models.Requests.Users;

public class CreateUserRequest
{
    public string? Email { get; init; }
    public string? Passphrase { get; init; }
}
