using keyboard_warrior.enums;

namespace keyboard_warrior.Models
{
    public class UserConnection
    {
        public string Id { get; set; }
       public string UserName { get; set; } = string.Empty;

        public UserStates State = UserStates.InHome;
    }
}
