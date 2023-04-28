using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using MementoOrganizer.Domain.Connections;
using MementoOrganizer.Infrastructure.Connections;
using MementoOrganizer.Domain.Repositories;
using MementoOrganizer.Infrastructure.Repositories.Mongo;
using MongoDB.Bson;
using MementoOrganizer.Domain.Providers;
using MementoOrganizer.Infrastructure.Providers;
using MementoOrganizer.Domain.Services.Interfaces;
using MementoOrganizer.Domain.Services;
using MementoOrganizer.Application.Middlewares;
using MementoOrganizer.Application.Validators.Requests.Users;
using MementoOrganizer.Domain.Models.Requests.Users;
using FluentValidation;
using FluentValidation.AspNetCore;


namespace MementoOrganizer.Application;

public static class SetupApplicationExtensionMethod
{
    public static IServiceCollection SetupInfrastructure(this IServiceCollection services)
    {
        services
            .AddScoped<IDatabaseConnection<IMongoDatabase>, MongoDatabaseConnection>()
            .AddScoped<IUsersRepository<ObjectId>, MongoUsersRepository>()
            .AddSingleton<IIdentityProvider<ObjectId>, MongoIdentityProvider>();

        return services;
    }

    public static IServiceCollection SetupDomain(this IServiceCollection services)
    {
        services
            .AddScoped<ISecurityService, SecurityService>()
            .AddScoped<IUserService, UserService>();

        return services;
    }

    public static IServiceCollection SetupApplicationRules(this IServiceCollection services)
    {
        services
            .AddScoped<GlobalErrorHandlingMiddleware>()
            .AddScoped<IValidator<CreateAdminRequest>, CreateAdminRequestValidator>()
            .AddScoped<IValidator<CreateUserRequest>, CreateUserRequestValidator>()
            .AddScoped<IValidator<LoginUserRequest>, LoginUserRequestValidator>()
            .AddFluentValidationAutoValidation();

        return services;
    }
}
