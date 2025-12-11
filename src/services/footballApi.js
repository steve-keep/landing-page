const BURNLEY_ID = 328;

function getSettings() {
  return {
    apiKey: localStorage.getItem('apiKey'),
    workerUrl: localStorage.getItem('workerUrl'),
  };
}

function ensureHttps(url) {
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return `https://${url}`;
  }
  return url;
}

async function fetchFromApi(endpoint) {
  let { apiKey, workerUrl } = getSettings();

  if (!apiKey || !workerUrl) {
    throw new Error('API key or Worker URL is not set.');
  }

  workerUrl = ensureHttps(workerUrl);

  const response = await fetch(`${workerUrl}${endpoint}`, {
    headers: {
      'X-Api-Key': apiKey,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An API error occurred.');
  }

  return response.json();
}

export const fetchBurnleyResults = () =>
  fetchFromApi(`/v4/teams/${BURNLEY_ID}/matches?status=FINISHED&limit=5`);

export const fetchBurnleyMatches = () =>
  fetchFromApi(`/v4/teams/${BURNLEY_ID}/matches?status=SCHEDULED&limit=5`);

export const fetchPremierLeagueTable = () =>
  fetchFromApi(`/v4/competitions/PL/standings`);
