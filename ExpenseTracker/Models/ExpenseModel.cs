using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Models
{
    public class ExpenseModel
    {
        [Required(ErrorMessage = "Expense Name is Required.")]
        public required string Name { get; set; }

        [Required(ErrorMessage = "Expense Amount is Required.")]
        public required double Amount { get; set; }

        [Required(ErrorMessage = "Expense Category is Required.")]
        public required string Category { get; set; }

        [Required(ErrorMessage = "Expense Category is Required.")]
        public required string Description { get; set; }

        public required DateTime Time { get; set; }


}
}
