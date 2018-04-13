namespace Website
{
    public class AppSettings
    {
        private bool _disableServerSideRendering;

        // Disable server side rendering so that you can use console.log and the browser's JS
        // debugging to fix errors.
        public bool DisableServerSideRendering
        {
            // You can only disable SSR when in DEBUG configuration
            get => Startup.IsDebug && _disableServerSideRendering;
            set => _disableServerSideRendering = value;
        }
    }
}