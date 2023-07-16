using System.Collections.Generic;
using System.Threading.Tasks;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Models.Requests.Notes;
using MementoOrganizer.Domain.Services.Interfaces;
using MementoOrganizer.Domain.Models.Data;
using MongoDB.Bson;
using System;
using MementoOrganizer.Domain.Providers;
using MementoOrganizer.Domain.Repositories;
using MementoOrganizer.Domain.Models.Responses.Notes;
using MementoOrganizer.Domain.Extensions;

namespace MementoOrganizer.Domain.Services;

public class NoteService : INoteService
{
    private readonly IIdentityProvider<ObjectId> _mongoIdentityProvider;
    private readonly ISecurityService _securityService;
    private readonly INotesRepository<ObjectId> _mongoNotesRepository;
    private readonly IUsersRepository<ObjectId> _mongoUsersRepository;

    public NoteService(
        IIdentityProvider<ObjectId> mongoIdentityProvider,
        ISecurityService securityService,
        INotesRepository<ObjectId> mongoNotesRespository,
        IUsersRepository<ObjectId> mongoUsersRepository)
    {
        _mongoIdentityProvider = mongoIdentityProvider;
        _securityService = securityService;
        _mongoNotesRepository = mongoNotesRespository;
        _mongoUsersRepository = mongoUsersRepository;
    }

    public async Task<string> CreateNote(string token, CreateNoteRequest createNoteRequest)
    {
        Token<ObjectId>? parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
        {
            throw new Exception("Token Invalid");
        }

        User<ObjectId>? authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
        {
            throw new Exception("Could not authenticate the User");
        }

        DateTime issued = DateTime.UtcNow;
        var description = createNoteRequest.Description ?? "";
        var content = "[{\"type\":\"paragraph\",\"children\":[{\"text\": \"\"}]}]";
        string encriptedName = (await _securityService.EncriptData(createNoteRequest.Name!, authenticatedUser.EncryptionKey, issued.ToString())).ToBase64String();
        string encriptedDescription = (await _securityService.EncriptData(description, authenticatedUser.EncryptionKey, issued.ToString())).ToBase64String();
        string encriptedContent = (await _securityService.EncriptData(content, authenticatedUser.EncryptionKey, issued.ToString())).ToBase64String();


        Note<ObjectId> note = new(
            _mongoIdentityProvider,
            authenticatedUser.Id,
            encriptedName,
            encriptedDescription,
            encriptedContent,
            issued
            );

        await _mongoNotesRepository.InsertNote(note);
        return note.Id.ToString();
    }

    public async Task<bool> DeleteNote(string token, string noteId)
    {
        Token<ObjectId>? parsedToken = _securityService.TryParseToken<ObjectId>(token, _mongoIdentityProvider);
        if (parsedToken == null)
        {
            throw new Exception("Token Invalid");
        }

        User<ObjectId>? authenticatedUser = await _securityService.AuthenticateUser<ObjectId>(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
        {
            throw new Exception("Could not authenticate the User");
        }

        ObjectId id = _mongoIdentityProvider.ParseIdFromString(noteId);
        Note<ObjectId> note = await _mongoNotesRepository.FindNoteById(id, authenticatedUser.Id);
        if (note == null)
        {
            throw new Exception("Note Not Found");
        }

        bool hasBeenDeleted = await _mongoNotesRepository.DeleteNoteById(id, authenticatedUser.Id);
        return hasBeenDeleted;
    }

    public async Task<NoteResponse> GetNote(string token, string noteId)
    {
        Token<ObjectId>? parsedToken = _securityService.TryParseToken(token, _mongoIdentityProvider);
        if (parsedToken == null)
        {
            throw new Exception("Token Invalid");
        }

        User<ObjectId>? authenticatedUser = await _securityService.AuthenticateUser(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
        {
            throw new Exception("Could not authenticate the User");
        }

        ObjectId id = _mongoIdentityProvider.ParseIdFromString(noteId);
        Note<ObjectId>? note = await _mongoNotesRepository.FindNoteById(id, authenticatedUser.Id);
        if (note == null)
        {
            throw new Exception("Note Not Found");
        }

        return await note.ToNoteResponse(authenticatedUser, _securityService);
    }

    public async Task<List<NoteResponse>> GetNotes(string token)
    {
        Token<ObjectId>? parsedToken = _securityService.TryParseToken<ObjectId>(token, _mongoIdentityProvider);
        if (parsedToken == null)
        {
            throw new Exception("Token Invalid");
        }

        User<ObjectId>? authenticatedUser = await _securityService.AuthenticateUser<ObjectId>(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
        {
            throw new Exception("Could not authenticate the User");
        }

        List<Note<ObjectId>> notes = await _mongoNotesRepository.FindAllNotesByOwner(authenticatedUser.Id);
        return await notes.ToListNoteResponse(authenticatedUser, _securityService);
    }

    public async Task<bool> UpdateNote(string token, string noteId, UpdateNoteRequest updateNoteRequest)
    {
        Token<ObjectId>? parsedToken = _securityService.TryParseToken<ObjectId>(token, _mongoIdentityProvider);
        if (parsedToken == null)
        {
            throw new Exception("Token Invalid");
        }

        User<ObjectId>? authenticatedUser = await _securityService.AuthenticateUser<ObjectId>(parsedToken, _mongoUsersRepository);
        if (authenticatedUser == null)
        {
            throw new Exception("Could not authenticate the User");
        }

        ObjectId id = _mongoIdentityProvider.ParseIdFromString(noteId);
        Note<ObjectId>? note = await _mongoNotesRepository.FindNoteById(id, authenticatedUser.Id);
        if (note == null)
        {
            throw new Exception("Note Not found");
        }

        if (updateNoteRequest.Name != null)
        {
            note.Name = (await _securityService.EncriptData(updateNoteRequest.Name, authenticatedUser.EncryptionKey, note.Issued.ToString())).ToBase64String();
        }

        if (updateNoteRequest.Description != null)
        {
            note.Description = (await _securityService.EncriptData(updateNoteRequest.Description, authenticatedUser.EncryptionKey, note.Issued.ToString())).ToBase64String();
        }
        else if (updateNoteRequest.Content == null)
        {
            note.Description = (await _securityService.EncriptData("", authenticatedUser.EncryptionKey, note.Issued.ToString())).ToBase64String();
        }

        if (updateNoteRequest.Content != null)
        {
            note.Content = (await _securityService.EncriptData(updateNoteRequest.Content, authenticatedUser.EncryptionKey, note.Issued.ToString())).ToBase64String();
        }

        bool hasBeenUpdated = await _mongoNotesRepository.ReplaceNoteById(note.Id, note.Owner, note);
        return hasBeenUpdated;
    }

}
