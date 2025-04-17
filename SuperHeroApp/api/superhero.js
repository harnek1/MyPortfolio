export default async function handler(req, res) {
    const { q } = req.query;
  
    if (!q) {
      return res.status(400).json({ error: "Missing search query `q`" });
    }
  
    const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
  
    try {
      const response = await fetch(`https://superheroapi.com/api/${API_KEY}/search/${encodeURIComponent(q)}`);
  
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
  