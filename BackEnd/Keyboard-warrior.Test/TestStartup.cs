using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;


namespace Keyboard_warrior.Test
{
    public class TestStartup
    {
        public IServiceCollection Services { get; }

        public TestStartup()
        {
            Services = new ServiceCollection();
            Services.AddScoped( provider =>
            {
             /*   var handler = provider.GetRequiredService<HttpMessageHandler>();*/
                var connection = new HubConnectionBuilder()
                    .WithUrl("https://localhost:7088/Play", o =>
                    {
                        o.Headers.Add("Access-Control-Allow-Origin", "*");
                    })
                    .Build();

                connection.StartAsync().Wait();
                return connection;
            });
        }
    }
    [CollectionDefinition("IntegrationTest")]
    public class IntegrationTestCollection : ICollectionFixture<TestStartup> { }
}
