# Property Lookup API (Serverless Function)

This folder contains a simple serverless API endpoint for querying property data.

## Setup

1. Copy `.env.example` to `.env` and add your RapidAPI key.
2. Deploy to Vercel or any serverless provider that supports Node.js.
3. Make a POST request to `/api/lookup` with JSON body:

```
{
  "postcode": "SW1A 1AA",
  "paon": "10"
}
```

## Example Response

```json
{
  "epc": {
    "currentEnergyRating": "C",
    "builtForm": "Detached"
  }
}
```