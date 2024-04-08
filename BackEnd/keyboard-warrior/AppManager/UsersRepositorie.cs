﻿using keyboard_warrior.Models;
using System.Collections.Concurrent;

namespace keyboard_warrior.AppManager
{
    public class UsersRepositorie : IUsersRepositorie
    {

        private ConcurrentDictionary<string, UserConnection> connectedUsers = new ConcurrentDictionary<string, UserConnection>();


        public async  Task AddUser(string username,string connectionId)
        {
            string guid = Guid.NewGuid().ToString();

            UserConnection newUser = new(guid, username,connectionId);

            connectedUsers.TryAdd(username, newUser);
        }

        public async Task<string> See()
        {
            string h = "";

            foreach (var value in connectedUsers.Values.ToList())
            {
                h += $"{value.UserName}  ,";
            }

            return h;
        }

        public async Task RemoveUser(string username)
        {
            connectedUsers.TryRemove(username, out _);
        }

        public async Task<bool> IsUserExist(string username)
        {
            return connectedUsers.ContainsKey(username);
        }

        public async Task<UserConnection?> GetUser(string username)
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

        public async Task<UserConnection?> GetUserByConnectionId(string connectionId)
        {
          return connectedUsers.Values.FirstOrDefault(u => u.ConnectionId == connectionId);
        }
    }
}