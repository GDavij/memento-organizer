using Microsoft.AspNetCore.Mvc;
using MementoOrganizer.Domain.Models.Requests.Users;
using MementoOrganizer.Domain.Services.Interfaces;
using MementoOrganizer.Domain.Services;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Models.Responses.Users;

namespace MementoOrganizer.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    [Route("new/admin")]
    public async Task<IActionResult> CreateNewAdmin([FromBody()] CreateAdminRequest createAdminRequest)
    {
        await _userService.CreateAdmin(createAdminRequest);
        return Ok();
    }

    [HttpPost]
    [Route("new")]
    public async Task<IActionResult> CreateNewUser([FromBody()] CreateUserRequest createUserRequest)
    {
        await _userService.CreateUser(createUserRequest);
        return Ok();
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> LoginUser([FromBody()] LoginUserRequest loginUserRequest)
    {
        string token = await _userService.LoginUser(loginUserRequest);
        return Ok(new { token });
    }

    [HttpDelete]
    [Route("delete")]
    public async Task<IActionResult> DeleteUser([FromHeader] string authorization)
    {
        bool hasBeenDeleted = await _userService.DeleteUser(authorization);
        return Ok(hasBeenDeleted);
    }

    [HttpGet]
    [Route("find")]
    public async Task<IActionResult> FindUser([FromHeader] string authorization)
    {
        UserResponse userResponse = await _userService.FindUser(authorization);
        return Ok(userResponse);
    }

    [HttpGet]
    [Route("isAdmin")]
    public async Task<IActionResult> CheckIsAdmin([FromHeader] string authorization)
    {
        bool isAdmin = await _userService.CheckIsAdmin(authorization);
        return Ok(isAdmin);
    }

    [HttpPut]
    [Route("update")]
    public async Task<IActionResult> UpdateUser([FromHeader] string authorization, [FromBody()] UpdateUserRequest updateUserRequest)
    {
        string newToken = await _userService.UpdateUser(authorization, updateUserRequest);
        return Ok(new { token = newToken });
    }

    [HttpGet]
    [Route("list")]
    public async Task<IActionResult> ListUsers([FromHeader] string authorization)
    {
        var users = await _userService.ListAllUsers(authorization);
        return Ok(users);
    }

    [HttpGet]
    [Route("list/admins")]
    public async Task<IActionResult> ListAdmins([FromHeader] string authorization)
    {
        var admins = await _userService.ListAllAdmins(authorization);
        return Ok(admins);
    }

    [HttpPut]
    [Route("update/{id}")]
    public async Task<IActionResult> UpdateTargetUser([FromHeader] string authorization, [FromRoute()] string id, [FromBody()] UpdateTargetUserRequest updateTargetUserRequest)
    {
        bool hasBeenUpdated = await _userService.UpdateTargetUser(authorization, id, updateTargetUserRequest);
        return Ok(hasBeenUpdated);
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult> DeleteTargetUser([FromHeader] string authorization, [FromRoute] string id)
    {
        bool hasBeenDeleted = await _userService.DeleteTargetUser(authorization, id);
        return Ok(hasBeenDeleted);
    }
}
