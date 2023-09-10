using System.Collections.Generic;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Connections;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Repositories;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace MementoOrganizer.Infrastructure.Repositories.Mongo;

public class MongoKanbansRepository : IKanbansRepository<ObjectId>
{
    private readonly IMongoCollection<Kanban<ObjectId>> _kanbansCollection;

    public MongoKanbansRepository(IDatabaseConnection<IMongoDatabase> databaseConnection)
    {
        var database = databaseConnection.Resolve();
        _kanbansCollection = database.GetCollection<Kanban<ObjectId>>("kanbans", new MongoCollectionSettings { AssignIdOnInsert = false });
    }

    public async Task<bool> DeleteKanbansByOwner(ObjectId ownerId)
    {
        var filter = Builders<Kanban<ObjectId>>.Filter.Eq(kanban => kanban.Owner, ownerId);
        var query = _kanbansCollection.DeleteManyAsync(filter);
        await query;
        return query.IsCompletedSuccessfully;
    }

    public async Task<bool> DeleteKanbanById(ObjectId id, ObjectId ownerId)
    {
        var filterBuilder = Builders<Kanban<ObjectId>>.Filter;
        var filter = filterBuilder.Eq(kanban => kanban.Id, id) & filterBuilder.Eq(kanban => kanban.Owner, ownerId);

        var query = _kanbansCollection.DeleteOneAsync(filter);
        await query;
        return query.IsCompletedSuccessfully;
    }

    public async Task<Kanban<ObjectId>?> FindKanbanById(ObjectId id, ObjectId ownerId)
    {
        var filterBuilder = Builders<Kanban<ObjectId>>.Filter;
        var filter = filterBuilder.Eq(kanban => kanban.Id, id) & filterBuilder.Eq(kanban => kanban.Owner, ownerId);
        return await _kanbansCollection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<List<Kanban<ObjectId>>> FindKanbansByOwner(ObjectId ownerId)
    {
        var filter = Builders<Kanban<ObjectId>>.Filter.Eq(kanban => kanban.Owner, ownerId);
        return await _kanbansCollection.Find(filter).ToListAsync();
    }

    public async Task<List<KanbanTask<ObjectId>>?> FindKanbanTasksByKanbanId(ObjectId id, ObjectId ownerId)
    {
        var filterBuilder = Builders<Kanban<ObjectId>>.Filter;
        var filter = filterBuilder.Eq(kanban => kanban.Id, id) & filterBuilder.Eq(kanban => kanban.Owner, ownerId);

        var kanban = await _kanbansCollection.Find(filter).FirstOrDefaultAsync();
        return kanban?.Tasks;
    }


    public async Task<KanbanTask<ObjectId>?> FindKanbanTaskById(ObjectId id, ObjectId ownerId)
    {
        var query = _kanbansCollection
            .AsQueryable()
            .Where(kanban => kanban.Owner.Equals(ownerId))
            .Select(kanban => kanban.Tasks)
            .ToListAsync();

        var tasksList = await query;
        KanbanTask<ObjectId>? taskFound = null;

        foreach (var tasks in tasksList)
        {
            var task = tasks.Find(task => task.Id.Equals(id));
            if (task != null)
            {
                taskFound = task;
                break;
            }
        }
        return taskFound;
    }

    public async Task InsertKanban(Kanban<ObjectId> kanban)
    {
        await _kanbansCollection.InsertOneAsync(kanban);
    }


    public async Task<bool> ReplaceKanbanById(ObjectId id, ObjectId ownerId, Kanban<ObjectId> kanban)
    {
        var filterBuilder = Builders<Kanban<ObjectId>>.Filter;
        var filter = filterBuilder.Eq(kanban => kanban.Id, id) & filterBuilder.Eq(kanban => kanban.Owner, ownerId);

        var query = _kanbansCollection.ReplaceOneAsync(filter, kanban);
        await query;
        return query.IsCompletedSuccessfully;
    }
}