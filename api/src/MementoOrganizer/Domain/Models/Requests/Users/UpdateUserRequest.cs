namespace MementoOrganizer.Domain.Models.Requests.Users;
public class UpdateUserRequest
{
    public string? Email { get; init; }
    public string? Passphrase { get; init; }
}
