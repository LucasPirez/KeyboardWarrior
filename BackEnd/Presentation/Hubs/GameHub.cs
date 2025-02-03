using System.Net;
using Application.DTOs;
using Application.Extensions;
using Application.Interfaces;
using Domain.Exceptions;
using Microsoft.AspNetCore.SignalR;
using Shared.Constants.Messages;

namespace Presentation.Hubs
{
    public class GameHub(
        IGameServices gameHubServices,
        ILogger<GameHub> logger,
        IClientHubMessages clientHubServices
    ) : Hub
    {
        private readonly IGameServices _gameHubServices = gameHubServices;
        private readonly ILogger<GameHub> _logger = logger;
        private readonly IClientHubMessages _clientHubServices = clientHubServices;

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync(
                "ClientConnected",
                "¡Bienvenido! Estás conectado al servidor."
            );

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            try
            {
                var (room, deleted) = await _gameHubServices.OnDisconected(Context.ConnectionId);

                if (room != null)
                {
                    if (!deleted)
                    {
                        await Groups.RemoveFromGroupAsync(Context.ConnectionId, room.Id);
                        await _clientHubServices.RemoveUserRoom(Context.ConnectionId, room);

                        if (await _gameHubServices.theGameStarts(room.Id))
                        {
                            await StartGame(room);
                        }
                    }
                    else
                    {
                        await _clientHubServices.DeleteRoom(room.Id);
                    }
                }

                await base.OnDisconnectedAsync(exception);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        }

        public async Task<SocketResponseDTO<UserDTO?>> Login(string userName)
        {
            SocketResponseDTO<UserDTO?> response = new();
            try
            {
                UserConnectionDto? user = await _gameHubServices.Login(
                    userName,
                    Context.ConnectionId
                );
                if (user == null)
                {
                    return response.Send(
                        (int)HttpStatusCode.Conflict,
                        ResponseMessages.UserNameExist,
                        null
                    );
                }
                UserDTO userDTO = new() { UserName = user.UserName, Id = user.Id };

                return response.Send((int)HttpStatusCode.OK, ResponseMessages.LoginSucces, userDTO);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return response.Send((int)HttpStatusCode.InternalServerError, e.Message, null);
            }
        }

        public async Task<SocketResponseDTO<RoomDTO?>> CreateRoom(
            string userName,
            string roomName,
            string roomTextType
        )
        {
            SocketResponseDTO<RoomDTO?> response = new();

            try
            {
                RoomDTO? roomDTO = await _gameHubServices.CreateRoom(
                    userName,
                    roomName,
                    roomTextType
                );

                await Groups.AddToGroupAsync(Context.ConnectionId, roomDTO.Id);
                await _clientHubServices.CreateRoom(roomDTO);

                return response.Send((int)HttpStatusCode.OK, ResponseMessages.RoomCreated, roomDTO);
            }
            catch (MyException e)
            {
                _logger.LogError(e, e.Message);
                return response.Send(e.ErrorCode, e.Message, null);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return response.Send((int)HttpStatusCode.InternalServerError, e.Message, null);
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
                    await _clientHubServices.JoinRoom(Context.ConnectionId, service.Data);
                }
                return service;
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new SocketResponseDTO<RoomDTO?>(
                    (int)HttpStatusCode.InternalServerError,
                    e.Message,
                    null
                );
            }
        }

        public async Task<SocketResponseDTO<IEnumerable<RoomDTO>?>> GetRooms()
        {
            try
            {
                var service = await _gameHubServices.GetRooms();
                return new SocketResponseDTO<IEnumerable<RoomDTO>?>(
                    (int)HttpStatusCode.OK,
                    ResponseMessages.Ok,
                    service
                );
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new SocketResponseDTO<IEnumerable<RoomDTO>?>(
                    (int)HttpStatusCode.InternalServerError,
                    e.Message,
                    null
                );
            }
        }

        public async Task<SocketResponseDTO<RoomDTO?>> GetRoom(string id)
        {
            try
            {
                var service = await _gameHubServices.GetRoom(id);
                return new SocketResponseDTO<RoomDTO?>(
                    (int)HttpStatusCode.OK,
                    ResponseMessages.Ok,
                    service
                );
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new SocketResponseDTO<RoomDTO?>(
                    (int)HttpStatusCode.InternalServerError,
                    e.Message,
                    null
                );
            }
        }

        public async Task<SocketResponseDTO<bool>> RemoveUserRoom(string roomId, string userName)
        {
            Console.WriteLine("countetadoro");
            try
            {
                var room = await _gameHubServices.RemoveUserRoom(roomId, userName);

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

                if (room == null)
                {
                    await _clientHubServices.DeleteRoom(roomId);
                    return new SocketResponseDTO<bool>(
                        (int)HttpStatusCode.OK,
                        ResponseMessages.UserRemoved,
                        true
                    );
                }

                await _clientHubServices.RemoveUserRoom(Context.ConnectionId, room);

                if (await _gameHubServices.theGameStarts(room.Id))
                {
                    await StartGame(room);
                }

                return new SocketResponseDTO<bool>(
                    (int)HttpStatusCode.OK,
                    ResponseMessages.UserRemoved,
                    true
                );
            }
            catch (MyException e)
            {
                _logger.LogError(e, e.Message);
                return new SocketResponseDTO<bool>(e.ErrorCode, e.Message, false);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new SocketResponseDTO<bool>(
                    (int)HttpStatusCode.InternalServerError,
                    e.Message,
                    false
                );
            }
        }

        public async Task NotReady(string userName, string roomId)
        {
            try
            {
                await _gameHubServices.NotReady(userName, roomId);
                await _clientHubServices.ChangeStateUser(roomId, userName, false);
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

                if (text != null)
                {
                    await StartGame(room);
                }
                else
                {
                    await _clientHubServices.ChangeStateUser(roomId, userName, true);
                }
            }
            catch (MyException ex)
            {
                _logger.LogError(ex, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
            }
        }

        public async void TextTypedPercentage(int percentage, string userName, string roomId)
        {
            await _clientHubServices.TextTypedPercentage(roomId, userName, percentage);
        }

        public async void FinishGame(string userNameAndTimesStamp, string roomId)
        {
            await _clientHubServices.FinishGame(roomId, userNameAndTimesStamp);
        }

        public async Task RestartRoom(string roomId)
        {
            try
            {
                RoomDTO roomRestarted = await _gameHubServices.RestartRoom(roomId);

                await _clientHubServices.RestartRoom(roomId, roomRestarted);
            }
            catch (Exception ex)
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

                return response.Send((int)HttpStatusCode.OK, "Text receive", text);
            }
            catch (MyException ex)
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

        private async Task StartGame(RoomDTO room)
        {
            IEnumerable<string> usersExcluded = room.ListUser.Select(u => u.ConnectionId);

            await _clientHubServices.StartPlayTimer(usersExcluded, room);

            var text = await _gameHubServices.GetText(room.RoomType);

            await Task.Delay(3000);

            await _clientHubServices.StartGame(room.Id, text);
        }
    }
}
