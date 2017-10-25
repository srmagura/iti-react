using System;

namespace Website.ViewModels
{
    public class MetaViewModel
    {
        public string Page { get; set; }
        public string BaseUrl { get; set; }

        public ViewModel ViewModel { get; set; }

        public IServiceProvider ServiceProvider { get; set; }
    }
}