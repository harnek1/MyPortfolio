using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Models
{
    public class ForgotPasswordModel
    {
        [Required(ErrorMessage = "Email is Required.")]
        public required string Email { get; set; }
    }
}
