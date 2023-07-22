using System.Collections.Generic;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Models.Requests.Users;
using MementoOrganizer.Domain.Models.Responses.Users;

namespace MementoOrganizer.Domain.Services.Interfaces;

public interface IUserService
{
    public Task CreateAdmin(CreateAdminRequest createAdminRequest);
    public Task CreateUser(CreateUserRequest createUserRequest);
    public Task<bool> DeleteUser(string token);
    public Task<UserResponse> FindUser(string token);
    public Task<bool> CheckIsAdmin(string token);
    public Task<List<UserResponse>> ListAllAdmins(string token);
    public Task<List<UserResponse>> ListAllUsers(string token);
    public Task<bool> DeleteTargetUser(string token, string id);
    public Task<bool> UpdateTargetUser(string token, string id, UpdateTargetUserRequest updateTargetUserRequest);
    public Task<string> LoginUser(LoginUserRequest loginUserRequest);
    public Task<string> UpdateUser(string token, UpdateUserRequest updateUserRequest);
}