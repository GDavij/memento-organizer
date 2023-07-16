using System.Threading.Tasks;

namespace MementoOrganizer.Domain.Connections;
public interface IStorageConnection<ClientType>
{
    public Task<ClientType> ResolveConnectionAsync();
    public string GetStorageName();
}
