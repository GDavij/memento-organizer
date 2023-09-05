using FluentValidation;
using MementoOrganizer.Domain.Models.Requests.Kanbans;
namespace MementoOrganizer.Application.Validators.Requests.Kanbans;
public class CreateKanbanRequestValidator : AbstractValidator<CreateKanbanRequest>
{
    public CreateKanbanRequestValidator()
    {
        RuleFor(req => req.Name)
            .NotEmpty().WithMessage("Name must be send");
    }
}
