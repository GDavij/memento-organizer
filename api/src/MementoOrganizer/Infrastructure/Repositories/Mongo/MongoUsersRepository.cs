using System.Threading.Tasks;
using MementoOrganizer.Domain.Repositories;
using MongoDB.Driver;
using MongoDB.Bson;
using MementoOrganizer.Domain.Connections;
using MementoOrganizer.Domain.Entities;
using System.Collections.Generic;

namespace MementoOrganizer.Infrastructure.Repositories.Mongo;

public class MongoUsersRepository : IUsersRepository<ObjectId>
{
    private readonly IMongoCollection<User<ObjectId>> _usersCollection;
    public MongoUsersRepository(IDatabaseConnection<IMongoDatabase> databaseConnection)
    {
        var database = databaseConnection.Resolve();
        _usersCollection = database.GetCollection<User<ObjectId>>("users", new MongoCollectionSettings { AssignIdOnInsert = false });
    }

    public async Task<bool> DeleteUserById(ObjectId id)
    {
        var filter = Builders<User<ObjectId>>.Filter.Eq(user => user.Id, id);
        var query = _usersCollection.DeleteOneAsync(filter);
        await query;

        return query.IsCompletedSuccessfully;
    }

    public async Task<bool> ExistsAnyAdmin()
    {
        var filter = Builders<User<ObjectId>>.Filter.Eq(user => user.IsAdmin, true);
        var query = _usersCollection.CountDocumentsAsync(filter);
        long adminCount = await query;

        return adminCount > 0 ? true : false;
    }

    public async Task<User<ObjectId>?> FindUserByEmail(string email)
    {
        var filterBuilder = Builders<User<ObjectId>>.Filter;
        var filter = filterBuilder.Eq(user => user.Email, email) & filterBuilder.Eq(user => user.IsAdmin, false);
        var query = _usersCollection.Find(filter).FirstOrDefaultAsync();
        return await query;
    }

    public async Task<User<ObjectId>?> FindAdminByEmail(string email)
    {
        var filterBuilder = Builders<User<ObjectId>>.Filter;
        var filter = filterBuilder.Eq(user => user.Email, email) & filterBuilder.Eq(user => user.IsAdmin, true);
        var query = _usersCollection.Find(filter).FirstOrDefaultAsync();
        return await query;
    }

    public async Task<User<ObjectId>?> FindUserById(ObjectId id)
    {
        var filter = Builders<User<ObjectId>>.Filter.Eq(user => user.Id, id);
        var query = _usersCollection.Find(filter).FirstOrDefaultAsync();
        return await query;
    }

    public async Task InsertUser(User<ObjectId> user)
    {
        await _usersCollection.InsertOneAsync(user);
        return;
    }

    public async Task<List<User<ObjectId>>> ListAllActiveAdmins()
    {
        var filter = Builders<User<ObjectId>>.Filter.Eq(user => user.IsAdmin, true);
        return await _usersCollection.Find(filter).ToListAsync();
    }

    public async Task<List<User<ObjectId>>> ListAllActiveUsers()
    {
        var filter = Builders<User<ObjectId>>.Filter.Eq(user => user.IsAdmin, false);
        return await _usersCollection.Find(filter).ToListAsync();
    }

    public async Task<bool> ReplaceUser(ObjectId ownerId, User<ObjectId> user)
    {
        var filter = Builders<User<ObjectId>>.Filter.Eq(user => user.Id, ownerId);
        var query = _usersCollection.ReplaceOneAsync(filter, user);
        await query;
        return query.IsCompletedSuccessfully;
    }
}
