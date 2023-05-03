using FluentValidation;
using MementoOrganizer.Domain.Models.Requests.Notes;
namespace MementoOrganizer.Application.Validators.Requests.Notes;

public class CreateNoteRequestValidator : AbstractValidator<CreateNoteRequest>
{
    public CreateNoteRequestValidator()
    {
        RuleFor(req => req.Name)
        .NotEmpty().WithMessage("Name Must be Send")
        .MinimumLength(4).WithMessage("Name Must hava a minimum of 4 Characters");

        RuleFor(req => req.Description)
        .NotEmpty().WithMessage("Description Must be Send")
        .MinimumLength(8).WithMessage("Description Must hava a minimum of 8 Characters");

        RuleFor(req => req.Content)
        .NotEmpty().WithMessage("Content Must be Send");
    }
}
