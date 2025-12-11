export default {
  async fetch(request) {
    // Handle CORS preflight requests to allow the browser to make the actual request.
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    // Get the destination URL and the user's API key from the incoming request.
    const url = new URL(request.url);
    const apiUrl = 'https://api.football-data.org' + url.pathname + url.search;
    const apiKey = request.headers.get('X-Api-Key');

    // Return an error if the API key is missing.
    if (!apiKey) {
      return new Response(JSON.stringify({ message: 'API key is missing.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Prepare the request to the real API.
    const apiRequest = new Request(apiUrl, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    });

    // Make the request to the football-data.org API.
    const response = await fetch(apiRequest);

    // Create a new, mutable response object to add CORS headers.
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'X-Api-Key');

    return newResponse;
  },
};

// CORS headers that will be sent back to the browser.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'X-Api-Key', // This is the custom header we expect from the frontend.
};

// Handles the preflight OPTIONS request from the browser.
function handleOptions(request) {
  const headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // This is a valid preflight request.
    return new Response(null, { headers: corsHeaders });
  } else {
    // This is a standard OPTIONS request.
    return new Response(null, {
      headers: { Allow: 'GET, HEAD, OPTIONS' },
    });
  }
}
