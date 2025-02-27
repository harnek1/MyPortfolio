using Microsoft.AspNetCore.Mvc;
using StreamWatch_SeniorENG.Models;
using System.Diagnostics;

namespace StreamWatch_SeniorENG.Controllers
{
    public class HomeController : Controller
    {
        /// <summary>
        /// This is the Get method for the Home page where the user can see the Home page if the user is not logged in
        /// </summary>
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// This is the Get method for the Privacy page where the user can see the Privacy page
        /// </summary>
        [HttpGet]
        public IActionResult Privacy()
        {
            return View();
        }

        /// <summary>
        /// This is the Get method for the About page where the user can see the About page
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult About()
        {
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}