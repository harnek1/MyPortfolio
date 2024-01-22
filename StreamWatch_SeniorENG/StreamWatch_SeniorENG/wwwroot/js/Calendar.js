/**
 * This event listener makes an ajax call to get all the show names of the content that the user liked. If the ajax 
 * call is successful and the typeOfContent is equal to tv the return data will be added to the showNames array.
 */
document.addEventListener('DOMContentLoaded', function () {
    var newEvent = {}
    var calendarEl = document.getElementById('calendar');
    var showNames = [];
    var eventId = 0;
    $.ajax({
        url: "/Notification/GetShowName",
        type: "GET",

        success: function (data) {
            for (var i = 0; i < data.length; i++)
            {
                
                if (data[i].typeOfContent == "tv" || data[i].typeOfContent == "tv ") {
                    showNames.push({ name: data[i].name, typeOfContent: data[i].typeOfContent })
                }
            }
           
             
        }
    });

    /**
     * This function opens the modal and sets the title, and description for the modal.
     * @param {any} event
     */
    function openModal(event)
    {
        var modal = document.getElementById('modal');

        var title = document.getElementById('modal-title');

        var description = document.getElementById('modal-body');

        if (modal && title && description)
        {
            title.innerHTML = event.title;
            description.innerHTML = event.extendedProps.description || 'No description available';
            modal.style.display = 'block';

            var closeBtn = document.getElementById('closeButton');
            closeBtn.addEventListener('click', function () {
                modal.style.display = 'none';
            });
        } 
    }

    /**
     * This Get ajax call gets the episode details and make the airstamp to local time. Then a new event object is 
     * created and added dto the calendar.
     */
    $.ajax({
        url: "/Notification/ContentTime",
        type: "GET",
        dataType: "json",
        success: function (data)
        {

            for (var i = 0; i < data.length; i++)
            {

                var showName = showNames[i].name;
                
                for (var j = 0; j < data[i].length; j++)
                {

                    var startDate = data[i][j].airstamp
                    var description = data[i][j].summary
                    var Season = data[i][j].season
                    var episode = data[i][j].number
                    var Runtime = data[i][j].runtime
                   
                    if (Runtime == null)
                    {
                        Runtime = " Not available"
                    }

                    if (description == null)
                    {
                        description = " Not available"
                    }

                    const startDateParse = new Date(startDate);

                    // Get the local date and time components
                    const StartDatelocalDate = startDateParse.toLocaleDateString();
                    const StartDatelocalTime = startDateParse.toLocaleTimeString();

                    var currentDate = new Date(startDate);
                    var numberOfMlSeconds = currentDate.getTime();
                    var addMlSeconds = 60 * 60 * 1000;

                    var endDate = new Date(numberOfMlSeconds + addMlSeconds);

                    const endDatelocalDate = endDate.toLocaleDateString();
                    const endDatelocalTime = endDate.toLocaleTimeString();


                    newEvent =
                    {
                        id: eventId,
                        title: showName,
                        start: startDate,
                        end: endDate,
                        description: "Season: " + Season + "<br>Episode: " + episode + "<br>Runtime: " + Runtime + "<br>Start Date: " + StartDatelocalDate + "<br>Start Time: " + StartDatelocalTime + "<br>End Date: " + endDatelocalDate + "<br>End Time: " + endDatelocalTime + "<br>Summary:" + description,
                        allDay: false
                    };

                    calendar.addEvent(newEvent);

                }

            }
           
            var eventElements = document.getElementsByClassName("fc-event");

            // This sets ids to the fc-event class
            for (var i = 0; i < eventElements.length; i++)
            {
                eventId = i
                eventElements[i].setAttribute("id", i);
            }

        }

    }).done(function ()
    {
        /**
         * This get ajax call removes the blue dot from the event if the user clicks on a event
         */
        $.ajax({
            url: "/User/GetClickedEvent",
            type: "GET",
            success: function (data)
            {
               
                for (var i = 0; i < data.length; i++)
                {
                    
                    $(".fc-event[id='" + data[i].eventId + "']").find(".fc-daygrid-event-dot").css("display", "none");
                }

            },
        });
    })
    
    // This variable creates the calender
    var calendar = new FullCalendar.Calendar(calendarEl,
        {

            initialView: 'dayGridMonth',
            headerToolbar:
            {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'

            },
            displayEventEnd: true,
            eventClick: function (info)
            {
                var getEventId = info.el.getAttribute('id');

                var showName = info.event._def.title
                
                eventId = getEventId;

                openModal(info.event)

                /**
                 * This ajax call sends the event id that is clicked to the ClickedEvent method and if the ajax call is
                 * successful the blue dot is removed from the event.
                 */
                $.ajax({
                    url: "/User/ClickedEvent",
                    type: "POST",
                    data: { eventId: eventId, showName: showName },
                    success: function ()
                    {

                       $(".fc-event[id='" + eventId + "']").find(".fc-daygrid-event-dot").css("display", "none");

                    },           

                });
            }
        });

    // This displays the calendar to the user
    calendar.render();

    });
   

