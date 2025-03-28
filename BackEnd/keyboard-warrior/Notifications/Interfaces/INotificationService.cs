using System.Threading.Channels;

namespace keyboard_warrior.Notifications.Interfaces
{
    public interface INotificationService
    {
        Task Notify(string message, string? recipient = default);

        void SetNotificationChannel(Channel channel);
    }
}
