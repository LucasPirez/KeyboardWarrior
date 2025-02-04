using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IRoomsRepository
    {
        Task<IEnumerable<Room>> GetRooms();

        Task<Room?> GetRoom(string id);

        Task<Room?> CreateRoom(string roomName, string typeTextRoom);

        Task<IEnumerable<Room>> RemoveRoom(string roomId);

        Task<bool> AddUser(string user, string roomId);

        Task<Room> RemoveUser(UserConnection user, string roomId);
        Task<Room> RemoveUser(UserConnection user);

        Task<Room?> RestartRoom(string roomId);
    }
}
