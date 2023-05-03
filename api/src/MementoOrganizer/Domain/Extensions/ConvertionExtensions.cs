using MementoOrganizer.Domain.Models.Responses.Notes;
using MementoOrganizer.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using MementoOrganizer.Domain.Services.Interfaces;
using System.Threading.Tasks;

namespace MementoOrganizer.Domain.Extensions;

public static class ConvertionExtensions
{
    public async static Task<NoteResponse> ToNoteResponse<TId>(this Note<TId> note, User<TId> user, ISecurityService securityService)
    {

        Task<string> nameTask = securityService.DechipherData(note.Name, user.Passphrase, note.Issued.ToString());
        Task<string> descriptionTask = securityService.DechipherData(note.Description, user.Passphrase, note.Issued.ToString());
        Task<string> contentTask = securityService.DechipherData(note.Content, user.Passphrase, note.Issued.ToString());
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
        foreach (Task<NoteResponse> note in noteResponsesTasks)
        {
            noteResponses.Add(await note);
        }
        //! It Works But Probaly it is not the best solution at really
        //TODO: Find a Better Way to Transform the Data in an async way
        return noteResponses;
    }
}
