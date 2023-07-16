using System;
using System.Threading.Tasks;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;

namespace MementoOrganizer.Domain.Connections;
public class AmazonS3StorageConnection : IStorageConnection<AmazonS3Client>
{
    public async Task<AmazonS3Client> ResolveConnectionAsync()
    {
        var bucketName = GetStorageName();
        string? awsAccessKeyId = Environment.GetEnvironmentVariable("MementoAwsAccessKeyId");
        string? awsSecretAccessKey = Environment.GetEnvironmentVariable("MementoAwsSecretAccessKey");
        if (awsAccessKeyId == null || awsSecretAccessKey == null)
        {
            Console.WriteLine("Could not Find Aws Credential to Login, Exiting Process...");
            Environment.Exit(1);
        }
        var credentials = new BasicAWSCredentials(awsAccessKeyId.Trim(), awsSecretAccessKey.Trim());
        var client = new AmazonS3Client(credentials, RegionEndpoint.USEast1);
        if (client == null)
            throw new Exception("Client Connection could not be resolved");

        bool bucketExists = await AmazonS3Util.DoesS3BucketExistV2Async(client, bucketName);
        if (!bucketExists)
        {
            var bucketRequest = new PutBucketRequest
            {
                BucketName = bucketName,
                UseClientRegion = true,
            };
            await client.PutBucketAsync(bucketRequest);
        }

        return client;
    }

    public string GetStorageName()
    {
        string? bucketName = Environment.GetEnvironmentVariable("MementoOrganizerS3BucketName");
        if (bucketName == null)
            throw new Exception("No Bucket Name Found, Exiting Process...");

        return bucketName;
    }
}
