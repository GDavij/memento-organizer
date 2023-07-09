using System.Collections.Generic;
using System.Threading.Tasks;

namespace MementoOrganizer.Domain.Repositories;
public interface IStorageRepository<ObjectResponse>
{
    public Task<bool> PutObject(byte[] blobData, string blobName);
    public Task<ObjectResponse> GetObject(string acessResourceUrl);
    public Task<bool> DeleteObject(string acessResourceUrl);
}
