using FluentValidation;
using MementoOrganizer.Domain.Models.Requests.Kanban;
using MongoDB.Bson;

namespace MementoOrganizer.Application.Validators.Requests.Kanbans;

class UpdateKanbanColumnsRequestValidator : AbstractValidator<UpdateKanbanColumnsRequest>
{
    public UpdateKanbanColumnsRequestValidator()
    {
        RuleFor(req => req.Add)
            .NotNull().WithMessage("Add list is required");

        RuleForEach(req => req.Add).ChildRules(addColumnRequest =>
        {
            addColumnRequest
                .RuleFor(add => add.Name)
                .NotEmpty().WithMessage("Name must be send");

            addColumnRequest
                .RuleFor(add => add.Order)
                .NotEmpty().WithMessage("Order must be send");
        });

        RuleFor(req => req.Delete)
            .NotNull().WithMessage("Delete list is required");

        RuleFor(req => req.Replace)
                .NotNull().WithMessage("Replace list is required");

        RuleForEach(req => req.Replace).ChildRules(replaceColumnRequest =>
        {
            replaceColumnRequest
                .RuleFor(replace => replace.Id)
                .NotEmpty().WithName("Id must be send");

            replaceColumnRequest
                .RuleFor(replace => replace.ColumnToReplaceId)
                .NotEmpty().WithMessage("Column To Replace Id must be send");


        });



    }
}