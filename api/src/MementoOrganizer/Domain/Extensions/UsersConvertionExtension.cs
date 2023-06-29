using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Models.Responses.Users;

namespace MementoOrganizer.Domain.Extensions;
public static class UserConvertionExtension
{
    public static UserResponse ToUserResponse<TId>(this User<TId> user)
    {
        return new UserResponse(
            user.Email,
            user.Issued,
            user.LastLogin
        );
    }
}
