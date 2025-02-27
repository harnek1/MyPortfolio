using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace StreamWatch_SeniorENG.Models
{
    public class TitlePersonDetails
    {
        [DisplayName("Full Name")]
        public string? full_name { get; set; }

        [DisplayName("First Name")]
        public string? first_name { get; set; }

        [DisplayName("Last Name")]
        public string? last_name { get; set; }

        [DisplayName("Main Profession")]
        public string? main_profession { get; set; }

        [DisplayName("Secondary Profession")]
        public string? secondary_profession { get; set; }

        [DisplayName("Tertiary Profession")]
        public string? tertiary_profession { get; set; }

        [DisplayName("Date of Birth")]
        public string? date_of_birth { get; set; }

        [DisplayName("Date_of_Death")]
        public string? date_of_death { get; set; }

        [DisplayName("Place_of_Birth")]
        public string? place_of_birth { get; set; }

        [DisplayName("Gender")]
        public string? gender { get; set; }

        [DisplayName("Headshot")]
        public string? headshot_url { get; set; }

        [DisplayName("Relevance Percentile")]
        public string? relevance_percentile { get; set; }
       
    }
}
