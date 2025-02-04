using Application.DTOs;
using Domain.Entities;

namespace Application.Extensions
{
    public static class RoomExtension
    {
        public static RoomDTO AsDto(this Room room)
        {
            var data = room.GetRoomData();

            return new RoomDTO()
            {
                Id = data.Id,
                Name = data.Name,
                ListUser = data.ListUser,
                RoomType = data.RoomType.ToString(),
                State = data.State.ToString(),
            };
        }
    }
}
