using System.Text.Json;
using Amazon;
using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using MementoOrganizer.Application.Middlewares;
using MementoOrganizer.Application;

var builder = WebApplication.CreateBuilder(args);

//Logger
builder.Logging
        .ClearProviders()
        .AddJsonConsole();

// Add services to the container.
builder.Services
        .AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        });

// Add Infrastructure Services
builder.Services.SetupInfrastructure();

// Add Domain Services
builder.Services.SetupDomain();

// Add Application Rules (Validation, Middlewares, etc...)
builder.Services.SetupApplicationRules();

string corsPolicyName = "_mementoOrganizerDefaultOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.WithOrigins("http://127.0.0.1:3000", "http://localhost:3000");
        policy.WithMethods("GET", "POST", "DELETE", "PUT", "OPTIONS");
        policy.WithHeaders("content-type", "authorization");
        // Just for now at Development
    });
});

string region = Environment.GetEnvironmentVariable("AWS_REGION") ?? RegionEndpoint.USEast2.SystemName;

// Add AWS Lambda support. When running the application as an AWS Serverless application, Kestrel is replaced
// with a Lambda function contained in the Amazon.Lambda.AspNetCoreServer package, which marshals the request into the ASP.NET Core hosting framework.
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);


var app = builder.Build();

// app.UseHttpsRedirection(); Remove for CORS Reasons 
//TODO: Resolve those Problems
app.UseCors(corsPolicyName);

app.UseAuthorization();
app.UseMiddleware<GlobalErrorHandlingMiddleware>();
app.MapControllers();

app.MapGet("/", () => "Welcome to running ASP.NET Core Minimal API on AWS Lambda");

app.Run();
