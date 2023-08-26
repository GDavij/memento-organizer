using System;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Models.Requests.Kanban;
using MementoOrganizer.Domain.Services;
using MementoOrganizer.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace MementoOrganizer.Controllers;

[ApiController]
[Route("[controller]")]
public class KanbansController : ControllerBase
{
    private readonly IKanbanService _kanbanService;

    public KanbansController(IKanbanService kanbanService)
    {
        _kanbanService = kanbanService;
    }

    [HttpPost]
    [Route("new")]
    public async Task<IActionResult> CreateKanban([FromHeader()] string authorization, [FromBody()] CreateKanbanRequest createKanbanRequest)
    {
        var kanbanId = await _kanbanService.CreateKanban(authorization, createKanbanRequest);
        return Ok(new { id = kanbanId });
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult> DeleteKanban([FromHeader()] string authorization, [FromRoute()] string id)
    {
        var hasBeenDeleted = await _kanbanService.DeleteKanban(authorization, id);
        return Ok(hasBeenDeleted);
    }

    [HttpGet]
    [Route("find/{id}")]
    public async Task<IActionResult> FindKanbanById([FromHeader()] string authorization, [FromRoute()] string id)
    {
        var kanbanResponse = await _kanbanService.GetKanban(authorization, id);
        return Ok(kanbanResponse);
    }

    [HttpGet]
    [Route("find")]
    public async Task<IActionResult> FindKanbansByOwner([FromHeader()] string authorization)
    {
        var kanbanResponses = await _kanbanService.GetKanbans(authorization);
        return Ok(kanbanResponses);
    }

    [HttpGet]
    [Route("find/tasks/{id}")]
    public async Task<IActionResult> FindKanbanTaskById([FromHeader()] string authorization, [FromRoute()] string id)
    {
        var kanbanTask = await _kanbanService.GetKanbanTask(authorization, id);
        return Ok(kanbanTask);
    }

    [HttpGet]
    [Route("find/{id}/tasks")]
    public async Task<IActionResult> FindKanbanTasks([FromHeader()] string authorization, [FromRoute()] string id)
    {
        var kanbanTasks = await _kanbanService.GetKanbanTasks(authorization, id);
        return Ok(kanbanTasks);
    }

    [HttpPut]
    [Route("update/{id}")]
    public async Task<IActionResult> UpdateKanban([FromHeader()] string authorization, [FromRoute()] string id, [FromBody] UpdateKanbanRequest updateKanbanRequest)
    {
        var hasBeenUpdated = await _kanbanService.UpdateKanban(authorization, id, updateKanbanRequest);
        return Ok(hasBeenUpdated);
    }

    [HttpPut]
    [Route("update/{id}/columns")]
    public async Task<IActionResult> UpdateKanbanColumns([FromHeader()] string authorization, [FromRoute()] string id, [FromBody] UpdateKanbanColumnsRequest updateKanbanColumnsRequest)
    {
        var hasBeenUpdated = await _kanbanService.UpdateKanbanColumns(authorization, id, updateKanbanColumnsRequest);
        return Ok(hasBeenUpdated);
    }

    [HttpPut]
    [Route("update/{id}/tasks")]
    public async Task<IActionResult> UpdateKanbanTasks([FromHeader()] string authorization, [FromRoute()] string id, [FromBody] UpdateKanbanTasksRequest updateKanbanTasksRequest)
    {
        var hasBeenUpdated = await _kanbanService.UpdateKanbanTasks(authorization, id, updateKanbanTasksRequest);
        return Ok(hasBeenUpdated);
    }
}