namespace Website.Dto
{
    // https://www.iana.org/time-zones
    public class IanaTimeZone
    {
        public IanaTimeZone(string timeZone)
        {
            Value = timeZone?.Trim();
        }

        public string Value { get; protected set; }
    }
}