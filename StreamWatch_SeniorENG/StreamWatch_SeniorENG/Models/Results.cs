namespace StreamWatch_SeniorENG.Models
{
    public class Result
    {
        public string Name { get; set; }
        public double Relevance { get; set; }
        public string Type { get; set; }
        public int Id { get; set; }
        public int? Year { get; set; }
        public string Result_type { get; set; }
        public int Tmdb_id { get; set; }
        public string Tmdb_type { get; set; }
        public string Image_url { get; set; }
    }

    public class Contents
    {
        public List<Result> Results { get; set; }
    }
}
