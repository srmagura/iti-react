using Website.Controllers;
using Website.Dto;
using Website.ViewModels.Base;

namespace Website.ViewModels.Home
{
    public class HomeIndexViewModel : ViewModel
    {
        public ExampleUserDto User { get; set; }
    }
}