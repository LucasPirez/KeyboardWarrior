using keyboard_warrior.DTOs;

namespace keyboard_warrior.AppManager
{
    public interface IRoomsSingleton
    {
        IEnumerable<RoomDTO> GetRooms();

        Room? GetRoom(string id);
      

        RoomDTO? CreateRoom(string userName, string roomName);

        IEnumerable<RoomDTO> RemoveRoom(string roomId);

        bool AddUser(string user, string roomId);

        bool RemoveUser(string userName, string roomId);
    }
}
