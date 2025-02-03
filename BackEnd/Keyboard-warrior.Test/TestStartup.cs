using keyboard_warrior.Models;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;

namespace Keyboard_warrior.Test
{
    public class TestStartup
    {
        public IServiceCollection Services { get; } = new ServiceCollection();

        public TestStartup()
        {
            Services.AddTransient(provider =>
            {
                /*   var handler = provider.GetRequiredService<HttpMessageHandler>();*/
                var connection = new HubConnectionBuilder()
                    .WithUrl(
                        "http://localhost:5110/Play",
                        o =>
                        {
                            o.Headers.Add("Access-Control-Allow-Origin", "*");
                        }
                    )
                    .Build();

                connection.StartAsync().Wait();
                return connection;
            });

            Services.AddTransient<Utils>();
        }
    }

    [CollectionDefinition("IntegrationTest")]
    public class IntegrationTestCollection : ICollectionFixture<TestStartup> { }
}
