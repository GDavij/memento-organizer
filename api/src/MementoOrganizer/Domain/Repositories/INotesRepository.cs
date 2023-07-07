using System.Collections.Generic;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;
namespace MementoOrganizer.Domain.Repositories;

public interface INotesRepository<TId>
{
    Task InsertNote(Note<TId> note);
    Task<List<Note<TId>>> FindAllNotesByOwner(TId ownerId);
    Task<Note<TId>> FindNoteById(TId id, TId ownerId);
    Task<bool> ReplaceNoteById(TId id, TId ownerId, Note<TId> note);
    Task<bool> DeleteNoteById(TId id, TId ownerId);
    Task<bool> DeleteNotesByOwner(TId ownerId);
}
