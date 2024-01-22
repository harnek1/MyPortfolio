using System.ComponentModel.DataAnnotations;

namespace StreamWatch_SeniorENG.Models
{
    public class ForgotPassword
    {
        [Required(ErrorMessage = "Email is Required.")]
        public string Email { get; set; }
    }
}
