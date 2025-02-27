/**
 * This function creates the alert
 * @param {any} message
 * @param {any} type
 */
function showAlert(message, type)
{
    var alert = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' +
        '<div>' + message + '</div>' +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
        '</div>';

    $("#alert").html(alert);
}

/**
 * This Get ajax call is to display alert to the user to them that they need to confirm their email if the ajax call returns false.
 */
$.ajax({
    url: "/User/IsEmailConfirmed",
    type: "GET",
    success: function (data) {
        if (data == false) {
            showAlert("<strong>Heads up!</strong>, You must confirm your email, please check your junk folder. We will keep sending emails until you click the confirmation link.", "info")

            $('.alert .close').on("click", function (e) {
                $(this).parent().remove();
            });
        } else
        {
            /**
             * This Get ajax call is to display alert once to the user to tell them their email has been confirmed 
             */
            $.ajax({
                url: "/User/GetIsEmailMsg",
                type: "GET",
                success: function (data) {
                    if (data == false) {
                        showAlert("<strong>Thanks!</strong>, You have confirmed your email", "info")

                        $(".alert").fadeTo(5000, 0).slideUp(500, function ()
                        {
                            $(this).remove();
                        });

                        $('.alert .close').on("click", function (e)
                        {
                            $(this).parent().remove();
                        });

                        /**
                         * This ajax call is to set the EmailConfirmationMsg property to true to make sure the user does not see the
                         * alert message again.
                         */
                        $.ajax({
                            url: "/User/IsEmailMsg",
                            type: "POST",
                            success: function (data) {
                            }
                        })
                    }
                }
            })
        }
    }
});
           
        
       
