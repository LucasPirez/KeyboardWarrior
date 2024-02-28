using keyboard_warrior.Models;
using Microsoft.AspNetCore.SignalR;

namespace keyboard_warrior.Hubs
{
    public class PlayHub: Hub
    {

        public PlayHub() { 
        

        }
        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("ClientConnected", "¡Bienvenido! Estás conectado al servidor.");

            await base.OnConnectedAsync();
        }
        public async Task Login(UserConnection con)
        {
            await Clients.All.SendAsync("ReceiveMessage"
                ,"admin", $"{con.UserName} has connected");
        }
    }
}
