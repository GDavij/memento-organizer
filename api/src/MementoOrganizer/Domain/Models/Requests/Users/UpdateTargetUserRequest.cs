namespace MementoOrganizer.Domain.Models.Requests.Users;
public class UpdateTargetUserRequest
{
    public string? Email { get; init; }
    public string? Passphrase { get; init; }
}
