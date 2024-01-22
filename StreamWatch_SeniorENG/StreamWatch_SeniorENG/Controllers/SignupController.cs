using Microsoft.AspNetCore.Mvc;
using StreamWatch_SeniorENG.Databases;
using StreamWatch_SeniorENG.Models;
using System.Security.Cryptography;
using System.Text;

namespace StreamWatch_SeniorENG.Controllers
{
    public class SignupController : Controller
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
        public SignupController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: SignUp/Signup

        /// <summary>
        /// This is the Get method for the Signup page where the user will see the signup form.
        /// </summary>
        public ActionResult Signup()
        {
            return View();
        }


        // POST: SignUp/Signup
        /// <summary>
        /// This is the Post method for the Signup page where the signup form is submitted and the new user is saved to the database.
        /// The user will then be redirected to the login page.This method hashes and salts the user password before it saves the 
        /// password in the database.The method also stop from duplicate emails from being saved to the database.The page will 
        /// display an error message that says Sorry, please choose a different email address.
        /// </summary>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Signup(Signup signup)
        {
            var check = _context.User.Where(user => user.Email == signup.Email).FirstOrDefault();

            if (ModelState.IsValid)
            {
                if (check == null)
                {
                    byte[] salt = RandomNumberGenerator.GetBytes(keySize);

                    var hash = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(signup.Password), salt, iterations, hashAlgorithm, keySize);
                    var hashed = Convert.ToHexString(hash);

                    var user = new User
                    {
                        Email = signup.Email,
                        Password = hashed,
                        Salt = salt,

                    };

                    _context.Add(user);
                    _context.SaveChanges();
                    return RedirectToAction("Login", "Login");
                }else
                {
                    ModelState.AddModelError("checkEmail", "Sorry, please choose a different email address.");

                    return View(signup);
                }
                
            }
           
            return View();
        }
    }
}
