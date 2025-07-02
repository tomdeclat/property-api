export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { postcode, paon } = req.body;

  if (!postcode || !paon) {
    return res.status(400).json({ error: "Missing postcode or house number" });
  }

  try {
    const response = await fetch("https://uk-property-data.p.rapidapi.com/propertytools.api.v1.Public/GetPropertyReport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "uk-property-data.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY
      },
      body: JSON.stringify({ postcode, paon })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching property data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
