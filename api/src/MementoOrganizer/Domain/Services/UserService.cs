using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Services.Interfaces;
using MementoOrganizer.Domain.Repositories;
using MementoOrganizer.Domain.Providers;
using MementoOrganizer.Domain.Models.Data;
using MementoOrganizer.Domain.Models.Requests.Users;
using MementoOrganizer.Domain.Models.Responses.Users;
using MementoOrganizer.Domain.Extensions;
using MongoDB.Bson;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.DataProtection;

namespace MementoOrganizer.Domain.Services;

public class UserService : IUserService
{
    private readonly IIdentityProvider<ObjectId> _mongoIdentityProvider;
    private readonly ISecurityService _securityService;
    private readonly IUsersRepository<ObjectId> _mongoUsersRepository;
    private readonly INotesRepository<ObjectId> _mongoNotesRepository;
    public UserService(
        IIdentityProvider<ObjectId> mongoIdentityProvider,
        ISecurityService securityService,
        IUsersRepository<ObjectId> mongoUsersRepository,
        INotesRepository<ObjectId> mongoNotesRepository)
    {
        _mongoIdentityProvider = mongoIdentityProvider;
        _securityService = securityService;
        _mongoUsersRepository = mongoUsersRepository;
        _mongoNotesRepository = mongoNotesRepository;
    }

    public async Task CreateAdmin(CreateAdminRequest createAdminRequest)
    {
        if (await _mongoUsersRepository.FindUserByEmail(createAdminRequest.Email!) != null)
        {
            throw new Exception("User Already Exists");
        }

        bool existsAnyAdmin = await _mongoUsersRepository.ExistsAnyAdmin();
        if (existsAnyAdmin)
        {
            Token<ObjectId>? adminToken = _securityService.TryParseToken(createAdminRequest.AdminToken, _mongoIdentityProvider);
            if (adminToken == null)
            {
                throw new Exception("Token is not Valid");
            }

            var databaseAdmin = await _securityService.AuthenticateUser<ObjectId>(adminToken, _mongoUsersRepository);
            if (databaseAdmin == null || databaseAdmin.IsAdmin == false)
            {
                throw new Exception("Admin Already Exists Create a new Admin with an Admin Token");
            }
        }
        DateTime issued = DateTime.UtcNow;
        string derivedPassphrase = _securityService
                    .DerivePassphrase(createAdminRequest.Passphrase!, issued.ToString());

        string encryptionKey = GenerateEncryptionKey(derivedPassphrase);
        User<ObjectId> newUser = new User<ObjectId>(
            _mongoIdentityProvider,
            createAdminRequest.Email!,
            derivedPassphrase,
            issued,
            encryptionKey,
            true);

        await _mongoUsersRepository.InsertUser(newUser);
        return;
    }

    public async Task CreateUser(CreateUserRequest createUserRequest)
    {
        if (await _mongoUsersRepository.FindUserByEmail(createUserRequest.Email!) != null)
        {
            throw new Exception("User Already Exists");
        }

        DateTime issued = DateTime.UtcNow;
        string derivedPassphrase = _securityService
                    .DerivePassphrase(createUserRequest.Passphrase!, issued.ToString());

        string encryptionKey = GenerateEncryptionKey(derivedPassphrase);
        User<ObjectId> user = new User<ObjectId>(
            _mongoIdentityProvider,
            createUserRequest.Email!,
            derivedPassphrase,
            issued,
            encryptionKey,
            false);

        await _mongoUsersRepository.InsertUser(user);
        return;
    }

