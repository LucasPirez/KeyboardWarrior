using keyboard_warrior.DTOs;
using keyboard_warrior.enums;
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
      
        public  RoomDTO? CreateRoom(string roomName,string typeTextRoom )
        {
            Room room = new Room(roomName, typeTextRoom);         

            if(rooms.TryAdd(room.GetRoomDTO().Id, room))
            {
                return room.GetRoomDTO();
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
        /**
         * 
         * return roomId or null
         */
        public string? RemoveUser(string userName)
        {
            var user = _users.GetUser(userName);

            if (user == null) return null;

            var currentRoom = rooms.Values.FirstOrDefault(u => u.GetUsers().Contains(user));
         
            if (currentRoom != null) { 
                currentRoom.RemoveUser(user);
                int usersCount = currentRoom.GetUsersCount();

                if (usersCount == 0)
                {
                    rooms.TryRemove(currentRoom.GetRoomDTO().Id, out _);
                }
                 return   currentRoom.GetRoomDTO().Id;
            }

            return null;
           

        }

        public Room? RestartRoom(string roomId)   
        {
            var room = GetRoom(roomId);

            if (room == null) return null;

            room.SetRoomState(RoomState.Waiting);
            room.UpdateStateUser(false, null);

            return room;
        }

    }
}

