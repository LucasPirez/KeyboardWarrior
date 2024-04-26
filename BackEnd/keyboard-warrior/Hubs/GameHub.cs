using keyboard_warrior.AppManager;
using keyboard_warrior.DTOs;
using keyboard_warrior.Exceptions;
using keyboard_warrior.Messages;
using keyboard_warrior.Services;
using Microsoft.AspNetCore.SignalR;
using System.Net;


namespace keyboard_warrior.Hubs
{
    public class GameHub(IGameHubServices gameHubServices,ILogger<GameHub> logger) : Hub
    {
        private IGameHubServices _gameHubServices = gameHubServices;
        private ILogger<GameHub> _logger = logger;

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("ClientConnected", "¡Bienvenido! Estás conectado al servidor.");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                var (room,deleted) = await _gameHubServices.OnDisconected(Context.ConnectionId);

                if (room != null)
                {
                var roomDTO = room.GetRoomDTO();
                if (!deleted)
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomDTO.Id);
                    await Clients.All.SendAsync("ChangeUserInRoom", roomDTO);
                    await Clients.Group(roomDTO.Id).SendAsync("RoomData", roomDTO);

                    if(await _gameHubServices.theGameStarts(room))
                        {
                            await StartGame(room);
                        }
                }
                else
                {
                    await Clients.All.SendAsync("DeleteRoom", roomDTO.Id);
                }
                }
                
            await base.OnDisconnectedAsync(exception);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
            
        }

        public async Task<SocketResponseDTO<bool>> Login(string userName)
        {
            SocketResponseDTO<bool> response = new();
            try
            {

            if (await _gameHubServices.Login(userName, Context.ConnectionId))
            {  
             return response.Send((int)HttpStatusCode.Conflict,ResponseMessages.UserNameExist, false ); 
            }

                return response.Send((int)HttpStatusCode.OK, ResponseMessages.LoginSucces, true);
            }     
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return response.Send((int)HttpStatusCode.InternalServerError, e.Message, false);
            }
        }

        public async Task<SocketResponseDTO<RoomDTO?>> CreateRoom(string userName, string roomName,string roomTextType)
        {
            SocketResponseDTO<RoomDTO?> response = new();

            try
            {
                RoomDTO? roomDTO = await _gameHubServices.CreateRoom(userName,roomName,roomTextType);
         
                await Groups.AddToGroupAsync(Context.ConnectionId, roomDTO.Id);
                await Clients.All.SendAsync("CreateRoom", roomDTO);

                return response.Send((int)HttpStatusCode.OK, ResponseMessages.RoomCreated, roomDTO);
            }
            catch (MyException e)
            {
                _logger.LogError(e, e.Message);
                return response.Send(e.ErrorCode, e.Message,null);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return response.Send((int)HttpStatusCode.InternalServerError, e.Message,null);
            }
        }

        public async Task<SocketResponseDTO<RoomDTO?>> JoinRoom(string roomId, string userName)
        {
            try
            {
                var service = await _gameHubServices.JoinRoom(roomId, userName);

                if (service.Code == (int)HttpStatusCode.OK && service.Data != null)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, service.Data.Id);
                    await Clients.GroupExcept(roomId, Context.ConnectionId).SendAsync("RoomData", service.Data);
                    await Clients.AllExcept(Context.ConnectionId).SendAsync("ChangeUserInRoom", service.Data);
                }
                return service;
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new SocketResponseDTO<RoomDTO?>((int)HttpStatusCode.InternalServerError, e.Message,null);
            }
        }

        public async Task<SocketResponseDTO<IEnumerable<RoomDTO>?>> GetRooms()
        {
            try
            {
            var service = await _gameHubServices.GetRooms();
            return new SocketResponseDTO<IEnumerable<RoomDTO>?>((int)HttpStatusCode.OK, ResponseMessages.Ok, service);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new SocketResponseDTO<IEnumerable<RoomDTO>?>((int)HttpStatusCode.InternalServerError, e.Message, null);
            }
        }

        public async Task<SocketResponseDTO<RoomDTO?>> GetRoom(string id)
        {
            try
            {

            var service = await _gameHubServices.GetRoom(id);
            return new SocketResponseDTO<RoomDTO?>((int)HttpStatusCode.OK, ResponseMessages.Ok, service);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new SocketResponseDTO<RoomDTO?>((int)HttpStatusCode.InternalServerError, e.Message, null);
            }

        }


        public async Task<SocketResponseDTO<bool>> RemoveUserRoom(string roomId, string userName)
        {
            try
            {
                var room = await _gameHubServices.RemoveUserRoom(roomId, userName);

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

                if (room == null)
                {
                    await Clients.All.SendAsync("DeleteRoom", roomId);
                    return  new SocketResponseDTO<bool>((int)HttpStatusCode.OK, ResponseMessages.UserRemoved, true);
                }

                await Clients.All.SendAsync("ChangeUserInRoom", room.GetRoomDTO());
                await Clients.Group(roomId).SendAsync("RoomData", room.GetRoomDTO());

                if (await _gameHubServices.theGameStarts(room))
                {
                    await StartGame(room);
                }

                return new SocketResponseDTO<bool>((int)HttpStatusCode.OK, ResponseMessages.UserRemoved, true);

            }
            catch(MyException e)
            {
                _logger.LogError(e, e.Message);
                return new SocketResponseDTO<bool>(e.ErrorCode, e.Message, false);

            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new SocketResponseDTO<bool>((int)HttpStatusCode.InternalServerError, e.Message, false);
            }

        }


        public async Task NotReady(string userName, string roomId)
        {
            try
            {
            await _gameHubServices.NotReady(userName,roomId);
            await Clients.Group(roomId).SendAsync("ChangeStateUser", userName, false);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        }

        public async Task Ready(string userName, string roomId)
        {
            try
            {
                var (room, text) = await _gameHubServices.Ready(userName, roomId);
                
            if(text != null)
            {
                    await StartGame(room);
            }
            else
            {
                await Clients
                    .Group(roomId)
                    .SendAsync("ChangeStateUser",userName,true);
            }
            }
            catch(MyException ex)
            {
                _logger.LogError(ex, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        }

        public async void TextTypedPercentage(int percentage,string userName,string roomId )
        {
            await Clients.Group(roomId).SendAsync("TextTypedPercentage", userName, percentage);
        }
        public async void FinishGame(string userNameAndTimesStamp, string roomId)
        {
            await Clients.Group(roomId).SendAsync("FinishGame", userNameAndTimesStamp);
        }
 
        public async Task RestartRoom(string roomId) 
        {
            try
            {

            Room roomRestarted = await _gameHubServices.RestartRoom(roomId);

                await Clients.Groups(roomId)
                             .SendAsync("RestartRoom",roomRestarted.GetRoomDTO());
                await Clients.AllExcept(roomRestarted.GetUsers().Select(u=> u.ConnectionId))
                             .SendAsync("ChangeUserInRoom",roomRestarted.GetRoomDTO());
            }   
            catch(Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
            

        }

        public async Task<SocketResponseDTO<string?>> GetPracticeText(string roomTextType)
        {
            SocketResponseDTO<string?> response = new();

            try
            {
            var text = await _gameHubServices.GetPracticeText(roomTextType);

            return    response.Send((int)HttpStatusCode.OK, "Text receive", text);

            }
            catch(MyException ex)
            {
                _logger.LogError(ex, ex.Message);
                return response.Send(ex.ErrorCode, ex.Message, null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return response.Send((int)HttpStatusCode.InternalServerError, ex.Message, null);
            }
        }


        private async Task StartGame(Room room)
        {
            RoomDTO roomDTO = room.GetRoomDTO();

            IEnumerable<string> usersExcluded = room
                                               .GetUsers()
                                               .Select(u => u.ConnectionId);
            await Clients
                .AllExcept(usersExcluded)
                .SendAsync("StartPlayTimer", roomDTO);
            await Clients
                .Group(roomDTO.Id)
                .SendAsync("StartPlayTimer");

            var text = await _gameHubServices.GetText(room.GetRoomTextType());

            await Task.Delay(3000);

            await Clients
            .Group(roomDTO.Id)
                .SendAsync("StartGame", text);
        }
    }
}
