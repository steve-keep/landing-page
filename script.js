function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// IMPORTANT: Replace with your actual Cloudflare Worker URL
const WORKER_URL = 'YOUR_WORKER_URL';

const BURNLEY_ID = 328;

const burnleyResults = document.getElementById('burnley-results');
const burnleyMatches = document.getElementById('burnley-matches');
const premierLeagueTable = document.getElementById('premier-league-table');
const apiKeyInput = document.getElementById('api-key');
const saveApiKeyButton = document.getElementById('save-api-key');

function getApiKey() {
  return localStorage.getItem('apiKey');
}

function saveApiKey() {
  const apiKey = apiKeyInput.value;
  localStorage.setItem('apiKey', apiKey);
  alert('API Key saved!');
  fetchBurnleyData(); // Refresh data after saving new key
}

function loadApiKey() {
    const savedKey = getApiKey();
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
}

saveApiKeyButton.addEventListener('click', saveApiKey);

function fetchBurnleyData() {
    const API_KEY = getApiKey();
    if (!API_KEY) {
        const errorMessage = '<li>Please add your API key in the Settings tab.</li>';
        burnleyResults.innerHTML = errorMessage;
        burnleyMatches.innerHTML = errorMessage;
        premierLeagueTable.innerHTML = `<tr><td>${errorMessage}</td></tr>`;
        return;
    }

    if (!WORKER_URL || WORKER_URL === 'YOUR_WORKER_URL') {
        const errorMessage = '<li>Please set your Cloudflare Worker URL in the script.js file.</li>';
        burnleyResults.innerHTML = errorMessage;
        burnleyMatches.innerHTML = errorMessage;
        premierLeagueTable.innerHTML = `<tr><td>${errorMessage}</td></tr>`;
        return;
    }

    // Clear previous data/errors
    burnleyResults.innerHTML = '';
    burnleyMatches.innerHTML = '';
    premierLeagueTable.innerHTML = '';

    // Fetch last 5 results
    fetch(`${WORKER_URL}/v4/teams/${BURNLEY_ID}/matches?status=FINISHED&limit=5`, {
        headers: {
            'X-Api-Key': API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.errorCode) {
            throw new Error(data.message);
        }
        if (data.matches.length === 0) {
            burnleyResults.innerHTML = '<li>No recent results found.</li>';
            return;
        }
        data.matches.forEach(match => {
            const li = document.createElement('li');
            li.textContent = `${match.homeTeam.name} ${match.score.fullTime.home} - ${match.score.fullTime.away} ${match.awayTeam.name}`;
            burnleyResults.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error fetching Burnley results:', error);
        burnleyResults.innerHTML = `<li>Could not fetch results. Error: ${error.message}. Please check your API key and network connection.</li>`;
    });

    // Fetch next 5 matches
    fetch(`${WORKER_URL}/v4/teams/${BURNLEY_ID}/matches?status=SCHEDULED&limit=5`, {
        headers: {
            'X-Api-Key': API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.errorCode) {
            throw new Error(data.message);
        }
        if (data.matches.length === 0) {
            burnleyMatches.innerHTML = '<li>No upcoming matches found.</li>';
            return;
        }
        data.matches.forEach(match => {
            const li = document.createElement('li');
            li.textContent = `${match.homeTeam.name} vs ${match.awayTeam.name} on ${new Date(match.utcDate).toLocaleDateString()}`;
            burnleyMatches.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error fetching Burnley matches:', error);
        burnleyMatches.innerHTML = `<li>Could not fetch matches. Error: ${error.message}. Please check your API key and network connection.</li>`;
    });

    // Fetch Premier League table
    fetch(`${WORKER_URL}/v4/competitions/PL/standings`, {
        headers: {
            'X-Api-Key': API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.errorCode) {
            throw new Error(data.message);
        }
        if (!data.standings || data.standings.length === 0) {
            premierLeagueTable.innerHTML = '<tr><td>Could not fetch Premier League table.</td></tr>';
            return;
        }
        const table = data.standings[0].table;
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Position</th>
                <th>Team</th>
                <th>Played</th>
                <th>Won</th>
                <th>Drawn</th>
                <th>Lost</th>
                <th>Points</th>
            </tr>
        `;
        premierLeagueTable.appendChild(thead);

        const tbody = document.createElement('tbody');
        table.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.position}</td>
                <td><img src="${row.team.crest}" alt="${row.team.name}" class="team-crest"> ${row.team.name}</td>
                <td>${row.playedGames}</td>
                <td>${row.won}</td>
                <td>${row.draw}</td>
                <td>${row.lost}</td>
                <td>${row.points}</td>
            `;
            tbody.appendChild(tr);
        });
        premierLeagueTable.appendChild(tbody);
    })
    .catch(error => {
        console.error('Error fetching Premier League table:', error);
        premierLeagueTable.innerHTML = `<tr><td colspan="7">Could not fetch Premier League table. Error: ${error.message}. Please check your API key and network connection.</td></tr>`;
    });
}

// Initial setup
loadApiKey();
fetchBurnleyData();
