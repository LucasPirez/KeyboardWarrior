using keyboard_warrior.Models;
using System.Collections.Concurrent;

namespace keyboard_warrior.AppManager
{
    public class StateGameSingleton : IStateGameSingleton
    {

        private ConcurrentDictionary<string, UserConnection> connectedUsers = new ConcurrentDictionary<string, UserConnection>();


        public void AddUser(string username,string userId)
        {
            UserConnection newUser = new UserConnection
            {
                UserName = username,
                Id = userId
            };

            connectedUsers.TryAdd(username, newUser);
        }

        public void RemoveUser(string username)
        {
            connectedUsers.TryRemove(username, out _);
        }

        public bool IsUserExist(string username)
        {
            return connectedUsers.ContainsKey(username);
        }


    }
}
