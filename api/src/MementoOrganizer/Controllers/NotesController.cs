using Microsoft.AspNetCore.Mvc;
using MementoOrganizer.Domain.Services.Interfaces;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Models.Requests.Notes;
using System.Collections.Generic;
using MementoOrganizer.Domain.Models.Responses.Notes;
namespace MementoOrganizer.Controllers;


[ApiController]
[Route("[controller]")]
public class NotesController : ControllerBase
{
    private readonly INoteService _noteService;
    public NotesController(INoteService noteService)
    {
        _noteService = noteService;
    }

    [HttpPost]
    [Route("new")]
    public async Task<IActionResult> CreateNewNote([FromHeader()] string authorization, [FromBody()] CreateNoteRequest createNoteRequest)
    {
        string noteId = await _noteService.CreateNote(authorization, createNoteRequest);
        return Ok(new { id = noteId });
    }

    [HttpGet]
    [Route("find")]
    public async Task<IActionResult> FindNotesByOwner([FromHeader()] string authorization)
    {
        var notes = await _noteService.GetNotes(authorization);
        return Ok(notes);
    }

    [HttpGet]
    [Route("find/{id}")]
    public async Task<IActionResult> FindNoteById([FromHeader()] string authorization, [FromRoute()] string id)
    {
        var note = await _noteService.GetNote(authorization, id);
        return Ok(note);
    }

    [HttpPut]
    [Route("update/{id}")]
    public async Task<IActionResult> UpdateNote([FromHeader()] string authorization, [FromRoute()] string id, [FromBody()] UpdateNoteRequest updateNoteRequest)
    {
        bool hasBeenUpdated = await _noteService.UpdateNote(authorization, id, updateNoteRequest);
        return Ok(hasBeenUpdated);
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult> DeleteNote([FromHeader()] string authorization, [FromRoute()] string id)
    {
        bool hasBeenDeleted = await _noteService.DeleteNote(authorization, id);
        return Ok(hasBeenDeleted);
    }
}
