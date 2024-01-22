using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace StreamWatch_SeniorENG.Databases
{
    [Table("Favourites")]
    public class Search
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        public int ContentId { get; set; }

        [DisplayName("Content Name")]
        public string? Name { get; set; }

        [Range(0, 2023)]
        public int? Year { get; set; }

        [DisplayName("Type Of Content")]
        public string? TypeOfContent { get; set; }
        public string? Image { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public int TvMazeId { get; set; }

    }
}
