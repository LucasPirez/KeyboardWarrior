using Domain.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using TypingGame.Infrastructure.Repositories;

namespace TypingGame.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            services.AddSingleton<IRoomsRepository, RoomsRepository>();
            services.AddSingleton<IUsersRepository, UsersRepository>();

            return services;
        }
    }
}
