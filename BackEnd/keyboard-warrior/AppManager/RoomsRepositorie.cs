using keyboard_warrior.DTOs;
using keyboard_warrior.enums;
using keyboard_warrior.Exceptions;
using keyboard_warrior.Models;
using System.Collections.Concurrent;
using System.Net;

namespace keyboard_warrior.AppManager
{
    public class RoomsRepositorie(IUsersRepositorie users) : IRoomsRepositorie
    {
        private ConcurrentDictionary<string, Room> rooms = new();
        private readonly IUsersRepositorie _users = users;

        public async Task<IEnumerable<RoomDTO>> GetRooms()
        {
            return rooms.Values.Select(a => a.GetRoomDTO());
        }
      
        public async Task<RoomDTO?> CreateRoom(string roomName,string typeTextRoom )
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

        public async Task<Room?> GetRoom(string id)
        {
            if(rooms.TryGetValue(id, out Room? room))
            {
                return room;
            }
            return null;
        }


        public async Task<IEnumerable<RoomDTO>> RemoveRoom(string roomId)
        {
            rooms.TryRemove(roomId, out _);
            return await GetRooms();
        }

        public async Task<bool>  AddUser(string  userName, string roomId)
        {
            var user = await _users.GetUser(userName);

            if (user == null) return false;

            if (rooms.TryGetValue(roomId, out Room? currentRoom))
            {
                currentRoom.AddUser(user);
                return true;
            }
                return false;
        }

        public async Task<Room> RemoveUser(UserConnection user, string roomId)
        {
            user.SetReady(false);
            if (rooms.TryGetValue(roomId, out Room? currentRoom))
            {
                currentRoom.RemoveUser(user); 
                return currentRoom;
            }
            else
            {
                throw new MyException($"Key in Rooms Not Found in method {nameof(RemoveUser)}", (int)HttpStatusCode.NotFound);
            }
            

        }

        public  async Task<Room> RemoveUser(UserConnection user)
        {
            var currentRoom =  rooms.Values.FirstOrDefault(u => u.GetUsers().Contains(user));

            if (currentRoom == null) throw new Exception($"User not found in any room in method {nameof(RemoveUser)}");
               currentRoom.RemoveUser(user);
 
               return  currentRoom;
        }

        public async Task<Room?> RestartRoom(string roomId)   
        {
            var room = await GetRoom(roomId);

            if (room == null) return null;

            room.SetRoomState(RoomState.Waiting);
            room.UpdateStateUser(false, null);

            return room;
        }

       
    }
}

