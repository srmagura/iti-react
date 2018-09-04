namespace Website.Dto
{
    public class ErrorDto
    {
        public ErrorType? ErrorType { get; set; }

        public string Message { get; set; }
        public string DiagnosticInformation { get; set; }
    }
}