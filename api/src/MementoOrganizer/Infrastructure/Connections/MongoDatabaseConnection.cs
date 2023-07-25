using MementoOrganizer.Domain.Connections;
using MongoDB.Driver;
using MongoDB.Driver.Core.Configuration;
using System;
namespace MementoOrganizer.Infrastructure.Connections;

public class MongoDatabaseConnection : IDatabaseConnection<IMongoDatabase>
{
    public IMongoDatabase Resolve()
    {
        string? connectionStr = Environment.GetEnvironmentVariable("MementoOrganizerMongoConnectionStr");
        if (connectionStr == null)
        {
            Console.WriteLine("Could not Find Connection Str, Exiting Process...");
            Environment.Exit(1);
        }

        var dbaUser = Environment.GetEnvironmentVariable("MementoDbaUsername");
        var dbaPassword = Environment.GetEnvironmentVariable("MementoDbaPassword");
        if (dbaUser == null || dbaPassword == null)
        {
            Console.WriteLine("Could not find Dba Username or Password");
            Environment.Exit(1);
        }

        MongoClientSettings mongoClientSettings = MongoClientSettings.FromConnectionString(connectionStr);
        mongoClientSettings.Credential = MongoCredential.CreateCredential("admin", dbaUser, dbaPassword);
        MongoClient client = new MongoClient(mongoClientSettings);
        IMongoDatabase mongoDatabase = client.GetDatabase("MementoOrganizer");
        return mongoDatabase;
    }
}
