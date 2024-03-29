﻿using keyboard_warrior.Models;

namespace keyboard_warrior.AppManager
{
    public interface IUsersSingleton
    {

        void RemoveUser(string username);
        bool IsUserExist(string username);
        void AddUser(string username, string connectionId);

        UserConnection? GetUser(string username);
        UserConnection? GetUserByConnectionId(string connectionId);

        string See();
    }
}
