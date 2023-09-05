using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Extensions;
using MementoOrganizer.Domain.Models.Requests.Kanbans;
using MementoOrganizer.Domain.Models.Responses.Kanbans;
using MementoOrganizer.Domain.Providers;
using MementoOrganizer.Domain.Repositories;
using MementoOrganizer.Domain.Services.Interfaces;
using MongoDB.Bson;

namespace MementoOrganizer.Domain.Services;

public class KanbanService : IKanbanService
{
    private readonly ISecurityService _securityService;
    private readonly IKanbansRepository<ObjectId> _mongoKanbansRepository;
    private readonly IUsersRepository<ObjectId> _mongoUsersRepository;
    private readonly IIdentityProvider<ObjectId> _mongoIdentityProvider;

    public KanbanService(
        ISecurityService securityService,
        IKanbansRepository<ObjectId> mongoKanbansRepository,
        IUsersRepository<ObjectId> mongoUsersRepository,
        IIdentityProvider<ObjectId> mongoIdentityProvider)
    {
        _securityService = securityService;
        _mongoKanbansRepository = mongoKanbansRepository;
        _mongoUsersRepository = mongoUsersRepository;
        _mongoIdentityProvider = mongoIdentityProvider;
    }

    public async Task<string> CreateKanban(string token, CreateKanbanRequest createKanbanRequest)
    {
        var parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
            throw new Exception("Token Invalid");

        var authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
            throw new Exception("Token Invalid");

        var encryptedName = (await _securityService.EncriptData(
            createKanbanRequest.Name!,
            authenticatedUser.EncryptionKey,
            authenticatedUser.Issued.ToString("O")
            )).ToBase64String();

        var description = createKanbanRequest.Description ?? "";
        var encryptedDescription = (await _securityService.EncriptData(
            description,
            authenticatedUser.EncryptionKey,
            authenticatedUser.Issued.ToString("O")
            )).ToBase64String();

        var columns = new List<KanbanColumn<ObjectId>>();
        var issued = DateTime.UtcNow;

        Kanban<ObjectId> kanban = new(
            _mongoIdentityProvider,
            authenticatedUser.Id,
            encryptedName,
            encryptedDescription,
            columns,
            issued);

        await _mongoKanbansRepository.InsertKanban(kanban);
        return kanban.Id.ToString();
    }

    public async Task<bool> DeleteKanban(string token, string kanbanId)
    {
        var parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
            throw new Exception("Token invalid");

        var authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
            throw new Exception("Token invalid");

        ObjectId id = _mongoIdentityProvider.ParseIdFromString(kanbanId);
        Kanban<ObjectId>? kanbanToDelete = await _mongoKanbansRepository.FindKanbanById(id, authenticatedUser.Id);
        if (kanbanToDelete == null)
            throw new Exception("Could not find kanban to delete");

        bool hasBeenDeleted = await _mongoKanbansRepository.DeleteKanbanById(id, authenticatedUser.Id);
        return hasBeenDeleted;
    }


    public async Task<KanbanResponse> GetKanban(string token, string kanbanId)
    {
        var parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
            throw new Exception("Token invalid");

        var authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
            throw new Exception("Token invalid");

        ObjectId id = _mongoIdentityProvider.ParseIdFromString(kanbanId);
        var kanban = await _mongoKanbansRepository.FindKanbanById(id, authenticatedUser.Id);
        if (kanban == null)
            throw new Exception("Could not find kanban");

        return await kanban.ToKanbanResponse(authenticatedUser, _securityService);
    }

    public async Task<List<KanbanResponse>> GetKanbans(string token)
    {
        var parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
            throw new Exception("Token invalid");

        var authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
            throw new Exception("Token invalid");

        var kanbans = await _mongoKanbansRepository.FindKanbansByOwner(authenticatedUser.Id);
        return await kanbans.ToListKanbanResponse(authenticatedUser, _securityService);
    }

    public async Task<KanbanTaskResponse> GetKanbanTask(string token, string kanbanTaskId)
    {
        var parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
            throw new Exception("Token invalid");

        var authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
            throw new Exception("Token invalid");

        ObjectId id = _mongoIdentityProvider.ParseIdFromString(kanbanTaskId);
        var kanbanTask = await _mongoKanbansRepository.FindKanbanTaskById(id, authenticatedUser.Id);
        if (kanbanTask == null)
            throw new Exception("Could not found kanban task");

        return await kanbanTask.ToKanbanTaskResponse(authenticatedUser, _securityService);
    }

