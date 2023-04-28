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


string region = Environment.GetEnvironmentVariable("AWS_REGION") ?? RegionEndpoint.USEast2.SystemName;

// Add AWS Lambda support. When running the application as an AWS Serverless application, Kestrel is replaced
// with a Lambda function contained in the Amazon.Lambda.AspNetCoreServer package, which marshals the request into the ASP.NET Core hosting framework.
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);


var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseMiddleware<GlobalErrorHandlingMiddleware>();
app.MapControllers();

app.MapGet("/", () => "Welcome to running ASP.NET Core Minimal API on AWS Lambda");

app.Run();
