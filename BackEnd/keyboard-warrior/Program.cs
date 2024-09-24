using keyboard_warrior.AppManager;
using keyboard_warrior.Hubs;
using keyboard_warrior.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddLogging();
builder.Services.AddSignalR();
builder.Services.AddControllersWithViews();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder.WithOrigins("https://speedytype-gamma.vercel.app")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Services.AddSingleton<IRoomsRepository, RoomsRepository>();
builder.Services.AddSingleton<IUsersRepository, UsersRepository>();

builder.Services.AddScoped<IGameServices, GameServices>();
builder.Services.AddScoped<IClientHubMessagesService, ClientHubServices>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors("CorsPolicy");

app.MapHub<GameHub>("/Play");

app.Run();
