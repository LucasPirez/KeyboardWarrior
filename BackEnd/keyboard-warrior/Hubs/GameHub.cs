using keyboard_warrior.AppManager;
using keyboard_warrior.DTOs;
using keyboard_warrior.enums;
using keyboard_warrior.Models;
using keyboard_warrior.Texts;
using Microsoft.AspNetCore.SignalR;
using System.Collections;
using System.Text;
using System.Text.RegularExpressions;


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

        public override async Task OnDisconnectedAsync(Exception exception)
        {

            var user = _stateUsers.GetUserByConnectionId(Context.ConnectionId);

            if (user != null)
            {

             string? roomId = _roomsState.RemoveUser(user.UserName);
                
                _stateUsers.RemoveUser(user.UserName);

                if(roomId != null)
                {
                var room = _roomsState.GetRoom(roomId)?.GetRoomDTO();
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
                if (room == null)
                {
                    await Clients.All.SendAsync("DeleteRoom", roomId);
                }
                else
                {
                    await Clients.All.SendAsync("ChangeUserInRoom", room);
                    await Clients.Group(roomId).SendAsync("hola", room);
                }
                }

            }

            await base.OnDisconnectedAsync(exception);
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

            _stateUsers.AddUser(userName, Context.ConnectionId);

            return new SocketResponseDTO()
            {
                code = 200,
                message = "User Created",
                data = true

            };
        }

        public async Task<SocketResponseDTO> CreateRoom(string userName, string roomName,string roomTextType)
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

            var room = _roomsState.CreateRoom(roomName, roomTextType);

            if(room == null) return new SocketResponseDTO
            {
                code = 500,
                message = "Some error has ocurred",
            };
           
            await Groups.AddToGroupAsync(Context.ConnectionId, room.Id);
            await Clients.All.SendAsync("CreateRoom", room);

            return new SocketResponseDTO
            {

                message = "Room Created",
                data = room
            };
        }

        public async Task<SocketResponseDTO> JoinRoom(string roomId, string userName)
        { 
            bool IsUserAdd = _roomsState.AddUser(userName, roomId);
            var room = _roomsState.GetRoom(roomId)?.GetRoomDTO();

            if(room?.State == RoomState.Playing.ToString())
            {
                return new SocketResponseDTO
                {
                    code = 401,
                    data = room,
                    message = "You can't in to room when it's playing"
                };
            }

            if (IsUserAdd && room != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, room.Id);
                await Clients.GroupExcept(roomId,Context.ConnectionId).SendAsync("hola", room);
                await Clients.AllExcept(Context.ConnectionId).SendAsync("ChangeUserInRoom", room);

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
                await Clients.Group(roomId).SendAsync("hola", room);
            }

            return new SocketResponseDTO
            {
                code = 200,
                data = true,
                message = "User removed"
            };

        }


        public async void NotReady(string userName, string roomId)
        { 
            var room = _roomsState.GetRoom(roomId);

            if (room == null) return;

            room.UpdateStateUser(false, userName);

            await Clients.Group(roomId).SendAsync("ChangeStateUser", userName, false);
        }

        public async Task Ready(string userName, string roomId)
        {
            var room = _roomsState.GetRoom(roomId);

            if (room == null) return;

            room.UpdateStateUser(true, userName);

            int usersCount = room.GetUsers().Count;
            int userNotReady = room.GetUsers().Where(u => u.Ready == false).Count();
            if(userNotReady == 0 && usersCount > 1)
            {
                room.SetRoomState(RoomState.Playing);

                IEnumerable<string> usersExcluded = room
                                                    .GetUsers()
                                                    .Select(u => u.ConnectionId);

                RoomTextType roomTypeText = room.GetRoomTextType(); 
                
                await Clients
                    .AllExcept(usersExcluded)
                    .SendAsync("StartPlayTimer", room.GetRoomDTO());
                await Clients
                    .Group(roomId)
                    .SendAsync("StartPlayTimer");

                await Task.Delay(5000);

                var texts = new RandomTexts();

             
                await Clients
                    .Group(roomId)
                    .SendAsync("StartGame", texts.GetRandomText(roomTypeText));
            }
            else
            {
                await Clients
                    .Group(roomId)
                    .SendAsync("ChangeStateUser",userName,true);
            }
        }

        public async void TextTypedPercentage(int percentage,string userName,string roomId )
        {
            await Clients.Group(roomId).SendAsync("TextTypedPercentage", userName, percentage)
        }
        public async void FinishGame(string userNameAndTimesStamp, string roomId)
        {
            await Clients.Group(roomId).SendAsync("FinishGame", userNameAndTimesStamp);
        }
 
        public async void RestartRoom(string roomId) 
        {

            Room? roomRestarted = _roomsState.RestartRoom(roomId);

            if (roomRestarted != null )
            {
                await Clients.Groups(roomId).SendAsync("RestartRoom",roomRestarted.GetRoomDTO());
                await Clients.AllExcept(roomRestarted.GetUsers().Select(u=> u.ConnectionId)).SendAsync("ChangeUserInRoom",roomRestarted.GetRoomDTO());
            }
            

        }
    }
}
