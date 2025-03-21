﻿using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Models
{
    public class ResetPasswordModel
    {
        [Required(ErrorMessage = "Email is Required.")]
        public required string Email { get; set; }

        [Display(Name = "Password")]
        [Required(ErrorMessage = "The Password is required")]
        [RegularExpression(@"^[\S]{0,}[A-Z]{1,}[\S]{0,}[\S]{6,}[0-9]{1,}[\S]{0,}[!@#$%^&*_-]{1,}[\S]{0,}$", ErrorMessage = "The password field must contain at least one uppercase letter, 8 or more characters, and special characters.")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters.")]
        [DataType(DataType.Password)]
        public required string Password { get; set; }

        [Display(Name = "Confirm Password")]
        [Required(ErrorMessage = "The Confirm Password is required")]
        [RegularExpression(@"^[\S]{0,}[A-Z]{1,}[\S]{0,}[\S]{6,}[0-9]{1,}[\S]{0,}[!@#$%^&*_-]{1,}[\S]{0,}$", ErrorMessage = "The confirm password field must contain at least one uppercase letter, 8 or more characters, and special characters.")]
        [MinLength(8, ErrorMessage = "Password must have at least 8 characters.")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string? ConfirmPassword { get; set; }

        public byte[]? Salt { get; set; }
    }
}
