using keyboard_warrior.Notifications.Channels;
using keyboard_warrior.Notifications.Interfaces;

namespace keyboard_warrior.Notifications
{
    public enum Channel
    {
        Email,
        Whatsapp,
    }

    public class NotificationService : INotificationService
    {
        private INotificationChannel? _notificationChannel;
        private readonly IConfiguration _configuration;

        public NotificationService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void SetNotificationChannel(Channel channel)
        {
            INotificationChannel setChannel = channel switch
            {
                Channel.Email => new EmailNotification(_configuration),
                _ => throw new Exception("Channel not suported"),
            };

            _notificationChannel = setChannel;
        }

        public async Task Notify(string message, string? recipient)
        {
            if (_notificationChannel == null)
            {
                throw new InvalidOperationException("Notification channel not set.");
            }

                if(recipient == null)
            {
                await _notificationChannel.SendAlertAsync(message);
                return;
            }

            await _notificationChannel.SendAsync(message, recipient);
        }
    }
}
