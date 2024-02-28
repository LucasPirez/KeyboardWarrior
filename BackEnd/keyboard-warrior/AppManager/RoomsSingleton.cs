using keyboard_warrior.DTOs;
using keyboard_warrior.Models;
using System.Collections.Concurrent;

namespace keyboard_warrior.AppManager
{
    public class RoomsSingleton : IRoomsSingleton
    {
        private ConcurrentDictionary<string, Room> rooms = new();


        public List<Room> GetRooms()
        {
            return [.. rooms.Values];
        }

        public List<Room> CreateRoom()
        {
            Room room = new Room();

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

        public List<Room> RemoveRoom(string roomId)
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

