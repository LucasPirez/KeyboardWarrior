using Domain.Entities;
using Domain.enums;

namespace Application.DTOs
{
    public class RoomDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

        public List<UserConnection> ListUser { get; set; } = new();

        public string State { get; set; } = RoomState.Waiting.ToString();

        public string RoomType { get; set; } = string.Empty;
    }

    public class RoomWithTypesDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

        public List<UserConnection> ListUser { get; set; } = new();

        public RoomState State { get; set; } = RoomState.Waiting;

        public RoomTextType RoomType { get; set; }
    }
}
