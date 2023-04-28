using MongoDB.Bson;
using MementoOrganizer.Domain.Providers;
namespace MementoOrganizer.Infrastructure.Providers;

public class MongoIdentityProvider : IIdentityProvider<ObjectId>
{
    public ObjectId GenerateNewId()
    {
        return ObjectId.GenerateNewId();
    }

    public ObjectId ParseIdFromString(string id)
    {
        return ObjectId.Parse(id);
    }
}
