using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using MementoOrganizer.Domain.Connections;
using MementoOrganizer.Domain.Repositories;

namespace MementoOrganizer.Infrastructure.Repositories.AWSS3;
public class S3ImageRepository : IStorageRepository<GetObjectResponse>
{
    private readonly IStorageConnection<AmazonS3Client> _s3Client;
    public S3ImageRepository(IStorageConnection<AmazonS3Client> storageConnection)
    {
        _s3Client = storageConnection;
    }

    public async Task<bool> PutObject(byte[] blobData, string accessResourceUrl)
    {
        var client = await _s3Client.ResolveConnectionAsync();
        var request = new PutObjectRequest
        {
            BucketName = _s3Client.GetStorageName(),
            Key = accessResourceUrl,
            InputStream = new MemoryStream(blobData),
            ContentType = "image/jpeg",
        };

        var response = await client.PutObjectAsync(request);
        if (response == null)
            throw new Exception("Blob Don't Exists");

        return response.HttpStatusCode == HttpStatusCode.OK;
    }

    public async Task<GetObjectResponse> GetObject(string accessResourceUrl)
    {
        var client = await _s3Client.ResolveConnectionAsync();
        var request = new GetObjectRequest
        {
            BucketName = _s3Client.GetStorageName(),
            Key = accessResourceUrl
        };


        var response = await client.GetObjectAsync(request);
        if (response == null)
            throw new Exception("Blob don't Exists");

        return response;
    }

    public async Task<bool> DeleteObject(string accessResourceUrl)
    {
        var client = await _s3Client.ResolveConnectionAsync();
        var request = new DeleteObjectRequest
        {
            BucketName = _s3Client.GetStorageName(),
            Key = accessResourceUrl,
        };

        var response = await client.DeleteObjectAsync(request);
        if (response == null)
            throw new Exception("Blob don't Exists");

        return response.HttpStatusCode == HttpStatusCode.NoContent;
    }

}
