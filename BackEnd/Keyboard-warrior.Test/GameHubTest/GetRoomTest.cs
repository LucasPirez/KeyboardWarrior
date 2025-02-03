using System.Net;
using keyboard_warrior.Application.DTOs;
using keyboard_warrior.Messages;
using keyboard_warrior.Presentation.Hubs;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;

namespace Keyboard_warrior.Test.GameHubTest
{
    [Collection("IntegrationTest")]
    public class GetRoomTest
    {
        private readonly HubConnection _connection;
        private readonly Utils _utils;

        public GetRoomTest(TestStartup testStartup)
        {
            var builderService = testStartup.Services.BuildServiceProvider();

            _connection = builderService.GetRequiredService<HubConnection>();
            _utils = builderService.GetRequiredService<Utils>();
        }

        [Fact]
        public async Task GetRoom_Success()
        {
            // Arrange
            var user = await _utils.Login(_connection);
            var room = await _utils.CreateRoom(_connection, user.UserName);

            // Act
            var getRoom = await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(
                nameof(GameHub.GetRoom),
                room.Id
            );

            // Assert
            Assert.Equal((int)HttpStatusCode.OK, getRoom.Code);
            Assert.Equal(ResponseMessages.Ok, getRoom.Message);
            Assert.NotNull(getRoom.Data);
            Assert.Equal(room.Id, getRoom.Data.Id);
        }

        [Fact]
        public async Task GetRoom_ReturnNull_WhenIdNotExist()
        {
            // Arrange
            var user = await _utils.Login(_connection);
            await _utils.CreateRoom(_connection, user.UserName);

            // Act
            var getRoom = await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(
                nameof(GameHub.GetRoom),
                Guid.NewGuid()
            );

            // Assert
            Assert.Null(getRoom.Data);
        }
    }
}
