using keyboard_warrior.enums;
using keyboard_warrior.Models;

namespace keyboard_warrior.DTOs
{
    public class RoomDTO
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

        public List<UserConnection> ListUser { get; set; } = new();

        public string State { get; set; } = RoomState.Waiting;
    }
}
