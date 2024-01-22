using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using StreamWatch_SeniorENG.Databases;
using StreamWatch_SeniorENG.Models;

namespace StreamWatch_SeniorENG.Controllers
{
    public class NotificationController : Controller
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
        /// This constructor initializes the database variable context so that the database can be accessed to do CRUD operations
        /// </summary>
        /// <param name="context"></param>
        public NotificationController(DatabaseContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// This method does an API call to tvmaze if the user is logged in and gets the episodes information for all tv shows that
        /// the user has liked.If the user is not logged in or has not liked any tv shows then it will return Nothing
        /// </summary>
        public async Task<IActionResult> ContentTime()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            var search = _context.Search.Where(query => query.UserId == userId).ToList();

            if (userId != null)
            {

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
                    return Json("Nothing");
                }
            }else
            {
                return Json("Nothing");
            }
        }

        /// <summary>
        /// This GET method gets the show name, type of content of the show and adds to showNameList variable then the method 
        /// returns the showNameList.If the user is not logged in, or user id does not exist in the database, or the user has not 
        /// liked any tv show then the method will return Nothing.
        /// </summary>
        [HttpGet]
        public IActionResult GetShowName()
        {
            var showNameList = new List<ShowName>();

            var userId = HttpContext.Session.GetInt32("UserId");

            var search = _context.Search.Where(query => query.UserId == userId).ToList();

            if (userId != null)
            {
                if (search != null && search.Count > 0)
                {

                    foreach (var show in search)
                    {

                        ShowName showInfo = new ShowName
                        {
                            Name = show.Name,
                            TypeOfContent = show.TypeOfContent
                        };
                        showNameList.Add(showInfo);

                    }

                    return Json(showNameList);
                }
                else
                {
                    return Json("Nothing");
                }
            }else
            {
                return Json("Nothing");
            }
        }


        /// <summary>
        /// This method saves notifications to the database. An ajax call send the notificationsList array with all the
        /// notifications and saves all the notifications in the database if the TypeOfContent is tv.If the listOfNotifications 
        /// variable is not null then the method will return all the notifications for the user.If the user id or the user is not in
        /// the database then the method will return null.
        /// </summary>
        public List<Notification>? SaveNotifications(Notification[] notificationsList)
        {

            var userId = HttpContext.Session.GetInt32("UserId");

            var user = _context.User.Where(user => user.Id == userId).FirstOrDefault();

            if (userId != null && user != null && userId != 0)
            {
               
                foreach (var notification in notificationsList)
                {


                    var newNotification = new Notification
                    {
                        NotificationId = notification.NotificationId,
                        ShowName = notification.ShowName,
                        Season = notification.Season,
                        Episode = notification.Episode,
                        Time = notification.Time,
                        Date = notification.Date,
                        TypeOfContent = notification.TypeOfContent,
                        UserId = (int)userId,
                        IsDeleted = notification.IsDeleted,

                    };

                    var checkForDup = _context.Notification.Where(Notification => Notification.NotificationId == notification.NotificationId && Notification.ShowName == notification.ShowName && Notification.Season == notification.Season && Notification.Episode == notification.Episode && Notification.UserId == userId).FirstOrDefault();
                        
                    if (checkForDup == null)
                    {
                        if (notification.TypeOfContent == "tv ")
                        {
                            _context.Notification.Add(newNotification);
                        }

                    }
                    else
                    {
                        continue;
                    }
                }

                _context.SaveChanges();

                var listOfNotifications = _context.Notification.Where(notification => notification.UserId == userId)
                .Select(notification => new Notification
                {
                    NotificationId = notification.NotificationId,
                    ShowName = notification.ShowName,
                    Season = notification.Season,
                    Episode = notification.Episode,
                    Time = notification.Time,
                    Date = notification.Date,
                    IsDeleted = notification.IsDeleted
                }).ToList();

                if (listOfNotifications != null)
                {
                    return listOfNotifications;

                }
                else
                {
                    return null;
                }

            }
            else
            {
                return null;
            }

        }

        /// <summary>
        /// This get method get the user notifications. If the user is logged in and if the notificationList variable count is 
        /// greater than zero then method will return the notificationList variable. if the user is not logged in or the 
        /// notificationList variable count is null, the method will return null.
        /// </summary>
        [HttpGet]
        public List<Notification>? GetNotifications()
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId != null)
            {

                var notificationList = _context.Notification.Where(notification => notification.UserId == userId)
                 .Select(notification => new Notification
                 {
                     NotificationId = notification.NotificationId,
                     ShowName = notification.ShowName,
                     Season = notification.Season,
                     Episode = notification.Episode,
                     Time = notification.Time,
                     Date = notification.Date,
                     IsDeleted = notification.IsDeleted
                 })
                 .ToList();

                if (notificationList.Count() > 0)
                {
                    return notificationList;

                }else
                {
                    return null;
                }

            }else
            {
                return null;
            }

        }

        /// <summary>
        /// This post method checks if the user id and the user variables are is not null. If the userId and the user variables are
        /// not null then the method makes the IsDeleted property of the notification to true. The method updates and saves the
        /// changes to the database.
        /// </summary>
        [HttpPost]
        public void IsDeletedNotification(Notification notifications)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            var user = _context.User.Where(user => user.Id == userId).FirstOrDefault();

            if (userId != null && user != null)
            {  
                var check = _context.Notification.Where(Notification => Notification.NotificationId == notifications.NotificationId && Notification.ShowName == notifications.ShowName && Notification.Season == notifications.Season && Notification.Episode == notifications.Episode && Notification.UserId == userId).FirstOrDefault();

                if (check != null)
                {
                    check.IsDeleted = true;
                    _context.Notification.Update(check);
                    _context.SaveChanges();
                }
            }

        }

        /// <summary>
        /// This method checks if the notification is deleted. If the userId and user variables are not null. If the variables are 
        /// null or the check variable is null the method return false. If the userId and user variables are not null and the check 
        /// variable is not null then the method checks if the IsDeleted property is true for the notification and if it is the the 
        /// method returns true else the method returns false.
        /// </summary>
        public bool GetIsDeletedNotification(Notification notification)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
           
            if (userId != null)
            {
                var user = _context.User.Where(user => user.Id == userId).FirstOrDefault();

                if (user != null)
                {
                    var check = _context.Notification.Where(Notification => Notification.ShowName == notification.ShowName && Notification.Season == notification.Season && Notification.Episode == notification.Episode && Notification.UserId == userId).FirstOrDefault();

                    if (check != null)
                    {
                        if (check.IsDeleted == true)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }

                    }
                    else
                    {
                        return false;
                    }

                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
    }
}





