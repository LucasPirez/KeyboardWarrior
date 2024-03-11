using keyboard_warrior.DTOs;
using System.Collections.Concurrent;

namespace keyboard_warrior.AppManager
{
    public class RoomsSingleton(IUsersSingleton users) : IRoomsSingleton
    {
        private ConcurrentDictionary<string, Room> rooms = new();
        private readonly IUsersSingleton _users = users;

        public IEnumerable<RoomDTO> GetRooms()
        {
            return rooms.Values.Select(a => a.GetRoomDTO());
        }
      
        public  RoomDTO? CreateRoom(string userName,string roomName )
        {
            Room room = new Room(roomName);

            var user = _users.GetUser(userName);
            if (user == null) return null;           

             room.AddUser(user);

            if(rooms.TryAdd(room.GetRoomDTO().Id, room))
            {
             return new RoomDTO
            {
                Id=room.GetRoomDTO().Id,
                ListUser= room.GetRoomDTO().ListUser,
                Name=room.GetRoomDTO().Name,
                State = room.GetRoomDTO().State,
            };
            }
            else
            {
                return null;
            }
        }

        public Room? GetRoom(string id)
        {
            if(rooms.TryGetValue(id, out Room? room))
            {
                return room;
            }
            return null;
        }


        public IEnumerable<RoomDTO> RemoveRoom(string roomId)
        {
            rooms.TryRemove(roomId, out _);
            return GetRooms();
        }

        public bool AddUser(string  userName, string roomId)
        {
            var user = _users.GetUser(userName);

            if (user == null) return false;

            if (rooms.TryGetValue(roomId, out Room? currentRoom))
            {
                currentRoom.AddUser(user);
                return true;
            }
                return false;
        }

        public bool RemoveUser(string userName, string roomId)
        {
            var user = _users.GetUser(userName);

            if(user == null) return false;
            user.SetReady(false);

            if (rooms.TryGetValue(roomId, out Room? currentRoom))
            {
                currentRoom.RemoveUser(user);
                int usersCount = currentRoom.GetUsersCount();

                if (usersCount == 0)
                {
                    rooms.TryRemove(roomId, out _);
                }

                return true;
            }
            return false;

        }


      
    }
}

