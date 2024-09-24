using keyboard_warrior.enums;
using Microsoft.AspNet.SignalR.Infrastructure;

namespace keyboard_warrior.Models
{
    public class UserConnection
    {
        public bool Ready { get; private set; } = false;

        public string Id { get; private set; } 
        public string ConnectionId { get; private set; } 
        public string UserName { get; private set; } 

        public UserConnection(string id, string userName, string connectionId)
        {
         Id = id;
         ConnectionId  = connectionId;
         UserName  = userName;
        }

        public void SetReady(bool ready)
        {
            Ready = ready;
        }
    }
}
