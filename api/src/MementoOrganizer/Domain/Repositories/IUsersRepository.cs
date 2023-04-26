using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;
namespace MementoOrganizer.Domain.Repositories;

public interface IUsersRepository<TId>
{
    public Task<bool> InsertUser(User<TId> user);
    public Task<User<TId>> FindUserById(TId id);
    public Task<User<TId>> FindUserByEmail(string email);
    public Task<bool> ExistsAnyAdmin();
    public Task<bool> DeleteUserById(TId id);
}
