namespace Website.ViewModels.Base
{
    /// <summary>
    /// ViewModel to be passed to React client- and server-rendering code.
    /// </summary>
    public class ReactViewModel
    {
        public string Page { get; set; }
        public string BaseUrl { get; set; }

        public ViewModel ViewModel { get; set; }
    }
}