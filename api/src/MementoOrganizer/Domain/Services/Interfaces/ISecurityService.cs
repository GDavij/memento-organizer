using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Models.Data;
using MementoOrganizer.Domain.Providers;
using MementoOrganizer.Domain.Repositories;

namespace MementoOrganizer.Domain.Services.Interfaces;

public interface ISecurityService
{
    Task<User<TId>?> AuthenticateUser<TId>(Token<TId> token, IUsersRepository<TId> userRepository);
    Task<string> ChipherData(string data, string key, string iv);
    Task<string> DechipherData(string encriptedData, string key, string iv);
    string DerivePassphrase(string passphrase, string salt);
    string GenerateToken<TId>(TId id, string passphrase);
    Token<TId>? TryParseToken<TId>(string? token, IIdentityProvider<TId> identityProvider);

}
