using keyboard_warrior.enums;

namespace keyboard_warrior.Models
{
    public class RoomModel
    {
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public List<UserConnection> ListUser = new();

        public string State = RoomState.Waiting;
    }
}
