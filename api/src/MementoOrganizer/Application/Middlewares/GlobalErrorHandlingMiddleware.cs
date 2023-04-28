using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace MementoOrganizer.Application.Middlewares;

public class GlobalErrorHandlingMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception e)
        {
            //TODO: Create a Better Exception Handler
            var development = Environment.GetEnvironmentVariable("mementoIsDevelopment");

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            context.Response.ContentType = "application/error+json";

            ProblemDetails details = new ProblemDetails
            {
                Title = "Execution Exception",
                Status = 500,
                Detail = development != null ? e.ToString() : e.Message
            };

            var jsonDetails = JsonSerializer.Serialize(details);
            await context.Response.WriteAsync(jsonDetails);
        }
    }
}
