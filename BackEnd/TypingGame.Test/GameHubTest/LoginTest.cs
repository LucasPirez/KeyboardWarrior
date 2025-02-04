using System.Net;
using Application.DTOs;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using TypingGame.Presentation.Hubs;
using TypingGame.Shared.Constants.Messages;

namespace TypingGame.Test.GameHubTest
{
    [Collection("IntegrationTest")]
    public class LoginTest
    {
        private readonly HubConnection _connection;
        private readonly HubConnection _secondConnection;
        private readonly string _methodName = nameof(GameHub.Login);

        public LoginTest(TestStartup fixture)
        {
            _connection = fixture
                .Services.BuildServiceProvider()
                .GetRequiredService<HubConnection>();
            _secondConnection = fixture
                .Services.BuildServiceProvider()
                .GetRequiredService<HubConnection>();
        }

        [Fact]
        public async Task LoginUser_ReturnsOkStatus()
        {
            string message = "user1";
            var response = await _connection.InvokeAsync<SocketResponseDTO<UserDTO>>(
                _methodName,
                message
            );

            Assert.Equal((int)HttpStatusCode.OK, response.Code);
            Assert.Equal(ResponseMessages.LoginSucces, response.Message);
            Assert.Equal(message, response.Data?.UserName);
        }

        [Fact]
        public async Task LoginDuplicatedUserName_Returns409Status()
        {
            string message = "user2";
            await _secondConnection.InvokeAsync(_methodName, message);

            var response = await _connection.InvokeAsync<SocketResponseDTO<UserDTO>>(
                _methodName,
                message
            );

            Assert.Equal((int)HttpStatusCode.Conflict, response.Code);
            Assert.Equal(ResponseMessages.UserNameExist, response.Message);
            Assert.Null(response.Data);
        }
    }
}
