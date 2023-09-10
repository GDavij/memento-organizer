using FluentValidation;
using MementoOrganizer.Domain.Models.Requests.Notes;
namespace MementoOrganizer.Application.Validators.Requests.Notes;

public class CreateNoteRequestValidator : AbstractValidator<CreateNoteRequest>
{
    public CreateNoteRequestValidator()
    {
        RuleFor(req => req.Name)
            .NotEmpty().WithMessage("Name Must be Send");
    }
}
