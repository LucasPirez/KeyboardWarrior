using Application.DTOs;
using Domain.Entities;

namespace Application.Extensions
{
    public static class UserConnectionExtension
    {
        public static UserConnectionDto AsDto(this UserConnection userConnection)
        {
            return new UserConnectionDto()
            {
                ConnectionId = userConnection.ConnectionId,
                Id = userConnection.Id,
                Ready = userConnection.Ready,
                UserName = userConnection.UserName,
            };
        }
    }
}
