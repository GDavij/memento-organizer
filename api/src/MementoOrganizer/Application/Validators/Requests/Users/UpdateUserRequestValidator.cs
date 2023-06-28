using FluentValidation;
using MementoOrganizer.Domain.Entities;
using MementoOrganizer.Domain.Models.Requests.Users;
namespace MementoOrganizer.Application.Validators.Requests.Users;

public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(req => req.Email)
            .EmailAddress().When(req => req.Email is not null).WithMessage("'email' parameter must be a Valid E-mail");

        RuleFor(req => req.Passphrase)
            .MinimumLength(16).When(req => req.Passphrase is not null).WithMessage("Passphrase must have a minimum of 16 characters");
    }
}
