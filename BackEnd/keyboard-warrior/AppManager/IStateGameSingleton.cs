namespace keyboard_warrior.AppManager
{
    public interface IStateGameSingleton
    {

        void RemoveUser(string username);
        bool IsUserExist(string username);
        
        void AddUser(string username, string userId);
    }
}
