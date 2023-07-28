using FluentValidation;
using MementoOrganizer.Domain.Models.Requests.Users;

namespace MementoOrganizer.Application.Validators.Requests.Users;

public class LoginAdminRequestValidator : AbstractValidator<LoginAdminRequest>
{
    public LoginAdminRequestValidator()
    {
        RuleFor(req => req.Email)
            .NotEmpty().WithMessage("E-mail must be send to create a new Admin")
            .EmailAddress().WithMessage("'email' parameter must be a Valid E-mail");

        RuleFor(req => req.Passphrase)
            .NotEmpty().WithMessage("Passphrase must be send to create a new Admin")
            .MinimumLength(16).WithMessage("Passphrase must have a minimum of 16 characters");
    }
}