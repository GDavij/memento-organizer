using MementoOrganizer.Domain.Models.Responses.Notes;
using MementoOrganizer.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using MementoOrganizer.Domain.Services.Interfaces;
using System.Threading.Tasks;

namespace MementoOrganizer.Domain.Extensions;

public static class NotesConvertionExtensions
{
    public static async Task<NoteResponse> ToNoteResponse<TId>(this Note<TId> note, User<TId> user, ISecurityService securityService)
    {

        Task<string> nameTask = securityService.DecriptData(note.Name.FromBase64String(), user.EncryptionKey, note.Issued.ToString());
        Task<string> descriptionTask = securityService.DecriptData(note.Description.FromBase64String(), user.EncryptionKey, note.Issued.ToString());
        Task<string> contentTask = securityService.DecriptData(note.Content.FromBase64String(), user.EncryptionKey, note.Issued.ToString());
        Task.WaitAll(new Task[] { nameTask, descriptionTask, contentTask });
        string name = await nameTask;
        string description = await descriptionTask;
        string content = await contentTask;

        return new NoteResponse(
            note.Id!.ToString()!,
            note.Owner!.ToString()!,
            name,
            description,
            content,
            note.Issued,
            note.LastUpdate
        );
    }

    public static async Task<List<NoteResponse>> ToListNoteResponse<TId>(this List<Note<TId>> notes, User<TId> user, ISecurityService securityService)
    {
        var noteResponsesTasks = notes.Select(note => note.ToNoteResponse(user, securityService));
        List<NoteResponse> noteResponses = new List<NoteResponse>();
        foreach (Task<NoteResponse> noteTask in noteResponsesTasks)
        {
            noteResponses.Add(await noteTask);
        }

        return noteResponses;
    }
}
