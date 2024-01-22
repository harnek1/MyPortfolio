using Humanizer;
using Microsoft.AspNetCore.Mvc;
using StreamWatch_SeniorENG.Databases;
using StreamWatch_SeniorENG.Models;
using System.Security.Cryptography;
using System.Text;

namespace StreamWatch_SeniorENG.Controllers
{
    public class AccountSettingsController : Controller
    {
        /// <summary>
        /// This variable gives access to the database
        /// </summary>
        private readonly DatabaseContext _context;

        /// <summary>
        /// This variable is the key size for the salt
        /// </summary>
        const int keySize = 64;

        /// <summary>
        /// This variable is number of times the Pbkdf2 function will run to make sure the hashing is strong
        /// </summary>
        const int iterations = 350000;

        /// <summary>
        /// This variable is the hashing algorithm that will be used to hash the password
        /// </summary>
        HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;

        /// <summary>
        /// This constructor initializes the database variable context so that the database can be accessed to do CRUD operations
        /// </summary>
        public AccountSettingsController(DatabaseContext context)
        {
            _context = context;

        }

        /// <summary>
        ///  This is the Get method for the Account Settings page where the user can see the Account Settings page, if the user is 
        ///  logged in.
        /// </summary>
        [HttpGet]
        public IActionResult Index()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }

        /// <summary>
        ///  This is the Get method for the Change Password page where the user can see the Change Password page, if the user is
        ///  logged in.
        /// </summary>
        [HttpGet]
        public IActionResult ChangePassword()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }

         /// <summary>
         /// This is the Post method for the Change Password page where the logged in user submits the new password which will be 
         /// salted, hashed, and saved to the database.If there is an error the page will show an error message and an alert will be
         /// displayed saying Sorry, your password cannot been changed! If there are no problems then an alert message will display
         /// and say Your password has been changed!
         /// </summary>
        [HttpPost]
        public IActionResult ChangePassword(ChangePassword changePassword)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            var isChangedPassword = false;
            if (userId != null)
            {
                if (ModelState.IsValid)
                {
                    var user = _context.User.Where(query => query.Id == userId).FirstOrDefault();
                    if (user != null)
                    {
                        byte[] salt = RandomNumberGenerator.GetBytes(keySize);
                        user.Salt = salt;
                        var hash = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(changePassword.Password), salt, iterations, hashAlgorithm, keySize);
                        var hashed = Convert.ToHexString(hash);
                        user.Password = hashed;
                        _context.SaveChanges();

                        isChangedPassword = true;

                        return Json(new { isPasswordChanged = isChangedPassword });
                    }
                    else
                    {
                        isChangedPassword = false;

                        return Json(new { isPasswordChanged = isChangedPassword }); ;
                    }

                }
                else
                {
                    List<string> errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(error => error.ErrorMessage).ToList();

                    ModelState.Clear();

                    var err = "";

                    foreach (var errorMessage in errorMessages)
                    {
                        err = errorMessage;
                    }

                    isChangedPassword = false;

                    return Json(new { isPasswordChanged = isChangedPassword, errorMessage = err });
                }
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }

    }
}
