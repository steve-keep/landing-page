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

const BURNLEY_ID = 328;

const burnleyResults = document.getElementById('burnley-results');
const burnleyMatches = document.getElementById('burnley-matches');
const premierLeagueTable = document.getElementById('premier-league-table');
const workerUrlInput = document.getElementById('worker-url');
const apiKeyInput = document.getElementById('api-key');
const saveSettingsButton = document.getElementById('save-settings');

function getSettings() {
  return {
    apiKey: localStorage.getItem('apiKey'),
    workerUrl: localStorage.getItem('workerUrl')
  };
}

function saveSettings() {
  const apiKey = apiKeyInput.value;
  const workerUrl = workerUrlInput.value;
  localStorage.setItem('apiKey', apiKey);
  localStorage.setItem('workerUrl', workerUrl);
  alert('Settings saved!');
  fetchBurnleyData(); // Refresh data after saving new settings
}

function loadSettings() {
    const { apiKey, workerUrl } = getSettings();
    if (apiKey) {
        apiKeyInput.value = apiKey;
    }
    if (workerUrl) {
        workerUrlInput.value = workerUrl;
    }
}

saveSettingsButton.addEventListener('click', saveSettings);

function ensureHttps(url) {
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
        return 'https://' + url;
    }
    return url;
}

function fetchBurnleyData() {
    let { apiKey, workerUrl } = getSettings();
    if (!apiKey) {
        const errorMessage = '<li>Please add your API key in the Settings tab.</li>';
        burnleyResults.innerHTML = errorMessage;
        burnleyMatches.innerHTML = errorMessage;
        premierLeagueTable.innerHTML = `<tr><td colspan="7">${errorMessage}</td></tr>`;
        return;
    }

    if (!workerUrl) {
        const errorMessage = '<li>Please add your Cloudflare Worker URL in the Settings tab.</li>';
        burnleyResults.innerHTML = errorMessage;
        burnleyMatches.innerHTML = errorMessage;
        premierLeagueTable.innerHTML = `<tr><td colspan="7">${errorMessage}</td></tr>`;
        return;
    }

    // Ensure the workerUrl has a protocol
    workerUrl = ensureHttps(workerUrl);

    // Clear previous data/errors
    burnleyResults.innerHTML = '';
    burnleyMatches.innerHTML = '';
    premierLeagueTable.innerHTML = '';

    // Fetch last 5 results
    fetch(`${workerUrl}/v4/teams/${BURNLEY_ID}/matches?status=FINISHED&limit=5`, {
        headers: {
            'X-Api-Key': apiKey
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
        burnleyResults.innerHTML = `<li>Could not fetch results. Error: ${error.message}. Please check your settings and network connection.</li>`;
    });

    // Fetch next 5 matches
    fetch(`${workerUrl}/v4/teams/${BURNLEY_ID}/matches?status=SCHEDULED&limit=5`, {
        headers: {
            'X-Api-Key': apiKey
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
        burnleyMatches.innerHTML = `<li>Could not fetch matches. Error: ${error.message}. Please check your settings and network connection.</li>`;
    });

    // Fetch Premier League table
    fetch(`${workerUrl}/v4/competitions/PL/standings`, {
        headers: {
            'X-Api-Key': apiKey
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
        let tableHtml = `
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Team</th>
                    <th>Played</th>
                    <th>Won</th>
                    <th>Drawn</th>
                    <th>Lost</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
        `;
        table.forEach(row => {
            tableHtml += `
                <tr>
                    <td>${row.position}</td>
                    <td><img src="${row.team.crest}" alt="${row.team.name}" class="team-crest"> ${row.team.name}</td>
                    <td>${row.playedGames}</td>
                    <td>${row.won}</td>
                    <td>${row.draw}</td>
                    <td>${row.lost}</td>
                    <td>${row.points}</td>
                </tr>
            `;
        });
        tableHtml += '</tbody>';
        premierLeagueTable.innerHTML = tableHtml;
    })
    .catch(error => {
        console.error('Error fetching Premier League table:', error);
        premierLeagueTable.innerHTML = `<tr><td colspan="7">Could not fetch Premier League table. Error: ${error.message}. Please check your settings and network connection.</td></tr>`;
    });
}

// Initial setup
loadSettings();
fetchBurnleyData();
