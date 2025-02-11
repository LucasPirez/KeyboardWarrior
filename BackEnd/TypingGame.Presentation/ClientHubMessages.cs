﻿using Application.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.SignalR;
using TypingGame.Presentation.Hubs;

namespace TypingGame.Presentation
{
    public class ClientHubMessages(IHubContext<GameHub> hubContext) : IClientHubMessages
    {
        private readonly IHubContext<GameHub> _hubContext = hubContext;

        public async Task SendRoomData(string roomId, string connectionId, RoomDTO data)
        {
            await _hubContext.Clients.GroupExcept(roomId, connectionId).SendAsync("RoomData", data);
        }

        public async Task DeleteRoom(string roomId)
        {
            await _hubContext.Clients.All.SendAsync("DeleteRoom", roomId);
        }

        public async Task ChangeStateUser(string roomId, string userName, bool boolean)
        {
            await _hubContext.Clients.Group(roomId).SendAsync("ChangeStateUser", userName, boolean);
        }

        public async Task CreateRoom(RoomDTO room)
        {
            await _hubContext.Clients.All.SendAsync("CreateRoom", room);
        }

        public async Task JoinRoom(string connectionId, RoomDTO room)
        {
            await SendRoomData(room.Id, connectionId, room);

            await _hubContext.Clients.AllExcept(connectionId).SendAsync("ChangeUserInRoom", room);
        }

        public async Task RemoveUserRoom(string connectionId, RoomDTO room)
        {
            await _hubContext.Clients.AllExcept(connectionId).SendAsync("ChangeUserInRoom", room);

            await SendRoomData(room.Id, connectionId, room);
        }

        public async Task RestartRoom(string roomId, RoomDTO room)
        {
            await _hubContext.Clients.Groups(roomId).SendAsync("RestartRoom", room);

            await _hubContext
                .Clients.AllExcept(room.ListUser.Select(u => u.ConnectionId))
                .SendAsync("ChangeUserInRoom", room);
        }

        public async Task TextTypedPercentage(string roomId, string userName, int percentage)
        {
            await _hubContext
                .Clients.Group(roomId)
                .SendAsync("TextTypedPercentage", userName, percentage);
        }

        public async Task FinishGame(string roomId, string userNameAndTimesStamp)
        {
            await _hubContext.Clients.Group(roomId).SendAsync("FinishGame", userNameAndTimesStamp);
        }

        public async Task StartPlayTimer(IEnumerable<string> usersExcluded, RoomDTO room)
        {
            await _hubContext.Clients.AllExcept(usersExcluded).SendAsync("StartPlayTimer", room);

            await _hubContext.Clients.Group(room.Id).SendAsync("StartPlayTimer");
        }

        public async Task StartGame(string roomId, string text)
        {
            await _hubContext.Clients.Group(roomId).SendAsync("StartGame", text);
        }
    }
}
