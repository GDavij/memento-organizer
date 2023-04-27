using System.Threading.Tasks;
using MementoOrganizer.Domain.Models.Requests.Users;
namespace MementoOrganizer.Domain.Services.Interfaces;

public interface IUserService
{
    public Task CreateAdmin(CreateAdminRequest createAdminRequest);
    public Task CreateUser(CreateUserRequest createUserRequest);
    //TODO: Create a UpdateUser Method (Via Atomic Update) 
    public Task<bool> DeleteUser(string token); //? Maybe it can just return Task instead of Task<bool>
    public Task<string> LoginUser(LoginUserRequest loginUserRequest);
}
