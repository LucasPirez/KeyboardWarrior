using System.Net;
using Application.DTOs;
using Application.Extensions;
using Application.Interfaces;
using Domain.Entities;
using Domain.enums;
using Domain.Exceptions;
using Domain.Interfaces;
using Domain.RandomTexts;
using Shared.Constants.Messages;

namespace Application.Services
{
    public class GameServices(IUsersRepository stateUsers, IRoomsRepository roomsState)
        : IGameServices
    {
        private IUsersRepository _stateUsers = stateUsers;
        private IRoomsRepository _roomsState = roomsState;

        public async Task<(RoomDTO?, bool)> OnDisconected(string connectionId)
        {
            var user = await _stateUsers.GetUserByConnectionId(connectionId);

            if (user == null)
                return (null, false);
            await _stateUsers.RemoveUser(user.UserName);

            Room room = await _roomsState.RemoveUser(user);
            var roomDTO = room.GetRoomData();
            int usersCount = room.GetUsersCount();

            if (usersCount == 0)
            {
                await _roomsState.RemoveRoom(roomDTO.Id);
                return (room.AsDto(), true);
            }

            return (room.AsDto(), false);
        }

        public async Task<UserConnectionDto?> Login(string userName, string connectionId)
        {
            bool isExist = await _stateUsers.IsUserExist(userName);

            if (!isExist)
            {
                var r = await _stateUsers.AddUser(userName, connectionId);
                return r?.AsDto();
            }

            return null;
        }

        public async Task<RoomDTO?> CreateRoom(
            string userName,
            string roomName,
            string roomTextType
        )
        {
            UserConnection? user = await _stateUsers.GetUser(userName);
            if (user == null)
                throw new MyException(ResponseMessages.UserNotExist, (int)HttpStatusCode.NotFound);

            var room = await _roomsState.CreateRoom(roomName, roomTextType);

            return room?.AsDto() ?? throw new Exception("Some error has ocurred");
        }

        public async Task<SocketResponseDTO<RoomDTO?>> JoinRoom(string roomId, string userName)
        {
            SocketResponseDTO<RoomDTO?> response = new();

            bool IsUserAdd = await _roomsState.AddUser(userName, roomId);
            var room = await _roomsState.GetRoom(roomId);

            if (room?.GetRoomData().State == RoomState.Playing.ToString())
            {
                return response.Send(
                    (int)HttpStatusCode.NotAcceptable,
                    ResponseMessages.NotJoinRoomWhenIsPlaying,
                    room.AsDto()
                );
            }

            if (IsUserAdd && room != null)
            {
                return response.Send(
                    (int)HttpStatusCode.OK,
                    ResponseMessages.JoinRoomSuccess,
                    room.AsDto()
                );
            }
            else
            {
                return response.Send(
                    (int)HttpStatusCode.InternalServerError,
                    ResponseMessages.InternalServerError,
                    null
                );
            }
        }

        public async Task<IEnumerable<RoomDTO>> GetRooms()
        {
            var rooms = await _roomsState.GetRooms();
            return rooms.Select(x => x.AsDto());
        }

        public async Task<RoomDTO?> GetRoom(string roomId)
        {
            var response = await _roomsState.GetRoom(roomId);

            return response?.AsDto();
        }

        public async Task<RoomDTO?> RemoveUserRoom(string roomId, string userName)
        {
            UserConnection user =
                await _stateUsers.GetUser(userName)
                ?? throw new MyException(
                    $"User Not Found in method {nameof(RemoveUserRoom)}",
                    (int)HttpStatusCode.NotFound
                );
            Room room = await _roomsState.RemoveUser(user, roomId);
            int usersCount = room.GetUsersCount();

            if (usersCount == 0)
            {
                await _roomsState.RemoveRoom(roomId);
                return null;
            }

            return room.AsDto();
        }

        public async Task<bool> NotReady(string userName, string roomId)
        {
            var room =
                await _roomsState.GetRoom(roomId)
                ?? throw new Exception($"room doesn't found in method {nameof(NotReady)}");
            room.UpdateStateUser(false, userName);
            return true;
        }

        public async Task<(RoomDTO, string?)> Ready(string userName, string roomId)
        {
            var room =
                await _roomsState.GetRoom(roomId)
                ?? throw new MyException(
                    $"Room not found in method {nameof(Ready)}",
                    (int)HttpStatusCode.NotFound
                );

            room.UpdateStateUser(true, userName);

            if (await theGameStarts(room.GetRoomData().Id))
            {
                room.SetRoomState(RoomState.Playing);
                string roomTypeText = room.GetRoomData().RoomType;

                return (room.AsDto(), await GetText(roomTypeText));
            }
            else
            {
                return (room.AsDto(), null);
            }
        }

        public async Task<RoomDTO> RestartRoom(string roomId)
        {
            Room roomRestarted =
                await _roomsState.RestartRoom(roomId)
                ?? throw new Exception($"room doesn't found in method {nameof(NotReady)}");

            return roomRestarted.AsDto();
        }

        public async Task<string> GetPracticeText(string roomTextType)
        {
            RoomTextType textType;
            var text = new RandomTexts();
            if (Enum.TryParse(roomTextType, true, out textType))
            {
                return text.GetRandomText(textType);
            }
            throw new MyException(
                $"Error getting random text in method {nameof(GetPracticeText)}",
                (int)HttpStatusCode.NotAcceptable
            );
        }

        public async Task<string> GetText(string roomTextType)
        {
            var text = new RandomTexts();
            if (Enum.TryParse(roomTextType, out RoomTextType roomText))
            {
                return text.GetRandomText(roomText);
            }
            else
            {
                throw new Exception("Valor de string no valido");
            }
        }

        public async Task<bool> theGameStarts(string Id)
        {
            Room? room = await _roomsState.GetRoom(Id) ?? throw new Exception("Room not found");

            int usersCount = room.GetUsers().Count;
            int userNotReady = room.GetUsers().Where(u => u.Ready == false).Count();
            if (userNotReady == 0 && usersCount > 1 && room.GetRoomState() == RoomState.Waiting)
            {
                room.SetRoomState(RoomState.Playing);
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
