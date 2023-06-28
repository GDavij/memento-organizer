using System.Threading.Tasks;
using MementoOrganizer.Domain.Models.Requests.Users;
namespace MementoOrganizer.Domain.Services.Interfaces;

public interface IUserService
{
    public Task CreateAdmin(CreateAdminRequest createAdminRequest);
    public Task CreateUser(CreateUserRequest createUserRequest);
    public Task<bool> DeleteUser(string token);
    public Task<string> LoginUser(LoginUserRequest loginUserRequest);
    public Task<bool> UpdateUser(string token, UpdateUserRequest updateUserRequest);
}
