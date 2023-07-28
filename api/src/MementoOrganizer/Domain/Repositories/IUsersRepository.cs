using System.Collections.Generic;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;
namespace MementoOrganizer.Domain.Repositories;

public interface IUsersRepository<TId>
{
    public Task InsertUser(User<TId> user);
    public Task<bool> ReplaceUser(TId ownerId, User<TId> user);
    public Task<User<TId>?> FindUserById(TId id);
    public Task<User<TId>?> FindAdminByEmail(string id);
    public Task<User<TId>?> FindUserByEmail(string email);
    public Task<bool> ExistsAnyAdmin();
    public Task<List<User<TId>>> ListAllActiveAdmins();
    public Task<List<User<TId>>> ListAllActiveUsers();
    public Task<bool> DeleteUserById(TId id);
}
