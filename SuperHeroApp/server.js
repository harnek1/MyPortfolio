const express = require("express");
const fetch = require("node-fetch");
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3001;

app.get("/api/superhero", async (req, res) => {
  const query = req.query.q;
  const API_KEY = process.env.API_KEY;

  try {
    const response = await fetch(`https://superheroapi.com/api/${API_KEY}/search/${query}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/superhero/:id", async (req, res) => {
    const { id } = req.params;
    const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
  
    try {
      const response = await fetch(`https://superheroapi.com/api/${API_KEY}/${id}`);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
