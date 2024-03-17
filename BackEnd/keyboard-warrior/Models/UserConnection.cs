using keyboard_warrior.enums;

namespace keyboard_warrior.Models
{
    public class UserConnection(string id, string userName,string connectionId)
    {
        public string Id { get; private set; } = id;
        public string ConnectionId { get; private set; } = connectionId;
        public string UserName { get; private set; } = userName;
        public bool Ready { get; private set; } = false;

        public void SetReady(bool ready)
        {
            Ready = ready;
        }
    }
}
