export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { postcode, paon } = req.body;

  try {
    const response = await fetch('https://uk-property-data.p.rapidapi.com/propertytools.api.v1.Public/GetPropertyReport', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'uk-property-data.p.rapidapi.com'
      },
      body: JSON.stringify({ postcode, paon })
    });

    const result = await response.json();

    // 🛠 Shape the response to match frontend expectations
    const shapedData = {
      epc: {
        currentEnergyRating: result?.EnergyRating || '',
        propertyType: result?.PropertyType || '',
        builtForm: result?.BuiltForm || ''
      },
      address: {
        paon: paon || '',
        street: result?.Street || '',
        town: result?.Town || '',
        district: result?.District || '',
        county: result?.County || '',
        postcode: postcode || ''
      }
    };

    res.status(200).json(shapedData);
  } catch (err) {
    console.error('Error fetching property data:', err);
    res.status(500).json({ error: 'Error fetching property data' });
  }
}
