using Domain.Interfaces;
using Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
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
