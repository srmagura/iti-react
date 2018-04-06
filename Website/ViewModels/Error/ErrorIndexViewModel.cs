using Website.ViewModels.Base;

namespace Website.ViewModels.Error
{
    public class ErrorIndexViewModel : ViewModel
    {
        public string Message { get; set; }
        public bool IsDebug { get; set; }
        public string DiagnosticInformation { get; set; }
    }
}