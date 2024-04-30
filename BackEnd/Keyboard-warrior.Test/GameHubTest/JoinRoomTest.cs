using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Xunit.Abstractions;
using keyboard_warrior.Hubs;
using keyboard_warrior.DTOs;
using keyboard_warrior.enums;
using keyboard_warrior.Messages;
using System.Net;

namespace Keyboard_warrior.Test.GameHubTest
{
    [Collection("IntegrationTest")]
    public class JoinRoomTest
    {
        private readonly HubConnection _connection;
        private readonly ITestOutputHelper _output;
        private readonly Utils _utils;

        public JoinRoomTest(TestStartup testStartup, ITestOutputHelper testOutputHelper) 
        {
            var builderService = testStartup.Services.BuildServiceProvider();

            _connection = builderService.GetRequiredService<HubConnection>();  
            _output = testOutputHelper;
            _utils = builderService.GetRequiredService<Utils>();
        }

        [Fact]
        public async Task JoinRoom_Success()
        {
            // arrange
            var roomTextType = RoomTextType.NormalText.ToString();
            var user = await _utils.Login(_connection);
            var roomCreated = await _utils.CreateRoom(_connection, user.UserName, roomTextType);

            //act
            var joinRoom = await _connection
                .InvokeAsync<SocketResponseDTO<RoomDTO?>>(nameof(GameHub.JoinRoom),roomCreated.Id, user.UserName);

            //assert
            Assert.NotNull(joinRoom.Data);
            Assert.Equal(user.UserName,
                    joinRoom.Data?.ListUser.FirstOrDefault(u => u.UserName == user.UserName)?.UserName
                    );
            Assert.Equal(roomCreated.Name, joinRoom.Data?.Name);
            Assert.Equal(ResponseMessages.JoinRoomSuccess,joinRoom?.Message);

        }

        [Fact]
        public async Task JoinRoom_Denied_WhenIsPlaying()
        {
            // arrange
            var roomTextType = RoomTextType.NormalText.ToString();

          var firstUser = await _utils.Login(_connection);
          var secondUser =  await _utils.Login(_connection);
          var thirdUser =  await _utils.Login(_connection);

            var roomCreated = await _utils.CreateRoom(_connection,firstUser.UserName,roomTextType);

            //joinRooms first and second Users

           await _connection
                .InvokeAsync<SocketResponseDTO<RoomDTO?>>(nameof(GameHub.JoinRoom), roomCreated.Id, firstUser.UserName);
         await   Task.Delay(400);
          await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(nameof(GameHub.JoinRoom), roomCreated.Id, secondUser.UserName);

            //ready to play first and second Users
            await _connection
                .SendAsync(nameof(GameHub.Ready), firstUser.UserName, roomCreated.Id);

            await _connection.SendAsync(nameof(GameHub.Ready),secondUser.UserName, roomCreated.Id);

            //act
            var responseJoin = await _connection
              .InvokeAsync<SocketResponseDTO<RoomDTO?>>(nameof(GameHub.JoinRoom), roomCreated.Id, thirdUser.UserName);

            //assert
            Assert.Equal((int)HttpStatusCode.NotAcceptable, responseJoin.Code);
            Assert.Equal(ResponseMessages.NotJoinRoomWhenIsPlaying, responseJoin.Message);

        }

    }
}
