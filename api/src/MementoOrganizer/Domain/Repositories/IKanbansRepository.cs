using System.Collections.Generic;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;

namespace MementoOrganizer.Domain.Repositories;

public interface IKanbansRepository<TId>
{
    Task InsertKanban(Kanban<TId> kanban);
    Task<Kanban<TId>?> FindKanbanById(TId id, TId ownerId);
    Task<List<Kanban<TId>>> FindKanbansByOwner(TId ownerId);
    Task<List<KanbanTask<TId>>?> FindKanbanTasksByKanbanId(TId id, TId ownerId);
    Task<KanbanTask<TId>?> FindKanbanTaskById(TId id, TId ownerId);
    Task<bool> ReplaceKanbanById(TId id, TId ownerId, Kanban<TId> kanban);
    //? Maybe Create a Method for Adding and Removing Tasks instead of Full Overwrite but still keeping Tasks show Order
    Task<bool> ReplaceKanbanTasksById(TId id, TId ownerId, List<KanbanTask<TId>> tasks);
    Task<bool> DeleteKanbanById(TId id, TId ownerId);
    Task<bool> DeleteKanbansByOwner(TId ownerId);
}