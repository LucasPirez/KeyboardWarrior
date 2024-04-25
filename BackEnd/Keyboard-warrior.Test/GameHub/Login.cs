

using keyboard_warrior.DTOs;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using Xunit.Abstractions;


namespace Keyboard_warrior.Test.GameHub
{
    [Collection("IntegrationTest")]
    public class Login
    {
        private readonly HubConnection _connection;
        private readonly ITestOutputHelper _output;
        private readonly string _methodName = "Login";
     
        public Login(TestStartup fixture,ITestOutputHelper testOutputHelper)
        {
            _connection = fixture.Services.BuildServiceProvider().GetRequiredService<HubConnection>();
            _output = testOutputHelper; 
         
        }


        [Fact]
        public async Task LoginUser_ReturnsOkStatus()
        {
            string message = "user1";
            var response =  await _connection.InvokeAsync<SocketResponseDTO<bool>>(_methodName, message);

            Assert.Equal((int)HttpStatusCode.OK,response.Code);
            Assert.Equal("User Created",response.Message);
            Assert.True(response.Data);
        }

        [Fact]
        public async Task LoginDuplicatedUserName_Returns409Status()
        {  
            string message = "user2";
            await _connection.InvokeAsync(_methodName, message);

            var response = await _connection.InvokeAsync<SocketResponseDTO<bool>>(_methodName, message);
            
            Assert.Equal((int)HttpStatusCode.Conflict, response.Code);
            Assert.Equal("User already exist", response.Message);
            Assert.False(response.Data);
        }
    }
}