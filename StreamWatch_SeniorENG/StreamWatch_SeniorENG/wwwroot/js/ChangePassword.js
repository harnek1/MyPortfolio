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
 * This click event send the form data to the ChangePassword method via an ajax call. If the ajax call is successful and return data
 * is true then all the error messages, input fields are cleared, and an alert message saying Your password has been changed! is 
 * displayed to the user. If the return data is false then the input fields are cleared and the user see an alert that says 
 * Sorry, your password cannot been changed!
 */
$(document).on("click", "button", function (event)
{
    event.preventDefault();
    var formData =
    {
        Password: $("#password").val(),
        ConfirmPassword: $("#confirmPassword").val()
    };

    $.ajax({
        url: "/AccountSettings/ChangePassword",
        type: "POST",
        data: formData,
        success: function (data) {
            console.log("data", data)
            alertMessage = ""; 
            if (data.isPasswordChanged == true) {
                $("#errMessage").text("");
                $("#password").val("");
                $("#confirmPassword").val("");
                showAlert("Your password has been changed!", "success");
                $(".alert").fadeTo(6000, 0).slideUp(500, function ()
                {
                    $(this).remove();
                });


                $('.alert .close').on("click", function (e)
                {
                    $(this).parent().remove();
                });
 
            } else
            {
                $("#password").val("");

                $("#confirmPassword").val("");

                showAlert("Sorry, your password cannot been changed!", "danger");
                $(".alert").fadeTo(6000, 0).slideUp(500, function () {
                    $(this).remove();
                });

                $('.alert .close').on("click", function (e) {
                    $(this).parent().remove();
                });
                
            }

            if (data.errorMessage) {
                $("#errMessage").text(data.errorMessage);
            }
        }
    });
})