using keyboard_warrior.AppManager;
using keyboard_warrior.DTOs;
using keyboard_warrior.enums;

namespace keyboard_warrior.Services
{
    public interface IGameHubServices
    {
        Task<(RoomDTO?,bool)> OnDisconected(string connectionId);

        Task<bool> Login(string userName,string connectionId);

        Task<RoomDTO?> CreateRoom(string userName, string roomName, string roomTextType);

        Task<SocketResponseDTO<RoomDTO?>> JoinRoom(string roomId, string userName);

        Task<IEnumerable<RoomDTO>> GetRooms();

        Task<RoomDTO?> GetRoom(string roomId);

        Task<RoomDTO?> RemoveUserRoom(string roomId, string userName);

        Task<bool> NotReady(string userName, string roomId);

        Task<(Room,string?)> Ready(string userName, string roomId);

        Task<Room> RestartRoom(string roomId);

        Task<string> GetPracticeText(string roomTextType);
        Task<string> GetText(RoomTextType roomTextType);
    }
}
