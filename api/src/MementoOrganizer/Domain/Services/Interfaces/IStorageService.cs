using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MementoOrganizer.Domain.Services.Interfaces;
public interface IStorageService
{
    //TODO: Think about Security Issues when Mapping User Files
    Task<string> PutStorageObject(string token, IFormFile formFile);
    Task<string> GetStorageObject(string token, string objectName);
    Task<bool> DeleteStorageObject(string token, string objectName);
}
