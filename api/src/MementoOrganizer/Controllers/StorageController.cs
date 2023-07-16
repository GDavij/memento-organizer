using System.Threading.Tasks;
using MementoOrganizer.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MementoOrganizer.Controllers;
[ApiController]
[Route("[controller]")]
public class StorageController : ControllerBase
{
    private readonly IStorageService _storageService;

    public StorageController(IStorageService storageService)
    {
        _storageService = storageService;
    }


    [HttpPost]
    [Route("images/new")]
    public async Task<IActionResult> InsertImage([FromHeader] string authorization, IFormFile formDataFile)
    {
        var fileId = await _storageService.PutStorageObject(authorization, formDataFile);
        return Ok(new { fileId });
    }

    [HttpGet]
    [Route("images/find/{urlResourceAccess}")]
    public async Task<IActionResult> FindImage([FromHeader] string authorization, [FromRoute] string urlResourceAccess)
    {
        var b64Image = await _storageService.GetStorageObject(authorization, urlResourceAccess);
        return Ok(new { b64Image });

    }

    [HttpDelete]
    [Route("images/delete/{urlResourceAccess}")]
    public async Task<IActionResult> DeleteImage([FromHeader] string authorization, [FromRoute] string urlResourceAccess)
    {
        var hasBeenDeleted = await _storageService.DeleteStorageObject(authorization, urlResourceAccess);
        return Ok(hasBeenDeleted);
    }
}
