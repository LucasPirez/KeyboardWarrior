using System.Net;
using System.Net.Mail;
using keyboard_warrior.Notifications.Interfaces;

namespace keyboard_warrior.Notifications.Channels
{
    public class EmailNotification : INotificationChannel
    {
        private readonly IConfiguration _configuration;

        public EmailNotification(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendAlertAsync(string message)
        {
            string? emailEmiter = _configuration.GetValue<string>("EmailConfiguration:Email");
            string? myEmail = _configuration.GetValue<string>("MyEmail");

            if(string.IsNullOrEmpty(myEmail))
            {
                throw new InvalidOperationException("My email not set.");
            }

            var email = new MailMessage(emailEmiter!, myEmail, "Alerta", message);

            await setSmtpClient().SendMailAsync(email);
        }

        public async Task SendAsync(string message, string recipient)
        {
            string? emailEmiter = _configuration.GetValue<string>("EmailConfiguration:Email");

            var email = new MailMessage(emailEmiter!, recipient, "Alerta", message);

            await setSmtpClient().SendMailAsync(email);
        }


        private SmtpClient setSmtpClient(){

            string? password = _configuration.GetValue<string>("EmailConfiguration:Password");
            string? host = _configuration.GetValue<string>("EmailConfiguration:Host");
            int port = _configuration.GetValue<int>("EmailConfiguration:Port");
            string? emailEmiter = _configuration.GetValue<string>("EmailConfiguration:Email");

            if (string.IsNullOrEmpty(password) || string.IsNullOrEmpty(host) || string.IsNullOrEmpty(emailEmiter))
            {
                throw new InvalidOperationException("Email configuration not set.");
            }

            var smtpClient = new SmtpClient(host, port);
            smtpClient.EnableSsl = true;
            smtpClient.UseDefaultCredentials = false;

            smtpClient.Credentials = new NetworkCredential(emailEmiter, password);

            return smtpClient;
        }
    }
}
