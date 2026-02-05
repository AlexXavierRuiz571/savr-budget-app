const BASE_URL = "https://cost-of-living-and-prices.p.rapidapi.com";

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = "cost-of-living-and-prices.p.rapidapi.com";

if (!API_KEY) {
  console.warn("Missing VITE_RAPIDAPI_KEY in environment variables");
}

const headers = {
  "x-rapidapi-key": API_KEY,
  "x-rapidapi-host": API_HOST,
};

const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "API request failed");
  }

  return data;
};

/* Fetch list of cities */

export const fetchCities = async () => {
  const res = await fetch(`${BASE_URL}/cities`, {
    method: "GET",
    headers,
  });

  return handleResponse(res);
};

/* Fetch full city details by city_id */

export const fetchCityDetails = async (cityId) => {
  if (!cityId) throw new Error("cityId is required");

  const res = await fetch(
    `${BASE_URL}/prices?city_id=${cityId}`,
    {
      method: "GET",
      headers,
    }
  );

  return handleResponse(res);
};
