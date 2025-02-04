namespace Domain.Exceptions
{
    [Serializable]
    public class MyException : Exception
    {
        public int ErrorCode { get; private set; }

        public MyException(string message) : base(message) { }

        public MyException(string message, int errorCode) : base(message)
        {
            ErrorCode = errorCode;
        }

        public MyException(string message, int errorCode, Exception innerException)
            : base(message, innerException)
        {
            ErrorCode = errorCode;
        }
    }
}
