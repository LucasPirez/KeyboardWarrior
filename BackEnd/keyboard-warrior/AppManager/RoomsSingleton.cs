using keyboard_warrior.DTOs;
using keyboard_warrior.Models;
using System.Collections.Concurrent;

namespace keyboard_warrior.AppManager
{
    public class RoomsSingleton : IRoomsSingleton
    {
        private ConcurrentDictionary<string, Room> rooms = new();
        private readonly IUsersSingleton _users;

        public RoomsSingleton(IUsersSingleton users)
        {
            _users = users;
        }

        public IEnumerable<RoomDTO> GetRooms()
        {
            return rooms.Values.Select(a => a.GetRoomDTO());
        }

      
        public  IEnumerable<RoomDTO>? CreateRoom(string userName,string roomName )
        {
            Room room = new Room(roomName);

            var user = _users.GetUser(userName);
            if (user == null) return null;           

             room.AddUser(user);

            rooms.TryAdd(room.Get().Id, room);
            return GetRooms();
        }

        public RoomDTO? GetRoom(string id)
        {
            if(rooms.TryGetValue(id, out Room? room))
            {
                return room.GetRoomDTO();
            };

            return null;
        }

        public IEnumerable<RoomDTO> RemoveRoom(string roomId)
        {
            rooms.TryRemove(roomId, out _);
            return GetRooms();
        }

        public bool AddUser(UserConnection user, string roomId)
        {
            if(rooms.TryGetValue(roomId, out Room? currentRoom))
            {
                currentRoom.AddUser(user);
                return true;
            }
            return false;
        }

        public bool RemoveUser(UserConnection user, string roomId)
        {
            if (rooms.TryGetValue(roomId, out Room? currentRoom))
            {
                currentRoom.RemoveUser(user);
                return true;
            }
            return false;

        }

       
    }

}

