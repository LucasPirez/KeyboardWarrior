using keyboard_warrior.DTOs;
using keyboard_warrior.enums;
using keyboard_warrior.Models;

namespace keyboard_warrior.AppManager
{
    public class Room
    {
        private string Id { get; set; } = Guid.NewGuid().ToString();

        private string Name { get; set; } = string.Empty;

        private List<UserConnection> ListUser = new();

        private RoomState State { get; set; } = RoomState.Waiting;


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

        public void UpdateStateUser(UserStates state,UserConnection user) {
            var userToUpdate = ListUser.FirstOrDefault(u => u.UserName == user.UserName);
            if (userToUpdate != null)
            {
                userToUpdate.State = state;
            }
        }

        public void SetRoomState(RoomState state)
        {
            State = state;
        }

        public RoomModel Get()
        {
           
            RoomModel room = new() 
                           {
                            ListUser = ListUser,
                            Name = Name,
                            State = State,
                            Id = Id
                           };

            return room;
        }

        public RoomDTO GetRoomDTO()
        {
            return new RoomDTO
            {
                ListUser = ListUser,
                Name = Name,
                State = State,
            };
        }

    }
}
