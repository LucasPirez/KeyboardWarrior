using keyboard_warrior.DTOs;
using keyboard_warrior.enums;
using keyboard_warrior.Hubs;
using keyboard_warrior.Messages;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using Xunit.Abstractions;

namespace Keyboard_warrior.Test.GameHubTest
{
    [Collection("IntegrationTest")]
    public class CreateRoomTest
    {
        private readonly HubConnection _connection;
        private readonly string _methodName = nameof(GameHub.CreateRoom);
        private readonly string _loginName = nameof(GameHub.Login);
       

        private readonly ITestOutputHelper _output;

        public CreateRoomTest(TestStartup testStartup,ITestOutputHelper testOutputHelper)
        {
            _connection = testStartup.Services.BuildServiceProvider().GetRequiredService<HubConnection>();
            _output = testOutputHelper;
            _output.WriteLine(_connection.ConnectionId);
        }

        [Fact]
        public async Task CreateRoom_Success()
        {
            string roomName = "Room1";
            string roomTextType = RoomTextType.Javascript.ToString();
            string userName = "userCreateRoom";

            await _connection.InvokeAsync(_loginName, userName);
            var response = await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(_methodName, userName, roomName,roomTextType);

            _output.WriteLine("response '{0}'", response.Data?.Name);
            Assert.Equal((int)HttpStatusCode.OK, response.Code);
            Assert.Equal(ResponseMessages.RoomCreated, response.Message);
            Assert.Equal("Room1", response.Data?.Name ?? "");
            _output.WriteLine(_connection.ConnectionId);


        }
        [Fact]
        public async Task CreateRoomUnhautorizedUser_Return404()
        {
            string roomName = "Room1";
            string roomTextType = RoomTextType.Javascript.ToString();
            string userName = "userCreateRoom";

            var response = await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(_methodName, userName, roomName, roomTextType);

            _output.WriteLine("response '{0}'", response.Code);
            Assert.Equal((int)HttpStatusCode.NotFound, response.Code);
            Assert.Equal(ResponseMessages.UserNotExist, response.Message);
            Assert.Null(response.Data);
            _output.WriteLine(_connection.ConnectionId);

        }

    }
}
