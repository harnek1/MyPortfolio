export default async function handler(req, res) {
    const { id } = req.query;
  
    if (!id) {
      return res.status(400).json({ error: "Missing search query `id`" });
    }
  
    const API_KEY = process.env.API_KEY;
  
    try {
      const response = await fetch(`https://superheroapi.com/api/${API_KEY}/${encodeURIComponent(id)}`);
  
      if (!response.ok) {
        throw new Error("Failed to fetch from Superhero API");
      }
  
      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*"); // If needed
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }