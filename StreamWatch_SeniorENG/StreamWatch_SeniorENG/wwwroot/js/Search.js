/**
 * This function creates the alert
 * @param {any} message
 * @param {any} type
 */
function showAlert(message, type) {
    var alert = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
        '<div>' + message + '</div>' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
        '</div>';
    $("#alert").html(alert);
}

/**
 * This function gets the user search term and executes a Post ajax request to get the API data and display the API data in a table.
 * If the API data does not have the image url of a content then the table will display No image. If the API data does not have the 
 * year the table will display 0 and if the API data does not have name, tmdb_type the table will display No data
 * */
function search()
{
    var searchVal = document.getElementById('search').value;

    $.ajax({
        url: "/User/SearchResults",
        type: "POST",
        dataType: "json",
        data: { "searchName": searchVal },
        success: function (data)
        {
            let table_Data = "<tr>";

            if (data.length > 0)
            {
                for (var i = 0; i < data.length; i++)
                {
                    table_Data += "<td class='contentInfo' id='resultId'>" + data[i].id + "</td>";

                    if (data[i].image_url != "https://cdn.watchmode.com/profiles/")
                    {
                        table_Data += "<td class='contentInfo'>" + '<img class="img-fluid" src="' + data[i].image_url + '">' + "</td>";
                    } else
                    {
                        table_Data += "<td class='contentInfo img-fluid'>" + "No image" + "</td>";
                    }

                    if (data[i].name != null)
                    {
                        table_Data += "<td class='contentInfo'>" + data[i].name + "</td>";

                    } else
                    {
                        table_Data += "<td class='contentInfo'>" + "No data" + "</td>";
                    }

                    if (data[i].year != null)
                    {
                        table_Data += "<td class='contentInfo'>" + data[i].year + "</td>";
                    }
                    else
                    {
                        table_Data += "<td class='contentInfo'>" + 0 + "</td>";
                    }

                    if (data[i].tmdb_type != null)
                    {
                        table_Data += "<td class='contentInfo'>" + data[i].tmdb_type + "</td>";
                    }
                    else
                    {
                        table_Data += "<td class='contentInfo'>" + "No data" + "</td>";
                    }

                    table_Data += "<td>" + '<img id=like style="cursor:pointer;" src="' + "../../Images/star-solid.svg" + '"height="20%" width="20%" border: "none"; cursor: "pointer;">' + "</td>";

                    table_Data += "</tr>";
                }

            }
            else
            {
                table_Data += "<td>No Results</td>"
            }

            $("#body_Output").html(table_Data);
        }
        
    });
}


/**
 * This click event executes if the user clicks the like button the search page. It gets the row information and sends a Post ajax 
 * request to the Search method. The function will display a success alert if the user likes the content. If the content has been 
 * already liked before the click event will display a danger error alert.
 */
$(document).on("click", "#like", function ()
{
    var $row = $(this).closest("tr");
    var $text = $row.find(".contentInfo");

    var textArray = $text.map(function ()
    {
        return $(this).text() + " ";
    }).get();

    var $text = textArray.join("");

    var $img = $row.find("img").attr("src");

    textArray.push(true)

    if ($img == "No image" || $img == "null")
    {
        textArray.push("No image")
    }
    else
    {
        textArray.push($img)
    }

    $.ajax({
        url: "/User/Search",
        type: "POST",
        data: { "clickedResult": textArray },
        success: function (data)
        {
            if (data.hasDuplicates == true)
            {
                showAlert(`<strong>Error!</strong>, You have already liked ${textArray[2]}`, "danger")

                $(".alert").fadeTo(6000, 0).slideUp(500, function ()
                {
                    $(this).remove();
                });


                $('.alert .close').on("click", function (e)
                {
                    $(this).parent().remove();
                });
            }
            else
            {
                showAlert(`<strong>Success!</strong>, You have liked ${textArray[2]}`, "success")

                $(".alert").fadeTo(6000, 0).slideUp(500, function ()
                {
                    $(this).remove();
                });


                $('.alert .close').on("click", function (e)
                {
                    $(this).parent().remove();
                });
            }

        }

    });
})