    public async Task<List<KanbanTaskResponse>> GetKanbanTasks(string token, string kanbanId)
    {
        var parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
            throw new Exception("Token invalid");

        var authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
            throw new Exception("Token invalid");

        ObjectId id = _mongoIdentityProvider.ParseIdFromString(kanbanId);
        var tasks = await _mongoKanbansRepository.FindKanbanTasksByKanbanId(id, authenticatedUser.Id);
        if (tasks == null)
            throw new Exception("Could not find kanban");

        return await tasks.ToListKanbanTaskResponse(authenticatedUser, _securityService);
    }

    public async Task<bool> UpdateKanban(
        string token,
        string kanbanId,
        UpdateKanbanRequest updateKanbanRequest)
    {
        var parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
            throw new Exception("Token invalid");

        var authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
            throw new Exception("Token invalid");

        ObjectId id = _mongoIdentityProvider.ParseIdFromString(kanbanId);
        var kanban = await _mongoKanbansRepository.FindKanbanById(id, authenticatedUser.Id);
        if (kanban == null)
            throw new Exception("Could Not Find Kanban");

        if (updateKanbanRequest.Name != null)
        {
            kanban.Name = (await _securityService.EncriptData(
                updateKanbanRequest.Name,
                authenticatedUser.EncryptionKey,
                authenticatedUser.Issued.ToString("O")
            )).ToBase64String();
        }

        if (updateKanbanRequest.Description != null)
        {
            kanban.Description = (await _securityService.EncriptData(
                updateKanbanRequest.Description,
                authenticatedUser.EncryptionKey,
                authenticatedUser.Issued.ToString("O")
            )).ToBase64String();
        }

        bool hasBeenUpdated = await _mongoKanbansRepository.ReplaceKanbanById(kanban.Id, authenticatedUser.Id, kanban);
        return hasBeenUpdated;
    }

    //TODO: Refactor this method
    public async Task<bool> UpdateKanbanColumns(
        string token,
        string kanbanId,
        UpdateKanbanColumnsRequest updateKanbanColumnsRequest)
    {
        var parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
            throw new Exception("Token invalid");

        var authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
            throw new Exception("Token invalid");

        var id = _mongoIdentityProvider.ParseIdFromString(kanbanId);
        var kanban = await _mongoKanbansRepository.FindKanbanById(id, authenticatedUser.Id);
        if (kanban == null)
            throw new Exception("Could not find kanban");

        foreach (var columnToDelete in updateKanbanColumnsRequest.Delete!)
        {
            var existsAt = kanban.Columns.FindIndex(column => column.Id == _mongoIdentityProvider.ParseIdFromString(columnToDelete));
            if (existsAt != -1)
            {
                kanban.Columns.RemoveAt(existsAt);
            }
            else
            {
                throw new Exception($"Column with Id {columnToDelete} do not Exists");
            }
        }

        foreach (var columnToReplace in updateKanbanColumnsRequest.Replace!)
        {
            var existsColumnAt = kanban.Columns.FindIndex(column => column.Id == _mongoIdentityProvider.ParseIdFromString(columnToReplace.Id!));
            var existsColumnToReplaceAt = kanban.Columns.FindIndex(column => column.Id == _mongoIdentityProvider.ParseIdFromString(columnToReplace.ColumnToReplaceId!));
            if (existsColumnAt != -1 && existsColumnToReplaceAt != -1)
            {
                var columnToTruncateOrder = kanban.Columns[existsColumnToReplaceAt].Order;
                kanban.Columns[existsColumnToReplaceAt].Order = kanban.Columns[existsColumnAt].Order;
                kanban.Columns[existsColumnAt].Order = columnToTruncateOrder;
            }
            else
            {
                throw new Exception($"Column with id {columnToReplace.Id} or column to do the replacement with id {columnToReplace.ColumnToReplaceId} do not exists");
            }
        }

        foreach (var columnsToAdd in updateKanbanColumnsRequest.Add!)
        {
            var existsAt = kanban.Columns.FindIndex(column => column.Order == columnsToAdd.Order);
            if (existsAt == -1)
            {
                string encryptedName = (await _securityService.EncriptData(
                    columnsToAdd.Name!,
                    authenticatedUser.EncryptionKey,
                    authenticatedUser.Issued.ToString("O")
                    )).ToBase64String();


                var issued = DateTime.UtcNow;

                kanban.Columns.Add(new KanbanColumn<ObjectId>(
                    _mongoIdentityProvider,
                    authenticatedUser.Id,
                    encryptedName,
                    columnsToAdd.Order,
                    issued
                    ));
            }
            else
            {
                throw new Exception($"Already exists a column with order equal {columnsToAdd.Order}");
            }
        }

        var hasBeenUpdated = await _mongoKanbansRepository.ReplaceKanbanById(kanban.Id, authenticatedUser.Id, kanban);
        return hasBeenUpdated;
    }

