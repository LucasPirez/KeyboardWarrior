using keyboard_warrior.Models;

namespace keyboard_warrior.AppManager
{
    public interface IUsersSingleton
    {

        void RemoveUser(string username);
        bool IsUserExist(string username);
        void AddUser(string username);

        UserConnection? GetUser(string username);

        string See();
    }
}
