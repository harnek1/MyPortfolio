
/**
 * This the list of notification
 */
let notifications = new Set();

/**
 * This the notification count
 */
let notificationsCount = 0;

/**
 * This function is to display the notifications in the dropdown list
 */
function displayNotifications()
{
    const notificationList = document.getElementById('notificationList');

    const triggerNotificationButton = document.getElementById('triggerNotificationButton');

    if (triggerNotificationButton)
    {
        
        triggerNotificationButton.addEventListener('click', function ()
        {
           
            notificationList.style.display = (notificationList.style.display === "block") ? "none" : "block";

        });
    }

  
    
    if (notificationList)
    {

        notificationList.innerHTML = '';

        var id = 0;

        var showNames = [];

       /**
        * This Get ajax call is to get all the show names of the content that the user liked. If the ajax call is successful and the 
        * typeOfContent is equal to tv the return data will be added to the showNames array.
        */
        $.ajax({
            url: "/Notification/GetShowName",
            type: "GET",
            success: function (data)
            {
                if (data != "Nothing")
                {

                    for (var i = 0; i < data.length; i++)
                    {

                        if (data[i].typeOfContent == "tv" || data[i].typeOfContent == "tv ")
                        {
                            showNames.push({ name: data[i].name, typeOfContent: data[i].typeOfContent })
                        }
                    }
                   
                    $.ajax({
                        url: "/Notification/ContentTime",
                        type: "GET",
                        dataType: "json",
                        success: function (data)
                        {
                            if (data != "Nothing")
                            {
                                for (var i = 0; i < data.length; i++)
                                {

                                    var showName = showNames[i].name;

                                    var typeOfContent = showNames[i].typeOfContent;
          
                                    for (var j = 0; j < data[i].length; j++)
                                    {
                                        var startDate = data[i][j].airstamp;

                                        var season = data[i][j].season

                                        var episode = data[i][j].number

                                        const startDateNewFormat = new Date(startDate);

                                        /**
                                         * This makes the start date to local date
                                         */
                                        const StartDatelocalDate = startDateNewFormat.toLocaleDateString();

                                        /**
                                         * This makes the start time to local time
                                         */
                                        const StartDatelocalTime = startDateNewFormat.toLocaleTimeString();

                                        const currentDate = new Date();

                                        if (startDateNewFormat >= currentDate)
                                        {

                                            id++;

                                            /**
                                             * This creates the notification data
                                             */
                                            var message = { "NotificationId": id, "ShowName": showName, "Season": season, "Episode": episode, "Date": StartDatelocalDate, "Time": StartDatelocalTime, "IsDeleted": false, "TypeOfContent": typeOfContent };

                                            // This calls the addNotificationToArray() function and passes the message variable
                                            addNotificationToArray(message);

                                        }

                                    }

                                }


                                // This calls the saveNotifications() function
                                saveNotifications();

                                // This calls the updateUI() function
                                updateUI();


                            }
                        }

                    });
                }
               
            }
        });
    }
}


/**
 * This function updates the UI with the notifications and the notification count is updated. The function does a ajax call to get all
 * the saved notifications and if the notification is not deleted, the user will see the notification in the notification dropdown 
 * list.
 */
function updateUI() {
   
    updateNotificationCount()
    $.ajax({
        url: "/Notification/SaveNotifications",
        type: "GET",
        success: function (data)
        {
            if (data != null)
            {
               
                notifications.clear();
             
                for (var notification of data)
                {
                    if (notification.isDeleted != true)
                    {
                        
                        notifications.add(notification);
                    }
                    
                    
                }
            }

           
            const notificationList = document.getElementById('notificationList');
           
            if (notificationList)
            {
                notificationList.innerHTML = '';
            }
           
           
            for (const notification of notifications)
            {
                const listItemShownName = document.createElement('div');

                listItemShownName.setAttribute('class', 'notification-item');

                listItemShownName.id = notification.notificationId;

                listItemShownName.innerHTML = `<p class="text-light" style="cursor:auto;"> Name: ${notification.showName} <br> Season: ${notification.season} <br> Episode: ${notification.episode} <br> Date: ${notification.date} <br> Time: ${notification.time} </p> <button class='btn clear-notification'>X</button> <hr>`;

                notificationList.appendChild(listItemShownName);
            }
            
            
            const clearNotificationButtons = document.querySelectorAll('.clear-notification');

            if (clearNotificationButtons)
            {
                clearNotificationButtons.forEach(button =>
                {
                    const id = button.closest("div").id;

                    // This click event will call the clearNotification() function and pass the id of the notification
                    button.addEventListener('click', () => clearNotification(id));
                });
            }

            // This calls the checkForNoNotifications
            checkForNoNotifications();
        }
    });
 
}

