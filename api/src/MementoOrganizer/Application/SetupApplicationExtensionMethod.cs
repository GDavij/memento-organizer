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
using MementoOrganizer.Application.Validators.Requests.Notes;
using MementoOrganizer.Domain.Models.Requests.Users;
using MementoOrganizer.Domain.Models.Requests.Notes;
using FluentValidation;
using FluentValidation.AspNetCore;
using Amazon.S3;
using MementoOrganizer.Infrastructure.Repositories.AWSS3;
using Amazon.S3.Model;

namespace MementoOrganizer.Application;

public static class SetupApplicationExtensionMethod
{
    public static IServiceCollection SetupInfrastructure(this IServiceCollection services)
    {
        services
            .AddScoped<IDatabaseConnection<IMongoDatabase>, MongoDatabaseConnection>()
            .AddScoped<IUsersRepository<ObjectId>, MongoUsersRepository>()
            .AddScoped<INotesRepository<ObjectId>, MongoNotesRepository>()
            .AddSingleton<IIdentityProvider<ObjectId>, MongoIdentityProvider>()
            .AddScoped<IStorageConnection<AmazonS3Client>, AmazonS3StorageConnection>()
            .AddScoped<IStorageRepository<GetObjectResponse>, S3ImageRepository>();

        return services;
    }

    public static IServiceCollection SetupDomain(this IServiceCollection services)
    {
        services
            .AddScoped<ISecurityService, SecurityService>()
            .AddScoped<IUserService, UserService>()
            .AddScoped<INoteService, NoteService>()
            .AddScoped<IStorageService, S3ImageStorageService>();

        return services;
    }

    public static IServiceCollection SetupApplicationRules(this IServiceCollection services)
    {
        services
            .AddScoped<GlobalErrorHandlingMiddleware>()
            .AddScoped<IValidator<CreateAdminRequest>, CreateAdminRequestValidator>()
            .AddScoped<IValidator<CreateUserRequest>, CreateUserRequestValidator>()
            .AddScoped<IValidator<LoginUserRequest>, LoginUserRequestValidator>()
            .AddScoped<IValidator<UpdateUserRequest>, UpdateUserRequestValidator>()
            .AddScoped<IValidator<CreateNoteRequest>, CreateNoteRequestValidator>()
            .AddScoped<IValidator<UpdateTargetUserRequest>, UpdateTargetUserRequestValidator>()
            .AddFluentValidationAutoValidation();

        return services;
    }
}
