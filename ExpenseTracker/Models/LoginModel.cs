using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Models
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Email is Required.")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Password is Required.")]
        [DataType(DataType.Password)]
        public required string Password { get; set; }

    }
}
