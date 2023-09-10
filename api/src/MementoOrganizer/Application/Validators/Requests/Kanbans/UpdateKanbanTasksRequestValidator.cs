using FluentValidation;
using MementoOrganizer.Domain.Models.Requests.Kanbans;
using MongoDB.Bson;

namespace MementoOrganizer.Application.Validators.Requests.Kanbans;

class UpdateKanbanTasksRequestValidator : AbstractValidator<UpdateKanbanTasksRequest>
{
    public UpdateKanbanTasksRequestValidator()
    {
        RuleFor(req => req.Add)
            .NotNull().WithMessage("Add request must be send");

        RuleForEach(req => req.Add).ChildRules(addTaskRequest =>
        {
            addTaskRequest.RuleFor(add => add.Name)
                .NotEmpty().WithMessage("Add request name must be send");

            addTaskRequest.RuleFor(add => add.Column)
                .NotEmpty().WithMessage("Add request column must be send");

        });

        RuleFor(req => req.Delete)
            .NotNull().WithMessage("Delete request must be send");

        RuleFor(req => req.Replace)
            .NotNull().WithMessage("Replace request must be send");

        RuleForEach(req => req.Replace).ChildRules(replaceTaskRequest =>
        {
            replaceTaskRequest
            .RuleFor(replace => replace.Id)
            .NotEmpty().WithName("Replace task request id must be send");

        });

    }
}