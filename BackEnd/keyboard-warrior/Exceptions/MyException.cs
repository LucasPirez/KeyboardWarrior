namespace keyboard_warrior.Exceptions
{
    public class MyException:Exception
    {
        public int ErrorCode { get;private set; }

        public MyException(string message) : base(message) { }
        public MyException(string message, int errorCode) :base(message) 
        {
            ErrorCode = errorCode;
        }

    }
}
