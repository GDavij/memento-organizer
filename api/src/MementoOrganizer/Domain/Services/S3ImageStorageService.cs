using System;
using System.IO;
using System.Threading.Tasks;
using Amazon.S3.Model;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Models.Data;
using MementoOrganizer.Domain.Providers;
using MementoOrganizer.Domain.Repositories;
using MementoOrganizer.Domain.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;

namespace MementoOrganizer.Domain.Services;
public class S3ImageStorageService : IStorageService
{
    private readonly ISecurityService _securityService;
    private readonly IIdentityProvider<ObjectId> _mongoIdentityProvider;
    private readonly IUsersRepository<ObjectId> _mongoUsersRepository;
    private readonly IStorageRepository<GetObjectResponse> _s3ImageRepository;

    public S3ImageStorageService(
        ISecurityService securityService,
        IIdentityProvider<ObjectId> mongoIdentityProvider,
        IUsersRepository<ObjectId> mongoUsersRepository,
        IStorageRepository<GetObjectResponse> s3ImageRepository)
    {
        _securityService = securityService;
        _mongoIdentityProvider = mongoIdentityProvider;
        _mongoUsersRepository = mongoUsersRepository;
        _s3ImageRepository = s3ImageRepository;
    }

    public async Task<string> PutStorageObject(string token, IFormFile formFile)
    {
        Token<ObjectId>? parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
        {
            throw new Exception("Token is not Valid");
        }

        User<ObjectId>? authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
        {
            throw new Exception("Token is not Valid");
        }

        if (formFile != null && formFile.Length > 0)
        {
            string blobName = Guid.NewGuid().ToString();
            using (var stream = new MemoryStream())
            {
                byte[] byteData;
                formFile.CopyTo(stream);
                byteData = stream.ToArray();
                bool hasBeenPutted = await _s3ImageRepository.PutObject(byteData, blobName);

                if (!hasBeenPutted)
                    throw new Exception("Could not Upload File To S3");
            }
            authenticatedUser.ImagesAtached.Add(blobName);
            //TODO: Refactore `Replace User` to allow it to be Storage Safe
            bool hasBeenUpdated = await _mongoUsersRepository.ReplaceUser(authenticatedUser.Id, authenticatedUser);
            if (!hasBeenUpdated)
            {
                throw new Exception("Could not Map User Image to Storage");
            }
            return blobName;
        }
        throw new Exception("Could not Upload File");
    }
    public async Task<string> GetStorageObject(string token, string objectName)
    {
        if (objectName == null)
        {
            throw new Exception("Object Name is Required");
        }

        Token<ObjectId>? parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
        {
            throw new Exception("Token is not Valid");
        }

        User<ObjectId>? authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
        {
            throw new Exception("Token is not Valid");
        }

        if (!authenticatedUser.ImagesAtached.Contains(objectName))
            throw new Exception("Image Acess Denied");

        var response = await _s3ImageRepository.GetObject(objectName);
        if (response == null)
            throw new Exception("Could not Find Obeject");

        string base64Blob;
        using (var responseStream = response.ResponseStream)
        {
            using (var memoryStream = new MemoryStream())
            {
                responseStream.CopyTo(memoryStream);
                byte[] blobData = memoryStream.ToArray();

                base64Blob = Convert.ToBase64String(blobData);
            }
        }

        return base64Blob;
    }

    public async Task<bool> DeleteStorageObject(string token, string objectName)
    {
        if (objectName == null)
            throw new Exception("Object Name is Required");

        Token<ObjectId>? parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
        {
            throw new Exception("Token is not Valid");
        }

        User<ObjectId>? authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
        {
            throw new Exception("Token is not Valid");
        }

        if (!authenticatedUser.ImagesAtached.Contains(objectName))
            throw new Exception("Acess to Image Denied");

        var response = await _s3ImageRepository.DeleteObject(objectName);
        if (!response)
            throw new Exception("Could not Delete The Image");

        authenticatedUser.ImagesAtached.Remove(objectName);
        await _mongoUsersRepository.ReplaceUser(authenticatedUser.Id, authenticatedUser);
        return response;
    }
}
