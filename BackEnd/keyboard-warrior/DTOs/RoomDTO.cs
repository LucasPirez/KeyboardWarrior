using keyboard_warrior.enums;
using keyboard_warrior.Models;

namespace keyboard_warrior.DTOs
{
    public class RoomDTO
    {
        public string Name { get; set; } = string.Empty;

        public List<UserConnection> ListUser = new();

        public RoomState State { get; set; }
    }
}
