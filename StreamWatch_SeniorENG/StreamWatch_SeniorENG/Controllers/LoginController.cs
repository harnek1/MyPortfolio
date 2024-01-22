using Microsoft.AspNetCore.Mvc;
using StreamWatch_SeniorENG.Databases;
using StreamWatch_SeniorENG.Models;
using System.Security.Cryptography;

namespace StreamWatch_SeniorENG.Controllers
{
    public class LoginController : Controller
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
        public LoginController(DatabaseContext context)
        {
            _context = context;
        }

        /// <summary>
        /// This is the Get method for the Login page where the user can see the Login page
        /// </summary>
        public IActionResult Index()
        {
            return View();

        }


        /// <summary>
        /// This method is to verify the user password. It uses Pbkdf2 to decrypt the password and compare it to the hashed and 
        /// salted password which is encrypted.
        /// </summary>
        bool VerifyPassword(string password, string hash, byte[] salt)
        {
            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, hashAlgorithm, keySize);

            return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
        }

       /// <summary>
       /// This is the Get method for the Login page where the user can see the Login page. If the user is already logged in then 
       /// the user will be redirected to the user home page
       /// </summary>
        [HttpGet]
        public IActionResult Login()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId != null)
            {
                return RedirectToAction("Index", "User");
                
            }else
            {
                
                return View();
            }


        }

       /// <summary>
       /// This method is to confirm the user email. If the user is not logged in then the user will be redirected to the Login page.
       /// If the user is logged then the method checks if the user is in the database and if the user has not confirm their email.
       /// If they have not then the boolean value for the ConfirmedEmail is set to true and the database is updated and saved then 
       /// the user is redirected to the user home page.If the boolean value for the ConfirmedEmail is true then they are redirected 
       /// to the user home page.
       /// </summary>
        public IActionResult EmailConfirmed()
        {

            var userId = HttpContext.Session.GetInt32("UserId");
           

            if (userId != null)
            {
                var check = _context.User.Where(x => x.Id == userId).FirstOrDefault();

                if (check != null && check.ConfirmedEmail == false)
                {

                    check.ConfirmedEmail = true;

                    _context.User.Update(check);

                    _context.SaveChanges();

                    return RedirectToAction("Index", "User");

                }else
                {
                    return RedirectToAction("Index", "User");
                }

            }
            else
            {

               return RedirectToAction("Login", "Login");
               
            }

        }

        /// <summary>
        /// This is the Post method for the Login page. If the user email is not in the database or if the user is invalid because 
        /// they entered either their email or password wrong the user will see and error message saying The Email or Password you
        /// have entered is wrong.If the user has submitted the correct email and password then the method creates session variables
        /// for the user id and user email to be used in the application then the user is redirected to the user home page.
        /// </summary>
        [HttpPost, ValidateAntiForgeryToken]
        public IActionResult Login(Login login)
        {
            
            if (ModelState.IsValid)
            {

                var userEmailCheck = _context.User.Where(query => query.Email.Equals(login.Email)).FirstOrDefault();
                
                if (userEmailCheck == null)
                {
                    ModelState.AddModelError("Email/PasswordWrong", "The Email or Password you have entered is wrong");
                    return View();
                }

                var user = _context.User.Where(query => query.Email.Equals(login.Email) && VerifyPassword(login.Password, userEmailCheck.Password, userEmailCheck.Salt)).FirstOrDefault();

                if (userEmailCheck == null || user == null)
                {
                    ModelState.AddModelError("Email/PasswordWrong", "The Email or Password you have entered is wrong");
                    return View();
                }

                else
                {
                    var logUser = _context.User.Where(query => query.Email.Equals(login.Email)).Select(query => query.Id).FirstOrDefault();

                    var logUserEmail = _context.User.Where(query => query.Id == logUser).First();

                    HttpContext.Session.SetInt32("UserId", logUser);
                    HttpContext.Session.SetString("UserEmail", logUserEmail.Email);

                    return RedirectToAction("Index", "User");
                }

            }
            else
            {     
                return View();
            }
            
        }
    }
}
