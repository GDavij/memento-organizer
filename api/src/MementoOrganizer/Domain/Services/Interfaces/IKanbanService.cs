using System.Threading.Tasks;
using MementoOrganizer.Domain.Models.Responses.Kanbans;
using System.Collections.Generic;
using MementoOrganizer.Domain.Models.Requests.Kanban;

namespace MementoOrganizer.Domain.Services.Interfaces;

public interface IKanbanService
{
    Task<string> CreateKanban(string token, CreateKanbanRequest createKanbanRequest);
    Task<bool> DeleteKanban(string token, string kanbanId);
    Task<KanbanResponse> GetKanban(string token, string kanbanId);
    Task<List<KanbanResponse>> GetKanbans(string token);
    Task<KanbanTaskResponse> GetKanbanTask(string token, string kanbanTaskId);
    Task<List<KanbanTaskResponse>> GetKanbanTasks(string token, string kanbanId);
    Task<bool> UpdateKanban(string token, string kanbanId, UpdateKanbanRequest updateKanbanRequest);
    Task<bool> UpdateKanbanColumns(string token, string kanbanId, UpdateKanbanColumnsRequest updateKanbanColumnsRequest);
    Task<bool> UpdateKanbanTasks(string token, string kanbanId, UpdateKanbanTasksRequest updateKanbanTasksRequest);
}