namespace Application.DTOs
{
    public class SocketResponseDTO<T>
    {
        public int Code { get; set; } = 200;
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }

        public SocketResponseDTO() { }

        public SocketResponseDTO(int code, string message, T data)
        {
            Code = code;
            Message = message;
            Data = data;
        }

        public SocketResponseDTO<T> Send(int code, string message, T data)
        {
            return new SocketResponseDTO<T>
            {
                Code = code,
                Message = message,
                Data = data,
            };
        }
    }
}
