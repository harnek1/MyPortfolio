using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;

namespace StreamWatch_SeniorENG.Models
{
    public class Signup
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Display(Name = "Email Address")]
        [Required(ErrorMessage = "The email address is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }

        public bool ConfirmedEmail { get; set; }

        [Display(Name = "Password")]
        [Required(ErrorMessage = "The Password is required")]
        [RegularExpression(@"^[\S]{0,}[A-Z]{1,}[\S]{0,}[\S]{6,}[0-9]{1,}[\S]{0,}[!@#$%^&*_-]{1,}[\S]{0,}$", ErrorMessage = "The password field must contain at least one uppercase letter, 8 or more characters, and special characters.")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters.")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Display(Name = "Confirm Password")]
        [Required(ErrorMessage = "The Password is required")]
        [RegularExpression(@"^[\S]{0,}[A-Z]{1,}[\S]{0,}[\S]{6,}[0-9]{1,}[\S]{0,}[!@#$%^&*_-]{1,}[\S]{0,}$", ErrorMessage = "The confirm password field must contain at least one uppercase letter, 8 or more characters, and special characters.")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters.")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public byte[]? Salt { get; set; }

        public bool sentSMSCalender { get; set; }

        public DateTime LastLogin { get; set; }

        public string? Token { get; set; }

        public DateTime? ResetTokenExpiration { get; set; }


    }
}
