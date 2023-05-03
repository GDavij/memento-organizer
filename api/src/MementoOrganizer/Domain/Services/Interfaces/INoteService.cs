using System.Threading.Tasks;
using MementoOrganizer.Domain.Models.Requests.Notes;
using MementoOrganizer.Domain.Entities;
using System.Collections.Generic;
using System;
using MementoOrganizer.Domain.Models.Responses.Notes;

namespace MementoOrganizer.Domain.Services.Interfaces;
public interface INoteService
{
    Task CreateNote(string token, CreateNoteRequest createNoteRequest);
    Task<List<NoteResponse>> GetNotes(string token);
    Task<NoteResponse> GetNote(string token, string noteId);
    Task<bool> UpdateNote(string token, string noteId, UpdateNoteRequest updateNoteRequest);
    Task<bool> DeleteNote(string token, string noteId);
}
