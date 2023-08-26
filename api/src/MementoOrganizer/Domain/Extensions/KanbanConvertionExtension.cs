using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Models.Responses.Kanbans;
using MementoOrganizer.Domain.Services.Interfaces;

namespace MementoOrganizer.Domain.Extensions;

public static class KanbanConvertionExtension
{
    public static async Task<KanbanResponse> ToKanbanResponse<TId>(
        this Kanban<TId> kanban,
        User<TId> authenticatedUser,
        ISecurityService securityService)
    {
        var nameTask = securityService.DecriptData(
            kanban.Name.FromBase64String(),
            authenticatedUser.EncryptionKey,
            authenticatedUser.Issued.ToString("O"));

        var descriptionTask = securityService.DecriptData(
            kanban.Description.FromBase64String(),
            authenticatedUser.EncryptionKey,
            authenticatedUser.Issued.ToString("O"));

        var kanbanColumns = new List<KanbanColumnResponse>();
        foreach (var column in kanban.Columns)
        {
            var columnName = await securityService.DecriptData(
                column.Name.FromBase64String(),
                authenticatedUser.EncryptionKey,
                authenticatedUser.Issued.ToString("O"));

            kanbanColumns.Add(
                new KanbanColumnResponse(
                    column.Id!.ToString()!,
                    column.Owner!.ToString()!,
                    columnName,
                    column.Order,
                    column.Issued,
                    column.LastUpdate)
                );
        }

        Task.WaitAll(nameTask, descriptionTask);
        var name = await nameTask;
        var description = await descriptionTask;

        return new KanbanResponse(
            kanban.Id!.ToString()!,
            kanban.Owner!.ToString()!,
            name,
            description,
            kanbanColumns,
            kanban.Issued,
            kanban.LastUpdate
        );
    }

    public static async Task<List<KanbanResponse>> ToListKanbanResponse<TId>(
        this List<Kanban<TId>> kanbans,
        User<TId> authenticatedUser,
        ISecurityService securityService)
    {
        var kanbanResponsesTasks = kanbans.Select(kanban => kanban
                .ToKanbanResponse(authenticatedUser, securityService));

        List<KanbanResponse> kanbanResponses = new List<KanbanResponse>();
        foreach (var kanbanTask in kanbanResponsesTasks)
        {
            kanbanResponses.Add(await kanbanTask);
        }

        return kanbanResponses;
    }
}