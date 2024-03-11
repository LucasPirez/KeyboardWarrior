using keyboard_warrior.DTOs;
using keyboard_warrior.enums;
using keyboard_warrior.Hubs;
using keyboard_warrior.Models;

namespace keyboard_warrior.AppManager
{
    public class Room 
    {
        private string Id { get; set; } = Guid.NewGuid().ToString();

        private string Name { get; set; }

        private List<UserConnection> ListUser = new();

        private string State { get; set; } = RoomState.Waiting;


        public Room(string name)
        {
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

        public void UpdateStateUser(bool state,string userName) {
            var userToUpdate = ListUser.Where(u => u.UserName == userName).FirstOrDefault();
            userToUpdate?.SetReady(state);
        }

        public void SetRoomState(string state)
        {
            if (state == RoomState.Waiting || state == RoomState.Playing)
            {
                State = state;
            }
            else
            {
                throw new ArgumentException("Valor no válido para RoomState", nameof(state));
            }
        }

        public RoomDTO GetRoomDTO()
        {
            return new RoomDTO
            {
                ListUser = ListUser,
                Name = Name,
                State = State,
                Id = Id
            };
        }

        public int GetUsersCount()
        {
            return ListUser.Count;
        }

    }
}
