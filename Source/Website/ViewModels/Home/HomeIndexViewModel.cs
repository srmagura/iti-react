using Website.Controllers;
using Website.ViewModels.Base;

namespace Website.ViewModels.Home
{
    public class HomeIndexViewModel : ViewModel
    {
        public UserDto User { get; set; }
    }
}