/**
 * This function adds a notification to the array, increments the notificationsCount variable, and calls the updateNotificationCount()
 * function
 * @param {any} message
 */
function addNotificationToArray(message)
{
    notifications.add(message);
   
    notificationsCount++; 

    updateNotificationCount();
   
}

/**
 * This function updates the notification count
 */
function updateNotificationCount() {
    const notificationCount = document.getElementById('notificationCount');
  
    if (notificationCount) {
        notificationCount.textContent = notificationsCount;
    }
}

/**
 * This function checks if the notification list has no notifications and displays to the user, No Notifications!
 */
function checkForNoNotifications()
{
   
    if (notificationsCount == 0)
    {
        const notificationList = document.getElementById('notificationList');

        if (notificationList)
        {
            const noNotifications = document.createElement('p');

            noNotifications.setAttribute("class", "text-light");

            noNotifications.innerHTML = "No Notifications!";

            notificationList.innerHTML = '';

            notificationList.appendChild(noNotifications);
        }
    }
}

/**
 * This function does a post ajax call to SaveNotifications method to send the notifications. Then the function calls the updateUI()
 * function. Next the function does a get ajax call to the GetNotifications method and when the ajax call returns successfully then 
 * the updateNotificationCount() and checkForNoNotifications() functions are called
 */
function saveNotifications()
{
  
    let notificationData = [];

    notifications.forEach(notification =>
    {
        notificationData.push(notification)
        
    });
  
    $.ajax({
        url: "/Notification/SaveNotifications",
        type: "POST",
        data: { notificationsList: notificationData },
        success: function ()
        {
           
            updateUI();

            $.ajax({
                url: "/Notification/GetNotifications",
                type: "GET",
                success: function (data)
                {
                    
                    notificationsCount = 0
                    var notificationsCount2 = 0
                    
                    data.forEach(note =>
                    {
                       
                        if (note.isDeleted == false)
                        {
                            notificationsCount2++
                        }
                    })

                    notificationsCount = notificationsCount2

                    updateNotificationCount();

                    checkForNoNotifications();
                }
            })
        }
    });
}

/**
 * This function does a Post ajax call to the IsDeletedNotification method and sends the notificationData variable.
 * @param {any} notificationData
 */
function deletedNotification(notificationData)
{
    
    $.ajax({
        url: "/Notification/IsDeletedNotification",
        type: "POST",
        dataType: "json",
        data: { notifications: notificationData },
        success: function (data)
        {
        }
    });
}

/**
 * This function deletes the notification from the notification list then the function calls the deletedNotification(), decrements
 * the notificationsCount variable, calls the updateNotificationCount() and checkForNoNotifications() functions.
 * @param {any} id
 */
function clearNotification(id)
{
    
    const notificationList = document.getElementById('notificationList');

    const notificationToRemove = document.getElementById(id);

    if (notificationToRemove)
    {
        let notificationData;

        notifications.forEach(note =>
        {
           
            if (note.notificationId == id)
            {
                notificationData =
                {
                    NotificationId: note.notificationId,
                    ShowName: note.showName,
                    Season: note.season,
                    Episode: note.episode,
                    Time: note.time,
                    Date: note.date,
                    IsDeleted: note.isDeleted,
                };
            }
        });

        deletedNotification(notificationData)

        notificationList.removeChild(notificationToRemove);

        notificationsCount--;
       
        updateNotificationCount();

        checkForNoNotifications();
       
    }
}

/**
 * This runs soon as the script is detected. It makes the dropdown list for the notifications, calls the displayNotifications() and
 * updateUI() functions.
 */
$(document).ready(function ()
{
    $('.dropdown-toggle').dropdown();
   
    displayNotifications(notifications);

    updateUI();

});