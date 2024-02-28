using keyboard_warrior.Models;
using Microsoft.AspNetCore.SignalR;

namespace keyboard_warrior.Hubs
{
    public class RoomHub: Hub
    {


        public async Task GetResponse(string message)
        {
            await Clients.All.SendAsync("get"
                , "admin", $"{message} que envie");
        }
    }
}
