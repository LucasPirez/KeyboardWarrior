using keyboard_warrior.DTOs;
using keyboard_warrior.Models;

namespace keyboard_warrior.AppManager
{
    public interface IRoomsRepositorie
    {
        Task<IEnumerable<RoomDTO>> GetRooms();

        Task<Room?> GetRoom(string id);
      

        Task<RoomDTO?> CreateRoom(string roomName,string typeTextRoom);

        Task<IEnumerable<RoomDTO>> RemoveRoom(string roomId);

        Task<bool> AddUser(string user, string roomId);

        Task<Room> RemoveUser(UserConnection user, string roomId);
        Task<Room> RemoveUser(UserConnection user);

        Task<Room?> RestartRoom(string roomId);
    }
}
