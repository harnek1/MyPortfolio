using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Models
{
    public class SignUpModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Display(Name = "First Name")]
        [Required(ErrorMessage = "First Name is required")]
        public required string FirstName { get; set; }

        [Display(Name = "Last Name")]
        [Required(ErrorMessage = "Last Name is required")]
        public required string LastName { get; set; }

        [Display(Name = "Email Address")]
        [Required(ErrorMessage = "The email address is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public required string Email { get; set; }

        public bool ConfirmedEmail { get; set; }

        [Display(Name = "Password")]
        [Required(ErrorMessage = "The Password is required")]
        [RegularExpression(@"^[\S]{0,}[A-Z]{1,}[\S]{0,}[\S]{6,}[0-9]{1,}[\S]{0,}[!@#$%^&*_-]{1,}[\S]{0,}$", ErrorMessage = "The password field must contain at least one uppercase letter, 8 or more characters, and special characters.")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters.")]
        [DataType(DataType.Password)]
        public required string Password { get; set; }

        [Display(Name = "Confirm Password")]
        [Required(ErrorMessage = "The Password is required")]
        [RegularExpression(@"^[\S]{0,}[A-Z]{1,}[\S]{0,}[\S]{6,}[0-9]{1,}[\S]{0,}[!@#$%^&*_-]{1,}[\S]{0,}$", ErrorMessage = "The confirm password field must contain at least one uppercase letter, 8 or more characters, and special characters.")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters.")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string? ConfirmPassword { get; set; }

        public byte[]? Salt { get; set; }

        public DateTime LastLogin { get; set; }

        public string? Token { get; set; }

        public DateTime? ResetTokenExpiration { get; set; }
    }
}
