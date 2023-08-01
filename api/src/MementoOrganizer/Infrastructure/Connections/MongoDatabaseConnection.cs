using MementoOrganizer.Domain.Connections;
using MongoDB.Driver;
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

        var developmentDbaUsername = Environment.GetEnvironmentVariable("MementoDbaUsername");
        var developmentDbaPassword = Environment.GetEnvironmentVariable("MementoDbaPassword");
        
        var mongoClientSettings = MongoClientSettings.FromConnectionString(connectionStr);
        if (developmentDbaUsername != null && developmentDbaPassword != null)
        {
            mongoClientSettings.Credential = MongoCredential.CreateCredential(
                "admin",
                developmentDbaUsername,
                developmentDbaPassword);
        }
        
        MongoClient client = new MongoClient(mongoClientSettings);
        IMongoDatabase mongoDatabase = client.GetDatabase("MementoOrganizer");
        return mongoDatabase;
    }
}
