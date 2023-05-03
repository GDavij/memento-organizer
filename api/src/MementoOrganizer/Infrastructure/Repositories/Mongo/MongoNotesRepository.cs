using System.Collections.Generic;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Connections;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Repositories;
using MongoDB.Bson;
using MongoDB.Driver;
namespace MementoOrganizer.Infrastructure.Repositories.Mongo;

public class MongoNotesRepository : INotesRepository<ObjectId>
{
    private readonly IMongoCollection<Note<ObjectId>> _notesCollection;
    public MongoNotesRepository(IDatabaseConnection<IMongoDatabase> databaseConnection)
    {
        var database = databaseConnection.Resolve();
        _notesCollection = database.GetCollection<Note<ObjectId>>("notes", new MongoCollectionSettings { AssignIdOnInsert = false });
    }

    public async Task<bool> DeleteNoteById(ObjectId id, ObjectId ownerId)
    {
        var filterBuilder = Builders<Note<ObjectId>>.Filter;
        var filter = filterBuilder.Eq(note => note.Id, id) & filterBuilder.Eq(note => note.Owner, ownerId);

        var query = _notesCollection.DeleteOneAsync(filter);

        await query;
        return query.IsCompletedSuccessfully;
    }

    public async Task<List<Note<ObjectId>>> FindAllNotesByOwner(ObjectId owner)
    {
        var filter = Builders<Note<ObjectId>>.Filter.Eq(note => note.Owner, owner);
        return await _notesCollection.Find(filter).ToListAsync();
    }

    public async Task<Note<ObjectId>> FindNoteById(ObjectId id, ObjectId ownerId)
    {
        var filterBuilder = Builders<Note<ObjectId>>.Filter;
        var filter = filterBuilder.Eq(note => note.Id, id) & filterBuilder.Eq(note => note.Owner, ownerId);

        return await _notesCollection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task InsertNote(Note<ObjectId> note)
    {
        await _notesCollection.InsertOneAsync(note);
        return;
    }

    public async Task<bool> ReplaceNoteById(ObjectId id, ObjectId ownerId, Note<ObjectId> note)
    {
        var filterBuilder = Builders<Note<ObjectId>>.Filter;
        var filter = filterBuilder.Eq(note => note.Id, id) & filterBuilder.Eq(note => note.Owner, ownerId);

        var query = _notesCollection.ReplaceOneAsync(filter, note);
        await query;
        return query.IsCompletedSuccessfully;
    }
}
