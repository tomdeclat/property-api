export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST requests allowed' });

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

    const shapedData = {
      epc: {
        currentEnergyRating: result?.epc?.currentEnergyRating || '',
        propertyType: result?.epc?.propertyType || '',
        builtForm: result?.epc?.builtForm || '',
        totalFloorArea: result?.epc?.totalFloorArea?.value || '',
        lodgementDate: result?.epc?.lodgementDate || ''
      },
address: {
  paon: result?.property?.address?.paon || '',
  street: result?.property?.address?.street || '',
  town: result?.property?.address?.town || '',
  county: result?.property?.address?.county || '',
  postcode: result?.property?.address?.postcode || '',
  country: result?.property?.address?.country || 'UK'
}
    };

    res.status(200).json(shapedData);
  } catch (err) {
    console.error('Error fetching property data:', err);
    res.status(500).json({ error: 'Error fetching property data' });
  }
}
