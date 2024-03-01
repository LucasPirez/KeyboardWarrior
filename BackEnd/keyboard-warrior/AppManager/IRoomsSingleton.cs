using keyboard_warrior.DTOs;
using keyboard_warrior.Models;

namespace keyboard_warrior.AppManager
{
    public interface IRoomsSingleton
    {
        IEnumerable<RoomDTO> GetRooms();

        RoomDTO? GetRoom(string id);

        IEnumerable<RoomDTO>? CreateRoom(string userName, string roomName);

        IEnumerable<RoomDTO> RemoveRoom(string roomId);

        bool AddUser(UserConnection user, string roomId);

        bool RemoveUser(UserConnection user, string roomId);
    }
}
