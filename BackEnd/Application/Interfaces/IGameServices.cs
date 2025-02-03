using Application.DTOs;
using Domain.Entities;
using Domain.enums;

namespace Application.Interfaces
{
    public interface IGameServices
    {
        Task<(RoomDTO?, bool)> OnDisconected(string connectionId);

        Task<UserConnectionDto?> Login(string userName, string connectionId);

        Task<RoomDTO?> CreateRoom(string userName, string roomName, string roomTextType);

        Task<SocketResponseDTO<RoomDTO?>> JoinRoom(string roomId, string userName);

        Task<IEnumerable<RoomDTO>> GetRooms();

        Task<RoomDTO?> GetRoom(string roomId);

        Task<RoomDTO?> RemoveUserRoom(string roomId, string userName);

        Task<bool> NotReady(string userName, string roomId);

        Task<(RoomDTO, string?)> Ready(string userName, string roomId);

        Task<RoomDTO> RestartRoom(string roomId);

        Task<string> GetPracticeText(string roomTextType);

        Task<string> GetText(string roomTextType);

        Task<bool> theGameStarts(string Id);
    }
}
