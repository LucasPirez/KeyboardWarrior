using Application.DTOs;
using Domain.Entities;

namespace TypingGame.Presentation
{
    public interface IClientHubMessages
    {
        Task SendRoomData(string roomId, string connectionId, RoomDTO data);

        Task DeleteRoom(string roomId);

        Task ChangeStateUser(string roomId, string userName, bool boolean);

        Task CreateRoom(RoomDTO room);

        Task JoinRoom(string connectionId, RoomDTO room);

        Task RemoveUserRoom(string connectionId, RoomDTO room);

        Task RestartRoom(string roomId, RoomDTO room);

        Task TextTypedPercentage(string roomId, string userName, int percentage);

        Task FinishGame(string roomId, string userNameAndTimesStamp);

        Task StartPlayTimer(IEnumerable<string> usersExcluded, RoomDTO room);

        Task StartGame(string roomId, string text);
    }
}
