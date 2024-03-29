﻿using keyboard_warrior.Models;
using System.Collections.Concurrent;

namespace keyboard_warrior.AppManager
{
    public class UsersSingleton : IUsersSingleton
    {

        private ConcurrentDictionary<string, UserConnection> connectedUsers = new ConcurrentDictionary<string, UserConnection>();


        public void AddUser(string username,string connectionId)
        {
            string guid = Guid.NewGuid().ToString();

            UserConnection newUser = new(guid, username,connectionId);

            connectedUsers.TryAdd(username, newUser);
        }

        public string See()
        {
            string h = "";

            foreach (var value in connectedUsers.Values.ToList())
            {
                h += $"{value.UserName}  ,";
            }

            return h;
        }

        public void RemoveUser(string username)
        {
            connectedUsers.TryRemove(username, out _);
        }

        public bool IsUserExist(string username)
        {
            return connectedUsers.ContainsKey(username);
        }

        public UserConnection? GetUser(string username)
        { 
            if (connectedUsers.TryGetValue(username, out UserConnection user))
            {
                return user;
            }
            else
            {
                return null;
            }
        }

        public UserConnection? GetUserByConnectionId(string connectionId)
        {
          return connectedUsers.Values.FirstOrDefault(u => u.ConnectionId == connectionId);
        }
    }
}
