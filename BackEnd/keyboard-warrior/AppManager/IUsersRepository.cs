using keyboard_warrior.Models;

namespace keyboard_warrior.AppManager
{
    public interface IUsersRepository
    {

        Task RemoveUser(string username);
         Task<bool> IsUserExist(string username);
        Task AddUser(string username, string connectionId);

        Task<UserConnection?> GetUser(string username);
        Task<UserConnection?> GetUserByConnectionId(string connectionId);

        Task<string> See();
    }
}