    public async Task<bool> UpdateKanbanTasks(
        string token,
        string kanbanId,
        UpdateKanbanTasksRequest updateKanbanTasksRequest)
    {
        var parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
            throw new Exception("Token invalid");

        var authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
            throw new Exception("Token invalid");

        var id = _mongoIdentityProvider.ParseIdFromString(kanbanId);
        var kanban = await _mongoKanbansRepository.FindKanbanById(id, authenticatedUser.Id);
        if (kanban == null)
            throw new Exception("Could not find kanban");

        foreach (var taskToReplace in updateKanbanTasksRequest.Replace!)
        {
            var existsIndex = kanban.Tasks.FindIndex(task => task.Id == _mongoIdentityProvider.ParseIdFromString(taskToReplace.Id!));
            if (existsIndex != -1)
            {
                if (taskToReplace.Column != null)
                {
                    var taskToReplaceColumnId = _mongoIdentityProvider.ParseIdFromString(taskToReplace.Column);
                    if (!kanban.Columns.Exists(column => column.Id == taskToReplaceColumnId))
                        throw new Exception($"Column {taskToReplace.Column} does not exists on kanban");

                    kanban.Tasks[existsIndex].Column = taskToReplaceColumnId;
                }


                if (taskToReplace.Name != null)
                {
                    var encryptedName = (await _securityService.EncriptData(
                        taskToReplace.Name,
                        authenticatedUser.EncryptionKey,
                        authenticatedUser.Issued.ToString("O")
                    )).ToBase64String();

                    kanban.Tasks[existsIndex].Name = encryptedName;
                }

                if (taskToReplace.Content != null)
                {
                    var encryptedContent = (await _securityService.EncriptData(
                        taskToReplace.Content,
                        authenticatedUser.EncryptionKey,
                        authenticatedUser.Issued.ToString("O")
                    )).ToBase64String();

                    kanban.Tasks[existsIndex].Content = encryptedContent;
                }

            }
            else
            {
                throw new Exception($"Could not update task {taskToReplace.Id} because it don't exists");
            }
        }

        foreach (var taskToAdd in updateKanbanTasksRequest.Add!)
        {
            var taskToAddColumnId = _mongoIdentityProvider.ParseIdFromString(taskToAdd.Column!);
            var existsColumn = kanban.Columns.Exists(column => column.Id == taskToAddColumnId);
            if (existsColumn)
            {
                var encryptedName = (await _securityService.EncriptData(
                        taskToAdd.Name!,
                        authenticatedUser.EncryptionKey,
                        authenticatedUser.Issued.ToString(("O"))
                        )).ToBase64String();

                var encryptedContent = (await _securityService.EncriptData(
                    taskToAdd.Content!,
                    authenticatedUser.EncryptionKey,
                    authenticatedUser.Issued.ToString("O")
                    )).ToBase64String();

                var issued = DateTime.UtcNow;
                var kanbanTask = new KanbanTask<ObjectId>(
                    _mongoIdentityProvider,
                    authenticatedUser.Id,
                    encryptedName,
                    encryptedContent,
                    taskToAddColumnId,
                    issued);

                kanban.Tasks.Add(kanbanTask);
            }
            else
            {
                throw new Exception($"Column {taskToAdd.Column} don't exists on kanban");
            }
        }

        foreach (var taskToDelete in updateKanbanTasksRequest.Delete!)
        {
            var existsAt = kanban.Tasks.FindIndex(task => task.Id == _mongoIdentityProvider.ParseIdFromString(taskToDelete));
            if (existsAt != -1)
            {
                kanban.Tasks.RemoveAt(existsAt);
            }
            else
            {
                throw new Exception($"Could not find task with id {taskToDelete.ToString()}");
            }
        }

        var hasBeenUpdated = await _mongoKanbansRepository
                .ReplaceKanbanTasksById(kanban.Id, authenticatedUser.Id, kanban.Tasks);

        return hasBeenUpdated;
    }
}