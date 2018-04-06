using System;

namespace Website.ViewModels.Base
{
    /// <summary>
    /// ViewModel passed to Layout.cshtml.
    /// </summary>
    public class RazorViewModel
    {
        public IServiceProvider ServiceProvider { get; set; }
        public ReactViewModel ReactViewModel { get; set; }
    }
}