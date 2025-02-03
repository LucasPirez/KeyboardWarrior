using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IUsersRepository
    {
        Task RemoveUser(string username);
        Task<bool> IsUserExist(string username);
        Task<UserConnection?> AddUser(string username, string connectionId);

        Task<UserConnection?> GetUser(string username);
        Task<UserConnection?> GetUserByConnectionId(string connectionId);

        Task<string> See();
    }
}
