using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StreamWatch_SeniorENG.Databases
{
    [Table("User")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Display(Name = "Email Address")]
        [Required(ErrorMessage = "The email address is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }

        public bool ConfirmedEmail { get; set; }

        public bool EmailConfirmationMsg { get; set; }

        [Display(Name = "Password")]
        [Required(ErrorMessage = "The Password is required")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public byte[]? Salt { get; set; }

        public DateTime LastLogin { get; set; }

        public string? Token { get; set; }

        public DateTime? ResetTokenExpiration { get; set; }

    }
}
