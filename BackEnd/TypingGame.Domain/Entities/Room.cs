﻿using Domain.enums;

namespace Domain.Entities
{
    public class Room
    {
        private string Id { get; set; } = Guid.NewGuid().ToString();

        private string Name { get; set; }

        private List<UserConnection> ListUser = new();

        private RoomState State { get; set; } = RoomState.Waiting;

        private RoomTextType RoomType { get; set; }

        public Room(string name, string typeTextRoom)
        {
            if (
                typeTextRoom == RoomTextType.Javascript.ToString()
                || typeTextRoom == RoomTextType.NormalText.ToString()
            )
            {
                RoomType =
                    typeTextRoom == RoomTextType.Javascript.ToString()
                        ? RoomTextType.Javascript
                        : RoomTextType.NormalText;
            }
            else
            {
                throw new ArgumentException("Value 'Roomtype' dosn't permited");
            }

            Name = name;
        }

        public List<UserConnection> GetUsers()
        {
            return ListUser;
        }

        public void AddUser(UserConnection user)
        {
            ListUser.Add(user);
        }

        public void RemoveUser(UserConnection user)
        {
            ListUser.Remove(user);
        }

        public void UpdateStateUser(bool state, string? userName)
        {
            if (userName == null)
            {
                ListUser.ForEach(u => u.SetReady(false));
            }
            else
            {
                var userToUpdate = ListUser.Where(u => u.UserName == userName).FirstOrDefault();
                userToUpdate?.SetReady(state);
            }
        }

        public void SetRoomState(RoomState state)
        {
            State = state;
        }

        public RoomData GetRoomData()
        {
            return new RoomData
            {
                Id = Id,
                ListUser = ListUser,
                Name = Name,
                State = State.ToString(),
                RoomType = RoomType.ToString(),
            };
        }

        public int GetUsersCount()
        {
            return ListUser.Count;
        }

        public RoomTextType GetRoomTextType()
        {
            return RoomType;
        }

        public RoomState GetRoomState()
        {
            return State;
        }
    }

    public class RoomData
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public List<UserConnection> ListUser = new();

        public string State { get; set; }

        public string RoomType { get; set; }
    }
}
