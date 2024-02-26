using Microsoft.AspNetCore.Mvc;

namespace keyboard_warrior.Controllers
{
    public class HomeController : Controller
    {
      

        public HomeController()
        {
           
        }
    public string Index()
        {

            return "holahola";
        }

        /* 
         public IActionResult Privacy()
         {
             return View();
         }
        */


    }
}
