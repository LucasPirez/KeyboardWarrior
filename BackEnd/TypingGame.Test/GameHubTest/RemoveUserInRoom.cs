using Application.DTOs;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using TypingGame.Presentation.Hubs;
using TypingGame.Shared.Constants.Messages;
using TypingGame.Test;
using Xunit.Abstractions;

namespace TypingGame.Test.GameHubTest
{
    [Collection("IntegrationTest")]
    public class RemoveUserInRoom
    {
        private readonly HubConnection _connection;
        private readonly Utils _utils;
        private readonly ITestOutputHelper _output;

        public RemoveUserInRoom(TestStartup testStartup, ITestOutputHelper testOutputHelper)
        {
            var serviceBuilder = testStartup.Services.BuildServiceProvider();

            _connection = serviceBuilder.GetRequiredService<HubConnection>();
            _utils = serviceBuilder.GetRequiredService<Utils>();
            _output = testOutputHelper;
        }

        [Fact]
        public async Task RemoveUserInRoom_Success()
        {
            // Arrange
            int countUsers = 2;
            string roomId = await CreateRoomWithUsers(countUsers, _connection);
            var room = await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(
                nameof(GameHub.GetRoom),
                roomId
            );

            Assert.NotNull(room?.Data); //if null check GetRoom SignalR method

            var userToDelete = room.Data.ListUser[1];

            // Act
            await _connection.InvokeAsync<SocketResponseDTO<bool>>(
                nameof(GameHub.RemoveUserRoom),
                roomId,
                userToDelete.UserName
            );
            var roomWithUserDeleted = await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(
                nameof(GameHub.GetRoom),
                roomId
            );

            // Assert
            Assert.NotNull(roomWithUserDeleted?.Data); //if null check GetRoom SignalR method

            Assert.Null(
                roomWithUserDeleted.Data.ListUser.FirstOrDefault(u =>
                    u.UserName == userToDelete?.UserName
                )
            );
            Assert.True(roomWithUserDeleted.Data.ListUser.Count == countUsers - 1);
        }

        [Fact]
        public async Task DeleteRoom_WhenLastUserRemove()
        {
            int countUsers = 2;
            string roomId = await CreateRoomWithUsers(countUsers, _connection);
            var room = await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(
                nameof(GameHub.GetRoom),
                roomId
            );

            Assert.NotNull(room?.Data); //if null check GetRoom SignalR method
            await RemoveAllUsers(room.Data);

            // Act

            var roomDeleted = await _connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(
                nameof(GameHub.GetRoom),
                roomId
            );

            // Assert
            Assert.NotNull(roomDeleted);
            Assert.Null(roomDeleted.Data);
            Assert.Equal(ResponseMessages.Ok, roomDeleted.Message);
        }

        private async Task<bool> RemoveAllUsers(RoomDTO roomDTO)
        {
            for (var i = 0; i < roomDTO.ListUser.Count; i++)
            {
                var response = await _connection.InvokeAsync<SocketResponseDTO<bool>>(
                    nameof(GameHub.RemoveUserRoom),
                    roomDTO.Id,
                    roomDTO.ListUser[i].UserName
                );

                if (!response.Data)
                    throw new Exception($"Error in {nameof(RemoveAllUsers)}");
            }

            return true;
        }

        private async Task<string> CreateRoomWithUsers(int countUsers, HubConnection connection)
        {
            RoomDTO? room = null;

            for (int i = 0; i < countUsers; i++)
            {
                var user = await _utils.Login(connection);

                room ??= await _utils.CreateRoom(connection, user.UserName);

                await connection.InvokeAsync(nameof(GameHub.JoinRoom), room.Id, user.UserName);
            }

            if (room == null)
                throw new Exception($"room is null in {nameof(CreateRoomWithUsers)}");

            return room.Id;
        }
    }
}
