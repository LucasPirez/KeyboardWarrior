using keyboard_warrior.AppManager;
using keyboard_warrior.DTOs;
using keyboard_warrior.enums;
using keyboard_warrior.Exceptions;
using keyboard_warrior.Messages;
using keyboard_warrior.Models;
using keyboard_warrior.Texts;
using System.Net;

namespace keyboard_warrior.Services
{
    public class GameServices(IUsersRepository stateUsers,
        IRoomsRepository roomsState) : IGameServices 
    {
        private IUsersRepository _stateUsers = stateUsers;
        private IRoomsRepository _roomsState = roomsState;
      
        public async Task<(Room?,bool)> OnDisconected(string connectionId)
        {
            var user = await _stateUsers.GetUserByConnectionId(connectionId);
            
            if (user == null) return (null, false);
             await  _stateUsers.RemoveUser(user.UserName);

             Room room = await _roomsState.RemoveUser(user);
             var roomDTO = room.GetRoomDTO();
             int usersCount = room.GetUsersCount();

            if(usersCount == 0)
            {
                await  _roomsState.RemoveRoom(roomDTO.Id);
                return (room, true);
            }

                return (room, false);
        }

        public async Task<UserConnection?> Login(string userName, string connectionId)
        {
         bool isExist = await  _stateUsers.IsUserExist(userName);

            if(!isExist)
            {
             return   await _stateUsers.AddUser(userName, connectionId);
            }

            return null;

        }

        public async Task<RoomDTO?> CreateRoom(string userName, string roomName, string roomTextType)
        {
            UserConnection? user = await _stateUsers.GetUser(userName);
            if (user == null) throw new MyException(ResponseMessages.UserNotExist,(int)HttpStatusCode.NotFound);

            var room = await _roomsState.CreateRoom(roomName, roomTextType);

            return room ?? throw new Exception("Some error has ocurred");
        }

        public async Task<SocketResponseDTO<RoomDTO?>> JoinRoom(string roomId, string userName)
        {
            SocketResponseDTO<RoomDTO?> response = new();

            bool IsUserAdd = await _roomsState.AddUser(userName, roomId);
            var room = await _roomsState.GetRoom(roomId);

            if (room?.GetRoomDTO().State == RoomState.Playing.ToString())
            {
                return response.Send((int)HttpStatusCode.NotAcceptable,ResponseMessages.NotJoinRoomWhenIsPlaying , room.GetRoomDTO());
            }

            if (IsUserAdd && room != null)
            {
                return response.Send((int)HttpStatusCode.OK, ResponseMessages.JoinRoomSuccess, room.GetRoomDTO());
            }
            else
            {
                return response.Send((int)HttpStatusCode.InternalServerError, ResponseMessages.InternalServerError,null);

            }

        }

        public async Task<IEnumerable<RoomDTO>> GetRooms()
        {
           return await _roomsState.GetRooms();
           
        }

        public async Task<RoomDTO?> GetRoom(string roomId)
        {
            var response = await _roomsState.GetRoom(roomId);

            return response?.GetRoomDTO();
        }

        public async Task<Room?> RemoveUserRoom(string roomId, string userName)
        {
            UserConnection user = await _stateUsers.GetUser(userName) ?? throw new MyException($"User Not Found in method {nameof(RemoveUserRoom)}", (int)HttpStatusCode.NotFound);
            Room room = await _roomsState.RemoveUser(user, roomId);
            int usersCount = room.GetUsersCount();

            if (usersCount == 0)
            {
               await _roomsState.RemoveRoom(roomId);
               return null;
            }

            return room;
        }

        public async Task<bool> NotReady(string userName, string roomId)
        {
            var room = await _roomsState.GetRoom(roomId) ?? throw new Exception($"room doesn't found in method {nameof(NotReady)}");
            room.UpdateStateUser(false, userName);
            return true;
        }

        public async Task<(Room, string?)> Ready(string userName, string roomId)
        {
            var room = await _roomsState.GetRoom(roomId) ?? throw new MyException($"Room not found in method {nameof(Ready)}", (int)HttpStatusCode.NotFound);

            room.UpdateStateUser(true, userName);

            if (await theGameStarts(room))
            {
                room.SetRoomState(RoomState.Playing);
                RoomTextType roomTypeText = room.GetRoomTextType();

                return (room, await GetText(roomTypeText));
            }
            else
            {
                return (room, null);
            }
        }

        public async Task<Room> RestartRoom(string roomId)
        {
            Room roomRestarted = await _roomsState.RestartRoom(roomId) ?? throw new Exception($"room doesn't found in method {nameof(NotReady)}");

            return roomRestarted;
        }

        
           public async Task<string> GetPracticeText(string roomTextType)
        {
            RoomTextType textType;
            var text = new RandomTexts();
            if (Enum.TryParse(roomTextType, true, out textType))
            {
               return text.GetRandomText(textType);
            }
            throw new MyException($"Error getting random text in method {nameof(GetPracticeText)}", (int)HttpStatusCode.NotAcceptable);   
        }

        public async Task<string> GetText(RoomTextType roomTextType)
        {
            var text = new RandomTexts();

            return text.GetRandomText(roomTextType);
        }

        public async Task<bool> theGameStarts(Room room)
        {
            int usersCount =  room.GetUsers().Count;
            int userNotReady =  room.GetUsers().Where(u => u.Ready == false).Count();
            if(userNotReady == 0 &&
               usersCount > 1 && 
               room.GetRoomState() == RoomState.Waiting)
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
