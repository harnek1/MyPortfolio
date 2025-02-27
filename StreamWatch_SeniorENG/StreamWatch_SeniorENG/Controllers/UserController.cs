using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SendGrid.Helpers.Mail;
using SendGrid;
using StreamWatch_SeniorENG.Databases;
using StreamWatch_SeniorENG.Models;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;


namespace StreamWatch_SeniorENG.Controllers
{
    public class UserController : Controller
    {
        /// <summary>
        /// This variable gives access to the database
        /// </summary>
        private readonly DatabaseContext _context;

        /// <summary>
        /// This variable gives access to the application configurations
        /// </summary>
        private readonly IConfiguration _configuration;

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
        /// This constructor initializes the database variable context so that the database can be accessed to do CRUD operations.
        /// The constructor also initializes the configuration variable so that the configuration settings can be accessed.
        ///</summary>
        public UserController(DatabaseContext context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;

        }

        // GET: User/Index
        /// <summary>
        /// This is the Get method for the User Home page where the user will see the User Home. If the user is logged in the method
        /// checks if the user email is confirmed and if it is not then the method calls the ConfirmationEmail method. The method 
        /// also checks if the user has logged after 24 hours and if they have the user will be sent an email of upcoming tv episodes
        /// from tv shows that the user has liked by calling the ScheduleNotification method. The method updates and saves the 
        /// LastLogin property to the database to be the date and time that the user logged in.
        ///</summary>
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId != null)
            {

                var check = _context.User.Where(x => x.Id == userId).FirstOrDefault();

                if (check?.ConfirmedEmail != true)
                {

                    await ConfirmationEmail(userId);


                }

                var date = check?.LastLogin.AddHours(24);

                if ((DateTime.Now > date && check?.ConfirmedEmail == true) || (check?.LastLogin.Date.ToString() == "0001-01-01 12:00:00 AM" && check?.ConfirmedEmail == true))
                {

                    await ScheduleNotification(userId);

                    check.LastLogin = DateTime.Now;

                    _context.User.Update(check);

                    _context.SaveChanges();
                }

            }
            return View();

        }

        /// <summary>
        /// This Get method check if the user email is confirmed. The method checks if the the userId and check variables are null. 
        /// If the variables are null then the method returns false. If the userId and check variables are not null then the method
        /// checks if the the ConfirmedEmail property is false and if it is then the method returns false, else the method returns
        /// true.
        ///</summary>
        [HttpGet]
        public bool IsEmailConfirmed()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            var check = _context.User.Where(x => x.Id == userId).FirstOrDefault();

            if (userId != null && check != null)
            {
                if (check.ConfirmedEmail != true)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            else
            {
                return false;
            }


        }

        /// <summary>
        /// This Get method check if the user saw the email confirmed alert. The method checks if the the userId and check variables
        /// are null. If the variables are null then the method returns false. If the userId and check variables are not null then 
        /// the method returns the value of the EmailConfirmationMsg property in the database.
        ///</summary>
        [HttpGet]
        public bool GetIsEmailMsg()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            var check = _context.User.Where(x => x.Id == userId).FirstOrDefault();

            if (userId != null && check != null)
            {
                return check.EmailConfirmationMsg;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// This Get method sets the EmailConfirmationMsg property to true, updates and saves the change to the database. The method
        /// checks if the the userId and check variables are null. If the variables are null then the method does nothing. If the
        /// userId and check variables are not null then the method sets the EmailConfirmationMsg property to true and saves the
        /// change to the database.
        /// </summary>
        [HttpPost]
        public void IsEmailMsg()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            var check = _context.User.Where(x => x.Id == userId).FirstOrDefault();

            if (userId != null && check != null)
            {
                check.EmailConfirmationMsg = true;

                _context.User.Update(check);

                _context.SaveChanges();
            }
        }

        /// <summary>
        /// This method sents the user confirmation email.
        /// </summary>
        public async Task ConfirmationEmail(int? userId)
        {
            var user = _context.User.Where(x => x.Id == userId).First();
            var apiKey = _configuration["EmailSettings:ApiKey"];
            var apiEmail = _configuration["EmailSettings:SenderEmail"];
            var client = new SendGridClient(apiKey);
            var from_email = new EmailAddress(apiEmail, "StreamWatch");
            var subject = "Confirmation Email";
            var to_email = new EmailAddress(user.Email, user.Email);

            var plainTextContent = "Please click the link to confirm the email https://streamwatchsenioreng20231128232024.azurewebsites.net/Login/EmailConfirmed";
            var htmlContent = "<strong>Please click the link to confirm the email</strong><a href=https://streamwatchsenioreng20231128232024.azurewebsites.net/Login/EmailConfirmed> click here</a>";
            var msg = MailHelper.CreateSingleEmail(from_email, to_email, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg).ConfigureAwait(false);

        }

        /// <summary>
        /// This method sents the user email of all the users upcoming tv shows.
        ///</summary>
        public async Task ScheduleNotification(int? userId)
        {
            var user = _context.User.Where(x => x.Id == userId).FirstOrDefault();

            var userNotification = _context.Notification.Where(x => x.UserId == userId).ToList();

            var plainTextnotificationString = "Hello, " + user.Email + " this is your Upcoming Schedule:\n";
            var htmlContentnotificationString = "<p>Hello, " + user.Email + " this is your Upcoming Schedule:</p>";

            if (userNotification.Count() > 0)
            {
                foreach (var notification in userNotification)
                {
                    plainTextnotificationString += "\nShow Name: " + notification.ShowName + "\n" + "Season: " + notification.Season + "\n" + "Episode: " + notification.Episode + "\n" + "Date: " + notification.Date + "\n" + "Time: " + notification.Time + "\n";

                    htmlContentnotificationString += "<p>Show Name: " + notification.ShowName + "<br>" + "Season: " + notification.Season + "<br>" + "Episode: " + notification.Episode + "<br>" + "Date: " + notification.Date + "<br>" + "Time: " + notification.Time + "</p>";
                }
            }
            else
            {
                plainTextnotificationString += "\nYou have no upcoming tv show episodes";

                htmlContentnotificationString += "<p>You have no upcoming tv show episodes</p>";
            }

            var apiKey = _configuration["EmailSettings:ApiKey"];
            var apiEmail = _configuration["EmailSettings:SenderEmail"];
            var client = new SendGridClient(apiKey);
            var from_email = new EmailAddress(apiEmail, "StreamWatch");
            var subject = "StreamWatch: TV Shows Coming Up";
            var to_email = new EmailAddress(user.Email, user.Email);

            var plainTextContent = plainTextnotificationString;
            var htmlContent = htmlContentnotificationString;
            var msg = MailHelper.CreateSingleEmail(from_email, to_email, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg).ConfigureAwait(false);

        }


        /// <summary>
        /// This is the Get method for the Search page where the user can see the Search Page, if the user is logged in.
        /// </summary>
        [HttpGet]
        public IActionResult Search()
        {
            return View();

        }

        // POST: User/Search
        /// <summary>
        /// This is the Post method is for the Search page where the user will save their liked content, if the user is logged in. 
        /// This method checks for duplicate entries so that the user does not like a content again. If the user is not logged in
        /// then the method redirects to the login page.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Search(string[] clickedResult, Search search)
        {

            var userId = HttpContext.Session.GetInt32("UserId");

            var clickId = Convert.ToInt32(clickedResult[0]);

            bool hasDuplicates = false;

            if (userId != null || userId != 0)
            {
                var checkForDuplicates = _context.Search.Where(query => query.UserId == userId && query.ContentId == clickId).ToList();

                if (checkForDuplicates.Count() == 0)
                {

                    hasDuplicates = false;

                    var tvMazeApiHost = _configuration["TvMaze:X-RapidAPI-Host"];
                    var tvMazeApiKey = _configuration["TvMaze:X-RapidAPI-Key"];

                    search.ContentId = Convert.ToInt32(clickedResult[0]);
                    search.Name = clickedResult[2];
                    search.TypeOfContent = clickedResult[4];
                    search.Year = Convert.ToInt32(clickedResult[3]);
                    search.Image = clickedResult[6];
                    search.UserId = (int)userId;


                    if (search.TypeOfContent == "tv" || search.TypeOfContent == "tv " || search.TypeOfContent == "TV")
                    {
                        var client = new HttpClient();

                        var request = new HttpRequestMessage
                        {
                            Method = HttpMethod.Get,
                            RequestUri = new Uri("https://api.tvmaze.com/singlesearch/shows?q=" + search.Name),
                            Headers =
                                {
                                { "X-RapidAPI-Key", tvMazeApiHost },
                                { "X-RapidAPI-Host", tvMazeApiKey },
                                },
                        };

                        using (var response = await client.SendAsync(request))
                        {
                            response.EnsureSuccessStatusCode();

                            var body = await response.Content.ReadAsStringAsync();

                            var deserializedClass = JsonConvert.DeserializeObject<TVMaze>(body);

                            if (deserializedClass != null)
                            {
                                search.TvMazeId = deserializedClass.Id;
                            }
                        }


                    }

                    if (hasDuplicates == false)
                    {
                        _context.Search.Add(search);
                        _context.SaveChanges();
                    }

                    return Json(new { hasDuplicates });

                }
                else
                {
                    hasDuplicates = true;

                    return Json(new { hasDuplicates });
                }

            }

            else
            {
                return RedirectToAction("Login", "Login");
            }

        }

        /// <summary>
        /// This is the Post method to get the API data when a user enters a search term in the search bar in the Search page.
        /// <summary>
        [HttpPost]
        public async Task<JsonResult> SearchResults(string searchName)
        {
            var watchModeKey = _configuration["WatchMode:Key"];

            var url = "https://api.watchmode.com/v1/autocomplete-search/?apiKey=" + watchModeKey + "&search_value=" + searchName;

            var client = new HttpClient
            {
                BaseAddress = new Uri(url)
            };

            client.DefaultRequestHeaders.Accept.Add(
             new MediaTypeWithQualityHeaderValue("application/json"));
            var responses = client.GetAsync(url).Result;
            var response = await responses.Content.ReadAsStringAsync();

            var myDeserializedClass = JsonConvert.DeserializeObject<Contents>(response);

            if (myDeserializedClass != null)
            {
                return Json(myDeserializedClass.Results);
            }
            else
            {
                return Json("No Results");
            }

        }

        // GET: User/List
        /// <summary>
        /// This is the Get method for the List page where the user can see their liked content, if the user is logged in. If the 
        /// user is not logged in then the user will be redirected to the login page.
        /// </summary>
        [HttpGet]
        public IActionResult List()
        {

            var userId = HttpContext.Session.GetInt32("UserId");
            
            var userList = _context.Search.Where(user => user.UserId == userId).ToList();

            if (userId != null && userList != null)
            {
                return View(userList);
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }

        }


        // GET: User/Details/5
        /// <summary>
        /// This is the Get method to get the API data for a specific liked content when the user clicks the detail link in the user 
        /// list page, if the user is logged in.
        ///</summary>
        public async Task<IActionResult> Details(int? id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            var url = "";
            if (id == null)
            {
                return BadRequest();
            }
            else
            {
                var listDetails = _context.Search.Where(search => search.ID == id && search.UserId == userId).FirstOrDefault();
                
                var watchModeKey = _configuration["WatchMode:Key"];

                if (listDetails == null)
                {
                    return NotFound();
                }

                if (listDetails.TypeOfContent == "tv" || listDetails.TypeOfContent == "tv " || listDetails.TypeOfContent == "movie" || listDetails.TypeOfContent == "movie ")
                {
                    url = "https://api.watchmode.com/v1/title/" + listDetails.ContentId + "/details/?apiKey=" + watchModeKey + "&append_to_response=sources";
                }
                else
                {
                    url = "https://api.watchmode.com/v1/person/" + listDetails.ContentId + "/details/?apiKey=" + watchModeKey;
                }

                var client = new HttpClient
                {
                    BaseAddress = new Uri(url)
                };

                client.DefaultRequestHeaders.Accept.Add(
                 new MediaTypeWithQualityHeaderValue("application/json"));
                var responses = client.GetAsync(url).Result;
                var response = await responses.Content.ReadAsStringAsync();

                if (listDetails.TypeOfContent == "tv" || listDetails.TypeOfContent == "tv " || listDetails.TypeOfContent == "movie" || listDetails.TypeOfContent == "movie ")
                {
                    var myDeserializedClass = JsonConvert.DeserializeObject<TitleDetails>(response);
                    return View(myDeserializedClass);
                }
                else
                {

                    TempData["PersonDetails"] = response;
                    return RedirectToAction("PersonDetails");
                }


            }
        }

        /// <summary>
        /// This is Get method gets the API data from the TempData["PersonDetails"] variable for a specific liked person content 
        /// when the user clicks the detail link in the user list page. The user must be logged in or the user will be redirected
        /// to the login page.
        ///</summary>
        [HttpGet]
        public IActionResult PersonDetails()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            var jsonData = TempData["PersonDetails"]?.ToString();

            if (userId != null)
            {
                if (jsonData != null)
                {
                    var response = JsonConvert.DeserializeObject<TitlePersonDetails>(jsonData);
                    return View(response);
                }
                else
                {
                    return NotFound();
                }
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }


        }

        // GET: User/Delete/5
        /// <summary>
        /// This is the Get method for the Delete page where the user can delete a content. The user must be logged in to see the 
        /// Delete page. If the user is not logged in then the user will be redirected to the login page.
        /// </summary>
        public IActionResult Delete(int? id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId != null)
            {
                if (id == null)
                {
                    return BadRequest();
                }

                var DeleteSearchListItem = _context.Search.Find(id);

                if (DeleteSearchListItem == null)
                {
                    return NotFound();
                }


                return View(DeleteSearchListItem);
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }

        // POST: User/Delete/5
        /// <summary>
        /// This is the Post method for the Delete page where the user can delete a content when the user clicks the delete 
        /// button and it will be deleted from the database. The user must be logged in to see the Delete Page. If the user is 
        /// not logged in then the user will be redirected to the login page. The method also deletes any notifications and 
        /// calendar events the are associated with the deleted content.
        /// </summary>
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId != null)
            {
                var DeleteSearchListItem = _context.Search.Find(id);

                if (DeleteSearchListItem != null)
                {

                    var DeleteNotificationListItem = _context.Notification.Where(notification => notification.ShowName == DeleteSearchListItem.Name && notification.UserId == userId).ToList();
                    if (DeleteNotificationListItem.Count() > 0)
                    {
                        foreach (var DeleteNotification in DeleteNotificationListItem)
                        {

                            _context.Notification.Remove(DeleteNotification);
                        }
                    }

                    var DeleteEventItemList = _context.Calendar.Where(calendar => calendar.ShowName == DeleteSearchListItem.Name && calendar.UserId == userId).ToList();
                    if (DeleteEventItemList.Count() > 0)
                    {
                        foreach (var DeleteEvent in DeleteEventItemList)
                        {

                            _context.Calendar.Remove(DeleteEvent);
                        }
                    }
                    _context.Search.Remove(DeleteSearchListItem);
                    _context.SaveChanges();

                    return RedirectToAction("List");

                }
                else
                {
                    return View();
                }
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }

        /// <summary>
        /// This method does an API call to tvmaze if the user is logged in and gets the episodes information for all tv shows that 
        /// the user has liked. If the user is not logged in or has not liked any tv shows then it will return Nothing
        /// </summary>
        public async Task<IActionResult> ContentTime()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId != null)
            {
                var search = _context.Search.Where(query => query.UserId == userId).ToList();

                if (search != null && search.Count > 0)
                {
                    var client = new HttpClient();

                    var listOfEpisodes = new List<List<ContentInfo>>();

                    var tvMazeApiHost = _configuration["TvMaze:X-RapidAPI-Host"];
                    var tvMazeApiKey = _configuration["TvMaze:X-RapidAPI-Key"];

                    foreach (var item in search)
                    {
                        if (item.TvMazeId != 0)
                        {
                            var request = new HttpRequestMessage
                            {
                                Method = HttpMethod.Get,
                                RequestUri = new Uri("https://api.tvmaze.com/shows/" + item.TvMazeId + "/episodes"),
                                Headers =
                                {
                                { "X-RapidAPI-Key", tvMazeApiKey },
                                { "X-RapidAPI-Host", tvMazeApiHost },
                                },
                             };
                            using (var response = await client.SendAsync(request))
                            {
                                response.EnsureSuccessStatusCode();
                                var body = await response.Content.ReadAsStringAsync();


                                var deserializedClass = JsonConvert.DeserializeObject<List<ContentInfo>>(body);

                                if (deserializedClass != null)
                                {
                                    listOfEpisodes.Add(deserializedClass);
                                }

                            }
                        }
                    }
                    return Json(listOfEpisodes);
                }
                else
                {
                    return View();
                }
            }
            else
            {
                return Json("Nothing");
            }
        }

        /// <summary>
        /// This method gets the show name, type of content of the show and adds to showNameList variable then the method returns
        /// the showNameList. If the user is not logged in, or user id does not exist in the database, or the user has not liked 
        /// any tv show then the method will return Nothing.
        /// </summary>
        public IActionResult GetShowName()
        {
            
            var userId = HttpContext.Session.GetInt32("UserId");

            var search = _context.Search.Where(query => query.UserId == userId).ToList();

            var showNameList = new List<ShowName>();

            if (search != null && search.Count > 0)
            {

                foreach (var item in search)
                {
                    ShowName show = new ShowName
                    {
                        Name = item.Name
                    };
                    showNameList.Add(show);
                }

                return Json(showNameList);
            }
            else
            {
                return Json("Nothing");
            }
        }

        // GET: User/Calendar
        /// <summary>
        /// This is the Get method for the Calendar page where the user can see the Calendar page if the user is logged in. If the
        /// user is not logged then the user will be redirect to the login page.
        /// </summary>
        [HttpGet]
        public IActionResult Calendar()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId != null)
            {
                return View();
            }else
            {
                return RedirectToAction("Login", "Login");
            }
        }

        /// <summary>
        /// This is Post method checks if the user clicked an event on the Calender page. The method will save the event information
        /// to the database
        /// </summary>
        [HttpPost]
        public void ClickedEvent(int eventId, string showName)
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            var check = _context.Calendar.Where(calendar => calendar.EventId == eventId && calendar.UserId == userId).FirstOrDefault();

            if (check == null)
            {
                var calenderEvent = new Calendar
                {
                    EventId = eventId,
                    ShowName = showName,
                    isClicked = true,
                    UserId = (int)userId,

                };

                _context.Calendar.Add(calenderEvent);

                _context.SaveChanges();
            }
        }

        /// <summary>
        /// This is the Get method that gets all the clicked events that the user clicked on in the Calender page.
        /// </summary>
        [HttpGet]
        public List<Calendar>? GetClickedEvent()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            var check = _context.Calendar.Where(calendar => calendar.UserId == userId)
                .Select(calendar => new Calendar { EventId = calendar.EventId, isClicked = calendar.isClicked, }).ToList();

            if (check != null)
            {
                return check;

            }
            else
            {
                return null;
            }


        }

        /// <summary>
        /// This is the method for the user logout where the user can logout of the application, if the user is logged in. If the 
        /// user is not logged in then the user will be redirected to the login page.
        /// </summary>
        public async Task<IActionResult> Logout()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId != null)
            {
                HttpContext.Session.Remove("UserId");

                HttpContext.Session.Remove("UserEmail");

                await HttpContext.SignOutAsync();

                return RedirectToAction("Index", "Home");

            }else
            {
                return RedirectToAction("Login", "Login");
            }
        }

        // GET: User/ForgotPassword
        /// <summary>
        /// This is the Get method for the Forgot Password page where the user can see the Forgot Password
        /// </summary>
        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        // Post: User/ForgotPassword
        /// <summary>
        /// This is the Post method for the Forgot Password page. The method will send a forgot password email link and the user
        /// will be redirect to the home page.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> ForgotPassword(ForgotPassword ForgotPassword)
        {
            if (ModelState.IsValid)
            {

                var user = _context.User.Where(x => x.Email == ForgotPassword.Email).FirstOrDefault();
                if (user != null)
                {
                    var resetToken = GenerateResetToken();
                    user.Token = resetToken;
                    user.ResetTokenExpiration = DateTime.Now.AddMinutes(15);

                    _context.SaveChanges();

                    var resetLink = Url.Action("ResetPassword", "User", new { token = user.Token }, protocol: HttpContext.Request.Scheme);

                    var apiKey = _configuration["EmailSettings:ApiKey"];
                    var apiEmail = _configuration["EmailSettings:SenderEmail"];
                    var client = new SendGridClient(apiKey);
                    var from_email = new EmailAddress(apiEmail, "StreamWatch");
                    var subject = "Forgot Password";
                    var to_email = new EmailAddress(ForgotPassword.Email, ForgotPassword.Email);

                    var plainTextContent = "Forgot Password";
                    var htmlContent = $"<strong>Please click the link to reset your password:</strong> <a href='{resetLink}'>Reset Password</a>";
                    var msg = MailHelper.CreateSingleEmail(from_email, to_email, subject, plainTextContent, htmlContent);
                    var response = await client.SendEmailAsync(msg).ConfigureAwait(false);

                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }
            else
            {
                return View();
            }

        }

        /// <summary>
        /// This is the Get method for the Reset Password page where the user can see the Reset Password page. If the user is not
        /// logged in. If the user is logged in then the user will be redirect to the user home page.
        /// </summary>
        [HttpGet]
        public IActionResult ResetPassword()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId == null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Index", "User");
            }
        }

        /// <summary>
        /// This is the Post method for the Reset Password page where the user can see the Reset Password page. The user can only
        /// change their password if they have a valid token and the token cannot be expired. The method also salts and hashes the
        /// password before saving it to the database. The user will be redirect to the Reset Password Success page if everything
        /// is correct or else the user will see an error message saying Sorry, please check what you have entered!
        /// </summary>
        [HttpPost]
        public IActionResult ResetPassword(ResetPassword resetPassword, string token)
        {

            var user = _context.User.Where(q => q.Email == resetPassword.Email).FirstOrDefault();
            var tokenCheck = _context.User.Where(q => q.Email == resetPassword.Email && q.Token == token).FirstOrDefault();

            var ResetTokenExpirationCheck = _context.User.Where(q => q.Email == resetPassword.Email && q.ResetTokenExpiration > DateTime.UtcNow).FirstOrDefault();

            if (user != null)
            {
                if (ModelState.IsValid)
                {
                    if (tokenCheck == null)
                    {
                        ModelState.AddModelError("InvalidUrl", "Sorry, URL Invalid");
                        return View();
                    }
                    else if (ResetTokenExpirationCheck != null)
                    {

                        ModelState.AddModelError("ExpiredUrl", "Sorry, URL Expired");
                        return View();
                    }
                    else
                    {
                        byte[] salt = RandomNumberGenerator.GetBytes(keySize);
                        user.Salt = salt;
                        var hash = Rfc2898DeriveBytes.Pbkdf2(Encoding.UTF8.GetBytes(resetPassword.Password), salt, iterations, hashAlgorithm, keySize);
                        var hashed = Convert.ToHexString(hash);
                        user.Password = hashed;
                        _context.Update(user);
                        _context.SaveChanges();
                        return RedirectToAction("ResetPasswordSuccess", "User");
                    }
                }
                else
                {
                    ModelState.AddModelError("CheckValues", "Sorry, please check what you have entered!");
                    return View(resetPassword);
                }

            }
            else
            {
                return View(resetPassword);
            }

        }

        /// <summary>
        /// This method generates the reset token by generating a random number
        /// </summary>
        private string GenerateResetToken()
        {
            var bytes = new byte[32];

            using (var randomNum = RandomNumberGenerator.Create())
            {
                randomNum.GetBytes(bytes);
            }
            return Convert.ToBase64String(bytes);
        }

        // GET: User/ResetPasswordSuccess
        /// <summary>
        /// This is the Get method for the Reset Password Success page where the user can see the Reset Password Success
        /// </summary>
        public IActionResult ResetPasswordSuccess()
        {
            return View();
        }

        /// <summary>
        /// This is the sends a email to the user when the user deletes their account
        /// </summary>
        public async Task DeletedUserAccountEmail(int? userId)
        {
            var user = _context.User.Where(x => x.Id == userId).FirstOrDefault();

            var apiKey = _configuration["EmailSettings:ApiKey"];
            var apiEmail = _configuration["EmailSettings:SenderEmail"];
            var client = new SendGridClient(apiKey);
            var from_email = new EmailAddress(apiEmail, "StreamWatch");
            var subject = "StreamWatch: Your account has been Deleted";
            var to_email = new EmailAddress(user.Email, user.Email);

            var plainTextContent = "Thank you, for being a user of StreamWatch. Your account has been deleted, we hope to see you back soon.";
            var htmlContent = "<p>Thank you, for being a user of StreamWatch. Your account has been deleted, we hope to see you back soon.</p>";
            var msg = MailHelper.CreateSingleEmail(from_email, to_email, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg).ConfigureAwait(false);

        }



        // GET: User/DeleteUser
        /// <summary>
        /// This is the Get method for the Delete User page where the user can delete thier account. The user must be logged in 
        /// to see the Delete User page. If the user is not logged in then the user will be redirected to the login page.
        /// </summary>
        [HttpGet]
        public IActionResult DeleteUser()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId != null)
            {
               
                var deleteUser = _context.User.Find(userId);

                if (deleteUser == null)
                {
                    return RedirectToAction("Login", "Login");
                }

                return View(deleteUser);
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }

        // POST: User/DeleteUserConfirmed/5
        /// <summary>
        /// This is the Post method for the Delete User page where the user can delete their account when the user clicks the 
        /// delete button. All Search, Notification, Calendar records are deleted from the database. The method also deletes
        /// the UserId and UserEmail session variable and logs out the deleted user. The user will be sent an email notifying
        /// them that their account was deleted. The user must be logged in to see the Delete User page. If the user is not 
        /// logged in then the user will be redirected to the Login page. 
        /// </summary>
        [HttpPost, ActionName("DeleteUserConfirmed")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteUserConfirmed()
        {

            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId != null)
            {
                var deleteUser = _context.User.Find(userId);

                if (deleteUser != null)
                {
                    var deleteSearchListItems = _context.Search.Where(search => search.UserId == userId).ToList();

                    if (deleteSearchListItems.Count() > 0)
                    {
                        foreach (var deleteSearchItem in deleteSearchListItems)
                        {

                            _context.Search.Remove(deleteSearchItem);
                        }
                    }

                    var deleteNotificationListItems = _context.Notification.Where(notification => notification.UserId == userId).ToList();
                    
                    if (deleteNotificationListItems.Count() > 0)
                    {
                        foreach (var deleteNotification in deleteNotificationListItems)
                        {

                            _context.Notification.Remove(deleteNotification);
                        }
                    }

                    var deleteEventItemList = _context.Calendar.Where(calendar => calendar.UserId == userId).ToList();
                    
                    if (deleteEventItemList.Count() > 0)
                    {
                        foreach (var DeleteEvent in deleteEventItemList)
                        {

                            _context.Calendar.Remove(DeleteEvent);
                        }
                    }
                    await DeletedUserAccountEmail(userId);

                    _context.User.Remove(deleteUser);

                    _context.SaveChanges();

                    HttpContext.Session.Remove("UserId");

                    HttpContext.Session.Remove("UserEmail");

                    await HttpContext.SignOutAsync();

                    return RedirectToAction("Index", "Home");

                }
                else
                {
                    return RedirectToAction("Login", "Login");
                }
            }
            else
            {
                return RedirectToAction("Login", "Login");
            }
        }



    }
}