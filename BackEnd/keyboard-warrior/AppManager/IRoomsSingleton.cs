using keyboard_warrior.DTOs;

namespace keyboard_warrior.AppManager
{
    public interface IRoomsSingleton
    {
        IEnumerable<RoomDTO> GetRooms();

        Room? GetRoom(string id);
      

        RoomDTO? CreateRoom(string roomName,string typeTextRoom);

        IEnumerable<RoomDTO> RemoveRoom(string roomId);

        bool AddUser(string user, string roomId);

        bool RemoveUser(string userName, string roomId);
        string? RemoveUser(string userName);

        Room? RestartRoom(string roomId);
    }
}
