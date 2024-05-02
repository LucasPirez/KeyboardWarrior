using keyboard_warrior.AppManager;
using keyboard_warrior.DTOs;

namespace keyboard_warrior.Services
{
    public interface IClientHubServices
    {

        Task SendRoomData(string roomId, string connectionId, RoomDTO data);

        Task DeleteRoom(string roomId);

        Task ChangeStateUser(string roomId, string userName, bool boolean);
        Task CreateRoom(RoomDTO room);

        Task JoinRoom(string connectionId, RoomDTO room);

        Task RemoveUserRoom(string roomId,RoomDTO room);

        Task RestartRoom(string roomId,Room room);
    }
}
