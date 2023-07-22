using System.Collections.Generic;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Models.Responses.Users;

namespace MementoOrganizer.Domain.Extensions;
public static class UserConvertionExtension
{
    public static UserResponse ToUserResponse<TId>(this User<TId> user)
    {
        return new UserResponse(
            user.Id!.ToString()!,
            user.Email,
            user.Issued,
            user.LastLogin
        );
    }

    public static List<UserResponse> ToListUserResponse<TId>(this List<User<TId>> users)
    {
        List<UserResponse> usersResponses = new();
        foreach (User<TId> user in users)
            usersResponses.Add(user.ToUserResponse());

        return usersResponses;
    }
}
