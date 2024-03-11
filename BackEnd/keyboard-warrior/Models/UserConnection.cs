﻿using keyboard_warrior.enums;

namespace keyboard_warrior.Models
{
    public class UserConnection(string id, string userName)
    {
        public string Id { get; private set; } = id;
        public string UserName { get; private set; } = userName;
        public bool Ready { get; private set; } = false;

        public void SetReady(bool ready)
        {
            Ready = ready;
        }
    }
}
