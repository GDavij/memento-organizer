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
    [Route("delete/{token}")]
    public async Task<IActionResult> DeleteUser([FromRoute()] string token)
    {
        bool hasBeenDeleted = await _userService.DeleteUser(token);
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
    [Route("update/{token}")]
    public async Task<IActionResult> UpdateUser([FromRoute()] string token, [FromBody()] UpdateUserRequest updateUserRequest)
    {
        string newToken = await _userService.UpdateUser(token, updateUserRequest);
        return Ok(new { token = newToken });
    }
}
