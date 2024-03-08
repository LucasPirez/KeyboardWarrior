using keyboard_warrior.AppManager;
using keyboard_warrior.DTOs;
using keyboard_warrior.Models;
using Microsoft.AspNetCore.SignalR;

namespace keyboard_warrior.Hubs
{
    public class GameHub(IUsersSingleton stateUsers, IRoomsSingleton roomsState) : Hub
    {
        private IUsersSingleton _stateUsers = stateUsers;
        private IRoomsSingleton _roomsState = roomsState;

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("ClientConnected", "¡Bienvenido! Estás conectado al servidor.");

            await base.OnConnectedAsync();
        }
        public SocketResponseDTO Login(string userName)
        {

            if (_stateUsers.IsUserExist(userName))
            {
                return new SocketResponseDTO()
                {
                    code = 400,
                    message = "User already exist",
                    data = false
                };
            }

            _stateUsers.AddUser(userName);

            return new SocketResponseDTO()
            {
                code = 200,
                message = "User Created",
                data = true

            };
        }

        public async Task<SocketResponseDTO> CreateRoom(string userName, string roomName)
        {
            UserConnection? user = _stateUsers.GetUser(userName);
            if (user == null)
            {
                return new SocketResponseDTO
                {
                    code = 404,
                    message = "User doesn't exist please Login again",
                };
            };
            Console.WriteLine(Context.ConnectionId);
            var room = _roomsState.CreateRoom(userName, roomName);

            if(room == null) return new SocketResponseDTO
            {
                code = 500,
                message = "Some error has ocurred",
            };

            await Clients.All.SendAsync("CreateRoom", room);
            await Groups.AddToGroupAsync(Context.ConnectionId, room.Id);

            return new SocketResponseDTO
            {

                message = "Room Created",
                data = room
            };
        }


        public SocketResponseDTO GetRooms()
        {
            return new SocketResponseDTO
            {
                code = 200,
                message = "ok",
                data = _roomsState.GetRooms()

            };
        }

        public SocketResponseDTO GetRoom(string id)
        {
            return new SocketResponseDTO
            {
                code = 200,
                message = "ok",
                data = _roomsState.GetRoom(id)?.GetRoomDTO() 
            };
        }

        public void AddUserToRoom(string username, string roomId)
        {
                _roomsState.AddUser(username, roomId);
        }

        public async Task<SocketResponseDTO> JoinRoom(string roomId, string userName)
        {

            bool IsUserAdd = _roomsState.AddUser(userName, roomId);
            var room = _roomsState.GetRoom(roomId)?.GetRoomDTO();
            Console.WriteLine(Context.ConnectionId);

            if (IsUserAdd)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId,roomId);
                await  Clients.Group(roomId).SendAsync("hola",room);
                await Clients.All.SendAsync("ChangeUserInRoom", room);

                return new SocketResponseDTO
                {
                    code = 200,
                    data = room,
                    message = "User add with exist"
                };
            }
            else
            {
                return new SocketResponseDTO
                {
                    code = 500,
                    data = false,
                    message = "Some error has ocurred"
                };
            }
        }


        public async Task<SocketResponseDTO> RemoveUserRoom(string roomId, string userName)
        {

            if (!_roomsState.RemoveUser(userName,roomId))
            {
                return new SocketResponseDTO
                {
                    code = 401,
                    data = false,
                    message = "User or Room doesn't exist"
                };
            }

            var room = _roomsState.GetRoom(roomId)?.GetRoomDTO();

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

            if (room == null)
            {
                await Clients.All.SendAsync("DeleteRoom", roomId);
            }
            else
            {
            await Clients.All.SendAsync("ChangeUserInRoom", room);
            await  Clients.Group(roomId).SendAsync("hola",room);
            }


            return new SocketResponseDTO
            {
                code = 200,
                data = true,
                message = "User removed"
            };

        }

    }
}
