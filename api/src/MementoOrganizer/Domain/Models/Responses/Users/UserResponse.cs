using System;
using MementoOrganizer.Domain.Entities;

namespace MementoOrganizer.Domain.Models.Responses.Users;
public class UserResponse
{
    public string Email { get; private set; }
    public string Issued { get; private set; }
    public string LastLogin { get; private set; }

    public UserResponse(string email, DateTime issued, DateTime lastLogin)
    {
        Email = email;
        Issued = issued.ToString();
        LastLogin = lastLogin.ToString();
    }
}
