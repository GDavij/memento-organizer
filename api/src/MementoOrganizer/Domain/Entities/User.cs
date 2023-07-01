using System;
using MementoOrganizer.Domain.Providers;
using MementoOrganizer.Domain.Services.Interfaces;

namespace MementoOrganizer.Domain.Entities;

public class User<TId>
{
    public TId Id { get; private set; }
    public string Email { get; set; }
    public string Passphrase { get; set; }
    public DateTime Issued { get; private set; }
    public DateTime LastLogin { get; set; }
    public string EncryptionKey { get; private set; }
    public bool IsAdmin { get; private set; }

    public User(
        IIdentityProvider<TId> identityProvider,
        string email,
        string derivedPassphrase,
        DateTime issued,
        ISecurityService securityService,
        bool isAdmin
        )
    {
        Id = identityProvider.GenerateNewId();
        Email = email;
        Passphrase = derivedPassphrase;
        Issued = issued;
        LastLogin = issued;
        EncryptionKey = securityService.DerivePassphrase(Id!.ToString()!, Issued.ToString());
        IsAdmin = isAdmin;
    }
}
