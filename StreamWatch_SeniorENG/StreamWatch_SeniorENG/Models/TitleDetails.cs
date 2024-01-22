using System.ComponentModel;

namespace StreamWatch_SeniorENG.Models
{
    public class TitleDetails
    {

        public string? Title { get; set; }

        [DisplayName("Original Title")]
        public string? Original_title { get; set; }

        [DisplayName("Plot Overview")]
        public string? Plot_overview { get; set; }

        [DisplayName("Type")]
        public string? Tmdb_type { get; set; }

        [DisplayName("Runtime Minutes")]
        public int? Runtime_minutes { get; set; }

        public int? Year { get; set; }

        [DisplayName("End Year")]
        public int? End_year { get; set; }

        [DisplayName("Release Date")]
        public string? Release_date { get; set; }

        [DisplayName("Genre Names")]
        public List<string>? Genre_names { get; set; }

        [DisplayName("Audience Rating")]
        public float? User_rating { get; set; }

        [DisplayName("Critic Score")]
        public float? Critic_score { get; set; }

        [DisplayName("US Rating")]
        public string? Us_rating { get; set; }

        [DisplayName("Image")]
        public string? Poster { get; set; }

        [DisplayName("Original language")]
        public string? Original_language { get; set; }

        [DisplayName("Network Names")]
        public List<string>? Network_names { get; set; }

        public List<Source>? Sources { get; set; }
    }

    public class Source
    {

        public string Name { get; set; }

        public string Type { get; set; }

        public string Region { get; set; }

        public string Format { get; set; }

        public float? Price { get; set; }

    }
}
