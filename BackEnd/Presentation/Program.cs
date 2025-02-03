using Application;
using Infrastructure;
using Presentation;
using Presentation.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddLogging();
builder.Services.AddSignalR();
builder.Services.AddControllersWithViews();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "CorsPolicy",
        builder =>
            builder
                .WithOrigins(["http://localhost:5173", "https://speedytype-gamma.vercel.app"])
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
    );
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure();

builder.Services.AddScoped<IClientHubMessages, ClientHubMessages>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.UseSwagger();
    //app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("CorsPolicy");

app.MapHub<GameHub>("/Play");

app.Run();
