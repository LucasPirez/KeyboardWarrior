namespace keyboard_warrior.DTOs
{

    public class SocketResponseDTO
    {
        public int code { get; set; } = 200;
        public string message { get; set; } = string.Empty;
        public object data { get; set; } = new() { };
    }
}
