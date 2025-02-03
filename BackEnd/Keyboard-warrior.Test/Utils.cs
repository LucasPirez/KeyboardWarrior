using keyboard_warrior.Application.DTOs;
using keyboard_warrior.Domain.enums;
using keyboard_warrior.Presentation.Hubs;
using Microsoft.AspNetCore.SignalR.Client;

namespace Keyboard_warrior.Test
{
    public class Utils
    {
        public async Task<UserDTO> Login(HubConnection connection)
        {
            var userName = Guid.NewGuid().ToString("N");
            var response = await connection.InvokeAsync<SocketResponseDTO<UserDTO?>>(
                nameof(GameHub.Login),
                userName
            );

            if (response?.Data == null)
            {
                throw new Exception($"Error to login in {nameof(Utils)} class");
            }

            return response.Data;
        }

        public async Task<RoomDTO> CreateRoom(
            HubConnection connection,
            string userName,
            string roomTextType
        )
        {
            var roomName = Guid.NewGuid().ToString("N");

            var response = await connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(
                nameof(GameHub.CreateRoom),
                userName,
                roomName,
                roomTextType
            );

            if (response?.Data == null)
            {
                throw new Exception($"Error to CreateRoom at {nameof(Utils)} class");
            }

            return response.Data;
        }

        public async Task<RoomDTO> CreateRoom(HubConnection connection, string userName)
        {
            var roomName = Guid.NewGuid().ToString("N");

            var response = await connection.InvokeAsync<SocketResponseDTO<RoomDTO?>>(
                nameof(GameHub.CreateRoom),
                userName,
                roomName,
                RoomTextType.Javascript.ToString()
            );

            if (response?.Data == null)
            {
                throw new Exception($"Error to CreateRoom at {nameof(Utils)} class");
            }

            return response.Data;
        }
    }
}
