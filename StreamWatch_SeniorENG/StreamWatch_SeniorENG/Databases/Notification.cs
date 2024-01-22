using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StreamWatch_SeniorENG.Databases
{
    [Table("Notification")]
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int NotificationId { get; set; }
        public string ShowName { get; set; }
        public int Season { get; set; }
        public int Episode { get; set; }
        public string Time { get; set; }
        public string Date { get; set; }
        public bool IsDeleted { get; set; }
        public string? TypeOfContent { get; set; }
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
