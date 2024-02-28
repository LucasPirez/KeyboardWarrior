using keyboard_warrior.DTOs;
using keyboard_warrior.Models;

namespace keyboard_warrior.AppManager
{
    public interface IRoomsSingleton
    {
        List<Room> GetRooms();

        RoomDTO? GetRoom(string id);

        List<Room> RemoveRoom(string roomId);

        bool AddUser(UserConnection user, string roomId);

        bool RemoveUser(UserConnection user, string roomId);
    }
}
