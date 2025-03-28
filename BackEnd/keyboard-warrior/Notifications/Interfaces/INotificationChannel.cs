namespace keyboard_warrior.Notifications.Interfaces
{
    public interface INotificationChannel
    {
        Task SendAsync(string message, string recipient);

        Task SendAlertAsync(string message);
    }
}
