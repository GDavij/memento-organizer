namespace MementoOrganizer.Domain.Providers;

public interface IIdentityProvider<TIdentity>
{
    public TIdentity GenerateNewId();
    public TIdentity ParseIdFromString(string id);
}
