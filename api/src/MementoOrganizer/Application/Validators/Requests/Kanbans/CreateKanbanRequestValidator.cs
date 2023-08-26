using FluentValidation;
using MementoOrganizer.Domain.Models.Requests.Kanban;
namespace MementoOrganizer.Application.Validators.Requests.Kanbans;
public class CreateKanbanRequestValidator : AbstractValidator<CreateKanbanRequest>
{
    public CreateKanbanRequestValidator()
    {
        RuleFor(req => req.Name)
            .NotEmpty().WithMessage("Name must be send");
    }
}