    public async Task<bool> DeleteUser(string token)
    {
        Token<ObjectId>? parsedToken = _securityService.TryParseToken<ObjectId>(token, _mongoIdentityProvider);
        if (parsedToken == null)
        {
            throw new Exception("Token is not Valid");
        }

        User<ObjectId>? authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
        {
            throw new Exception("Token is not Valid");
        }

        bool notesHasBeenDeleted = await _mongoNotesRepository.DeleteNotesByOwner(authenticatedUser.Id);
        if (notesHasBeenDeleted)
        {

            bool hasBeenDeleted = await _mongoUsersRepository.DeleteUserById(authenticatedUser.Id);
            return hasBeenDeleted;
        }
        return false;
    }

    public async Task<UserResponse> FindUser(string token)
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

        return authenticatedUser.ToUserResponse<ObjectId>();
    }

    public async Task<bool> CheckIsAdmin(string token)
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

        return authenticatedUser.IsAdmin;
    }

    public async Task<string> LoginUser(LoginUserRequest loginUserRequest)
    {
        User<ObjectId>? databaseUser = await _mongoUsersRepository.FindUserByEmail(loginUserRequest.Email!);
        if (databaseUser == null)
        {
            throw new Exception("User Not Found");
        }

        string derivedPassphrase = _securityService.DerivePassphrase(loginUserRequest.Passphrase!, databaseUser.Issued.ToString());
        if (!databaseUser.Passphrase.Equals(derivedPassphrase))
        {
            throw new Exception("User Could not be Authenticated");
        }

        return _securityService.GenerateToken<ObjectId>(databaseUser.Id, databaseUser.Passphrase);
    }

    public async Task<string> UpdateUser(string token, UpdateUserRequest updateUserRequest)
    {
        if (
            updateUserRequest.Email is not null &&
            await _mongoUsersRepository.FindUserByEmail(updateUserRequest.Email) != null)
        {
            throw new Exception("Could not Update User Email, already Exists");
        }

        Token<ObjectId>? parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
        {
            throw new Exception("Token is Not Valid");
        }

        User<ObjectId>? authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
        {
            throw new Exception("Token is not Valid");
        }

        if (updateUserRequest.Email != null)
        {
            authenticatedUser.Email = updateUserRequest.Email;
        }

        if (updateUserRequest.Passphrase != null)
        {
            var derivedPassphrase = _securityService.DerivePassphrase(updateUserRequest.Passphrase, authenticatedUser.Issued.ToString());
            authenticatedUser.Passphrase = derivedPassphrase;
        }

        bool hasBeenUpdated = await _mongoUsersRepository.ReplaceUser(authenticatedUser.Id, authenticatedUser);
        if (hasBeenUpdated)
        {
            return _securityService.GenerateToken(authenticatedUser.Id, authenticatedUser.Passphrase);
        }

        throw new Exception("Could not Update user");
    }

    private string GenerateEncryptionKey(string derivedPassphrase)
    {
        Secret secureRandomNumber = Secret.Random(512);
        ArraySegment<byte> keyBytes = new ArraySegment<byte>(new byte[512]);
        secureRandomNumber.WriteSecretIntoBuffer(keyBytes);
        string encryptionKey = _securityService.DerivePassphrase(keyBytes.Array!, derivedPassphrase);
        return encryptionKey;
    }

    Task IUserService.CreateAdmin(CreateAdminRequest createAdminRequest)
    {
        throw new System.NotImplementedException();
    }

    Task IUserService.CreateUser(CreateUserRequest createUserRequest)
    {
        throw new System.NotImplementedException();
    }

    Task<bool> IUserService.DeleteUser(string token)
    {
        throw new System.NotImplementedException();
    }

    Task<UserResponse> IUserService.FindUser(string token)
    {
        throw new System.NotImplementedException();
    }

    Task<bool> IUserService.CheckIsAdmin(string token)
    {
        throw new System.NotImplementedException();
    }

    Task<string> IUserService.LoginUser(LoginUserRequest loginUserRequest)
    {
        throw new System.NotImplementedException();
    }

    Task<string> IUserService.UpdateUser(string token, UpdateUserRequest updateUserRequest)
    {
        throw new System.NotImplementedException();
    }
}
