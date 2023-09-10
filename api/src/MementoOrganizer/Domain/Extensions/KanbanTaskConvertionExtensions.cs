using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Models.Responses.Kanbans;
using MementoOrganizer.Domain.Services.Interfaces;

namespace MementoOrganizer.Domain.Extensions;

public static class KanbanTaskConvertionExtensions
{
    public static async Task<KanbanTaskResponse> ToKanbanTaskResponse<TId>(
        this KanbanTask<TId> kanbanTask,
        User<TId> authenticatedUser,
        ISecurityService securityService)
    {
        var nameTask = securityService.DecriptData(
            kanbanTask.Name.FromBase64String(),
            authenticatedUser.EncryptionKey,
            authenticatedUser.Issued.ToString("O"));

        var contentTask = securityService.DecriptData(
            kanbanTask.Content.FromBase64String(),
            authenticatedUser.EncryptionKey,
            authenticatedUser.Issued.ToString("O"));

        Task.WaitAll(nameTask, contentTask);
        var name = await nameTask;
        var content = await contentTask;

        return new KanbanTaskResponse(
            kanbanTask.Id!.ToString()!,
            kanbanTask.Owner!.ToString()!,
            name,
            content,
            kanbanTask.Column!.ToString()!,
            kanbanTask.Issued,
            kanbanTask.LastUpdate);
    }

    //TODO: Refactore This Method for Better Performance and Readability
    public static async Task<List<KanbanTaskResponse>> ToListKanbanTaskResponse<TId>(
        this List<KanbanTask<TId>> kanbanTasks,
        User<TId> authenticatedUser,
        ISecurityService securityService)
    {
        var kanbanTaskResponsesTasks = kanbanTasks.Select(kanbanTask => kanbanTask
                .ToKanbanTaskResponse(authenticatedUser, securityService));

        List<KanbanTaskResponse> kanbanTaskResponses = new List<KanbanTaskResponse>();
        foreach (var kanbanTask in kanbanTaskResponsesTasks)
        {
            kanbanTaskResponses.Add(await kanbanTask);
        }

        return kanbanTaskResponses;
    }
}