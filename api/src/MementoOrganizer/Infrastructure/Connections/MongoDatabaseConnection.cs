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

        MongoClientSettings mongoClientSettings = MongoClientSettings.FromConnectionString(connectionStr);
        MongoClient client = new MongoClient(mongoClientSettings);
        IMongoDatabase mongoDatabase = client.GetDatabase("MementoOrganizer");
        return mongoDatabase;
    }
}
